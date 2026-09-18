<script setup lang="ts" generic="O = any, V = any">
import { computed, reactive, ref, watch } from 'vue'
import { nestedSize, useSizeMapping, type Size } from '../../../composables/useSizeProps'
import { useVariantMapping } from '../../../composables/useVariantProps'
import { useCombobox } from '../../core/combobox'
import type { DuSearchEmit, DuSearchProps } from './du-search.types'

const props = withDefaults(defineProps<Omit<DuSearchProps<O, V>, 'modelValue'>>(), {
  options: () => [],
  multiple: false,
  disabled: false,
  readonly: false,
  required: false,
  type: 'text',
  placeholder: '',
  noResultsText: 'No results',
  creatable: false,
  createOptionText: 'Add',
  commitOnClose: 'none',
  externalFilter: false,
  // Auto per mode (single: true, multiple: false) — Vue would cast an absent
  // boolean to `false`, so the default has to be an explicit `null`.
  closeOnSelect: null,
  closeOnClickOutside: true,
  selectOnTab: false,
  clearable: false,
  popover: false,
  trackBy: 'id',
  labelBy: 'name',
  // DuSearch has always handed whole options back; it is now opt-out.
  returnObject: true,
  ariaLabel: undefined,
  ariaLabelledby: undefined,
  removeItemLabel: 'Remove',
  ghost: false,
  variant: 'default',
  size: 'default',
  subSize: undefined,
})

const emit = defineEmits<DuSearchEmit<O, V>>()

// No parent `v-model`? `defineModel` keeps the value locally so the component
// still behaves like a real field.
const model = defineModel<V | V[] | null>('modelValue', { default: null })

const { colorClass } = useVariantMapping(props, 'input')
const { sizeClass } = useSizeMapping(props, 'input')
const subSizeProps = reactive({ get size(): Size { return props.subSize ?? props.size } })
const { sizeClass: subSizeClass } = useSizeMapping(subSizeProps, 'menu')

// The chips and their remove button sit inside the field, so they scale with
// it, one step below so they still fit.
const fieldInnerProps = reactive({ get size(): Size { return nestedSize(props.size) } })
const { sizeClass: chipSizeClass } = useSizeMapping(fieldInnerProps, 'badge')
const { sizeClass: fieldButtonSizeClass } = useSizeMapping(fieldInnerProps, 'btn')

const fieldClass = computed(() => [
  'input',
  'input-bordered',
  'flex',
  'items-center',
  'gap-2',
  'w-full',
  sizeClass.value,
  colorClass.value,
  props.ghost ? 'input-ghost' : '',
  props.disabled ? 'input-disabled' : '',
  props.customClass ?? '',
].filter(Boolean))

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

/** What identifies an option — what selections are compared by. */
function keyOf(option: O): V {
  if (props.optionValue) {
    return props.optionValue(option)
  }
  if (isRecord(option)) {
    return (option[props.trackBy] ?? option.value ?? option.id ?? option) as V
  }
  return option as unknown as V
}

function labelOf(option: O): string {
  if (props.optionLabel) {
    return props.optionLabel(option)
  }
  if (isRecord(option)) {
    return String(option[props.labelBy] ?? option.label ?? option.name ?? option)
  }
  return String(option)
}

function disabledOf(option: O): boolean {
  if (props.optionDisabled) {
    return props.optionDisabled(option)
  }
  return isRecord(option) && option.disabled === true
}

function optionOf(value: V): O | undefined {
  const found = props.options.find((option) => keyOf(option) === value)
  if (found !== undefined) {
    return found
  }
  // The v-model holds whole options, so a record that is not in `options` is
  // still an option-shaped object — one injected from outside (a profile
  // filled from an API payload) or created on commit (`creatable`). Its own
  // fields describe it. Without this, the field displayed an empty string
  // (single) or `[object Object]` (chips) for a perfectly valid committed
  // value.
  if (isRecord(value)) {
    return value as unknown as O
  }
  // The key came from a record the model holds: `keyOf` reduced it to its
  // `trackBy`. The raw model keeps the object, which is what has to display.
  const raw = model.value
  const candidates = Array.isArray(raw) ? raw : raw != null ? [raw] : []
  return candidates.find(
    (item) => isRecord(item) && keyOf(item as unknown as O) === value,
  ) as O | undefined
}

/** The option a query stands for while it does not exist yet. */
function createOption(query: string): O {
  if (props.createOption) {
    return props.createOption(query)
  }
  return { [props.trackBy]: null, [props.labelBy]: query } as O
}

function isCreatedOption(option: O): boolean {
  return isRecord(option) && option[props.trackBy] === null
}

// Selections are always compared by `trackBy` key, never by object identity,
// so an option the parent rebuilt (an API round trip, a store, a JSON copy)
// still matches the one in `options`. The v-model holds whole options here by
// default, so it is read as keys and written back as options.
function keyFromModel(value: V): V {
  return isRecord(value) ? keyOf(value as unknown as O) : value
}

function modelFromKey(key: V): V {
  if (!props.returnObject || key == null) {
    return key
  }
  return (optionOf(key) ?? key) as unknown as V
}

const modelAsKeys = computed<V | V[] | null>(() => {
  const value = model.value
  if (props.multiple) {
    return Array.isArray(value) ? value.map(keyFromModel) : []
  }
  return value == null ? null : keyFromModel(value as V)
})

function writeModel(value: V | V[] | null) {
  model.value = Array.isArray(value)
    ? value.map(modelFromKey)
    : value == null ? null : modelFromKey(value)
}

const {
  isOpen,
  visibleOptions,
  searchQuery,
  selectedList,
  cssAnchorName,
  popupStyle,
  isSelected,
  valid,
  errors,
  validationMessage,
  comboboxInputProps,
  listboxProps,
  getOptionProps,
  open,
  close,
  toggle,
  select,
  clear,
  setSearchQuery,
  handleKeydown,
  setContainerRef,
  setTriggerRef,
  setDropdownRef,
  setInputRef,
  setListRef,
  setOptionRef,
} = useCombobox<O, V>({
  modelValue: modelAsKeys,
  options: computed(() => props.options),
  multiple: computed(() => props.multiple),
  minLength: computed(() => props.minSelected),
  maxLength: computed(() => props.maxSelected),
  required: computed(() => props.required),
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly),
  closeOnSelect: computed(() => props.closeOnSelect),
  closeOnClickOutside: computed(() => props.closeOnClickOutside),
  selectOnTab: computed(() => props.selectOnTab),
  deselectOnReselect: computed(() => props.clearable && !props.multiple),
  errorMessages: computed(() => props.errorMessages),
  optionFilter: computed(() => props.optionFilter),
  externalFilter: computed(() => props.externalFilter),
  resultsLimit: computed(() => props.resultsLimit),
  creatable: computed(() => props.creatable),
  commitOnClose: computed(() => props.commitOnClose),
  id: computed(() => props.id),
  optionValue: keyOf,
  optionLabel: labelOf,
  optionDisabled: disabledOf,
  createOption,
  isCreatedOption,
  onQueryChange: (query) => emit('query', String(query ?? '')),
  onSelect: (option) => emit('select', option),
  onRemove: (option) => emit('remove', option),
  onCreate: (option) => emit('add', option),
}, writeModel)

// Kept alongside the engine's own refs, to hand focus to the input when the
// field is clicked somewhere that is not a control.
const inputEl = ref<HTMLInputElement | null>(null)

/** The field is both the combobox and the filter input (typeahead pattern). */
function setFieldRef(el: unknown) {
  inputEl.value = el as HTMLInputElement | null
  setTriggerRef(el)
  setInputRef(el)
}

// Chips fill most of the field, so a click rarely lands on the input itself.
// Anywhere else in the field focuses it — except on the controls inside, which
// drive themselves (a chip's ✕ removes it).
function onFieldClick(event: MouseEvent) {
  if ((event.target as HTMLElement | null)?.closest('button, input') != null) {
    return
  }
  inputEl.value?.focus()
  open()
}

const selectedEntries = computed(() => selectedList.value.map((value) => ({ value, option: optionOf(value) })))

const selectedOption = computed(() => selectedEntries.value[0]?.option)

function labelOfValue(entry: { value: V; option: O | undefined }): string {
  return entry.option === undefined ? String(entry.value) : labelOf(entry.option)
}

// While typing the field shows the query; otherwise the selected label.
const displayValue = computed(() => {
  if (searchQuery.value != null) {
    return searchQuery.value
  }
  if (props.multiple) {
    return ''
  }
  return selectedOption.value === undefined ? '' : labelOf(selectedOption.value)
})

// Multiple mode shortcut kept from the comma-separated input: typing a comma
// validates the segment before it. Runs after the engine stored the raw query.
function commitCommaSegments(event: Event) {
  if (!props.multiple) {
    return
  }
  const value = (event.target as HTMLInputElement).value
  if (!value.includes(',')) {
    return
  }
  const segments = value.split(',').map((part) => part.trim()).filter(Boolean)
  const pending = value.trimEnd().endsWith(',') ? '' : (segments.pop() ?? '')
  for (const segment of segments) {
    const match = props.options.find((option) => labelOf(option).toLowerCase() === segment.toLowerCase())
    if (match !== undefined && !isSelected(match)) {
      select(match)
    }
  }
  setSearchQuery(pending)
}

function removeEntry(entry: { value: V; option: O | undefined }) {
  if (entry.option !== undefined) {
    select(entry.option)
    return
  }
  // The option is gone from `options`: drop the value straight from the model.
  writeModel(selectedList.value.filter((value) => value !== entry.value))
}

// Errors only show once the user has been through the field at least once.
const touched = ref(false)
const showError = computed(() => touched.value && !valid.value)

watch(isOpen, (value) => {
  if (value) {
    emit('open')
  } else {
    touched.value = true
    emit('close')
  }
})

defineExpose({ open, close, toggle, clear, valid, errors, validationMessage })

defineSlots<{
  tag: (props: { option: O | undefined; value: V; index: number; remove: () => void }) => unknown
  option: (props: { option: O; index: number; selected: boolean; highlighted: boolean; disabled: boolean }) => unknown
  'create-option': (props: { query: string }) => unknown
  'no-options': (props: { query: string }) => unknown
  error: (props: { errors: readonly string[]; message: string }) => unknown
}>()
</script>

<template>
  <div class="relative" :ref="setContainerRef">
    <!--
      The field is a surface, not the control: it forwards a click on the
      chips to the `<input role="combobox">` it contains, which owns the
      whole keyboard surface.
    -->
    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions, vuejs-accessibility/click-events-have-key-events -->
    <div :class="fieldClass" :style="popover ? { anchorName: cssAnchorName } : undefined"
      @click="onFieldClick">
      <template v-for="(entry, index) in (multiple ? selectedEntries : [])"
        :key="String(entry.value) + '__' + index">
        <slot name="tag" :option="entry.option" :value="entry.value" :index="index" :remove="() => removeEntry(entry)">
          <span class="badge badge-soft flex items-center gap-1 overflow-clip pr-0" :class="chipSizeClass">
            {{ labelOfValue(entry) }}
            <button type="button" class="btn btn-ghost aspect-square h-full shadow-none" :class="fieldButtonSizeClass"
              :aria-label="removeItemLabel" @click.stop="removeEntry(entry)">✕</button>
          </span>
        </slot>
      </template>

      <!--
        Labelled through `comboboxInputProps` (aria-label / aria-labelledby,
        forwarded from the props), which a v-bind hides from the rule.
      -->
      <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
      <input v-bind="comboboxInputProps" :ref="setFieldRef" :name="name" :type="type" :pattern="pattern"
        :placeholder="placeholder" :value="displayValue" autocomplete="off"
        :aria-label="ariaLabel" :aria-labelledby="ariaLabelledby"
        class="flex-1 min-w-24 bg-transparent outline-none" @keydown="handleKeydown" @input="commitCommaSegments" />
    </div>

    <slot v-if="showError" name="error" :errors="errors" :message="validationMessage">
      <span v-if="validationMessage" class="text-error text-sm mt-1 block">{{ validationMessage }}</span>
    </slot>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="isOpen" :ref="setDropdownRef" :popover="popover ? 'manual' : undefined"
        :style="popover ? popupStyle : undefined"
        class="dropdown-content menu flex-nowrap bg-base-100 rounded-box shadow z-50 p-0"
        :class="[subSizeClass, popover ? 'm-0' : 'absolute mt-1 w-full']">
        <ul v-bind="listboxProps" :ref="setListRef" class="block m-0 p-2 max-h-60 overflow-auto">
          <li v-for="(option, index) in visibleOptions" :key="String(keyOf(option)) + '__' + index"
            v-bind="getOptionProps(option, index)" :ref="(el) => setOptionRef(option, el)"
            class="block w-full rounded-box cursor-pointer data-highlighted:bg-base-300 aria-selected:bg-primary aria-selected:text-primary-content aria-selected:data-highlighted:outline-2 aria-selected:data-highlighted:-outline-offset-2 aria-selected:data-highlighted:text-base-content aria-disabled:opacity-50 aria-disabled:cursor-not-allowed">
            <a class="flex items-center gap-3 py-2 px-3 bg-transparent">
              <template v-if="isCreatedOption(option)">
                <slot name="create-option" :query="labelOf(option)">{{ createOptionText }} "{{ labelOf(option) }}"</slot>
              </template>
              <slot v-else name="option" :option="option" :index="index" :selected="isSelected(option)"
                :highlighted="getOptionProps(option, index)['data-highlighted'] === true"
                :disabled="disabledOf(option)">
                {{ labelOf(option) }}
              </slot>
              <span v-if="clearable && isSelected(option)" class="ml-auto opacity-60 hover:opacity-100"
                aria-hidden="true">✕</span>
            </a>
          </li>

          <li v-if="!visibleOptions.length" class="p-2 text-sm text-base-content/60">
            <slot name="no-options" :query="String(searchQuery ?? '')">{{ noResultsText }}</slot>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
