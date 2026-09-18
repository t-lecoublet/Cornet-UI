<script setup lang="ts" generic="O = any, V = any">
import { computed, inject, reactive, ref, watch } from 'vue'
import { nestedSize, useSizeMapping, type Size } from '../../../composables/useSizeProps'
import { useVariantMapping } from '../../../composables/useVariantProps'
import { useCombobox } from '../../core/combobox'
import type { DuSelectEmit, DuSelectProps } from './du-select.types'

const props = withDefaults(defineProps<Omit<DuSelectProps<O, V>, 'modelValue'>>(), {
  options: () => [],
  multiple: false,
  disabled: false,
  readonly: false,
  required: false,
  placeholder: 'Select...',
  noResultsText: 'No options found',
  searchable: false,
  searchableInside: false,
  searchPlaceholder: 'Search...',
  checkboxes: false,
  // Auto per mode (single: true, multiple: false) — Vue would cast an absent
  // boolean to `false`, so the default has to be an explicit `null`.
  closeOnSelect: null,
  closeOnClickOutside: true,
  selectOnTab: false,
  clearable: false,
  popover: false,
  trackBy: 'id',
  labelBy: 'name',
  returnObject: false,
  ariaLabel: undefined,
  ariaLabelledby: undefined,
  removeItemLabel: 'Remove',
  ghost: false,
  variant: 'default',
  size: 'default',
  subSize: undefined,
})

const emit = defineEmits<DuSelectEmit<O, V>>()

// No parent `v-model`? `defineModel` keeps the value locally so the component
// still behaves like a real select.
const model = defineModel<V | V[] | null>('modelValue', { default: null })

const isInLabel = inject('isInLabel', false)

const { colorClass } = useVariantMapping(props, 'select')
const { sizeClass: inputSizeClass } = useSizeMapping(props, 'input')
const subSizeProps = reactive({ get size(): Size { return props.subSize ?? props.size } })
const { sizeClass: subMenuSizeClass } = useSizeMapping(subSizeProps, 'menu')

// Controls sitting inside the field — the chips, their remove button, the
// chevron — scale with it, one step below so they still fit.
const fieldInnerProps = reactive({ get size(): Size { return nestedSize(props.size) } })
const { sizeClass: chipSizeClass } = useSizeMapping(fieldInnerProps, 'badge')
const { sizeClass: fieldButtonSizeClass } = useSizeMapping(fieldInnerProps, 'btn')

// Controls inside the dropdown follow the list size instead.
const { sizeClass: searchInputSizeClass } = useSizeMapping(subSizeProps, 'input')
const listInnerProps = reactive({ get size(): Size { return nestedSize(props.subSize ?? props.size) } })
const { sizeClass: checkboxSizeClass } = useSizeMapping(listInnerProps, 'checkbox')

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
  // Under `returnObject`, the v-model holds whole options: one injected from
  // outside (a form filled from an API payload) is an option-shaped record
  // whose own fields describe it, and whose key the model reduced to its
  // `trackBy`. Without this fallback the field displayed an empty string for
  // a perfectly valid value.
  if (isRecord(value)) {
    return value as unknown as O
  }
  const raw = model.value
  const candidates = Array.isArray(raw) ? raw : raw != null ? [raw] : []
  return candidates.find(
    (item) => isRecord(item) && keyOf(item as unknown as O) === value,
  ) as O | undefined
}

// Selections are always compared by `trackBy` key, never by object identity:
// a parent that hands back an option it rebuilt (an API round trip, a store,
// a JSON copy) must still match the one in `options`. So a v-model holding
// whole options — under `returnObject`, or just because the parent passed
// objects — is read as keys, and written back in the shape it asked for.
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
  triggerProps,
  inputProps,
  comboboxInputProps,
  listboxProps,
  getOptionProps,
  toggle,
  open,
  close,
  select,
  clear,
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
  // `clearable` in single mode: picking the current selection again clears it.
  deselectOnReselect: computed(() => props.clearable && !props.multiple),
  errorMessages: computed(() => props.errorMessages),
  optionFilter: computed(() => props.optionFilter),
  id: computed(() => props.id),
  optionValue: keyOf,
  optionLabel: labelOf,
  optionDisabled: disabledOf,
  onQueryChange: (query) => emit('query', String(query ?? '')),
  onSelect: (option) => emit('select', option),
  onRemove: (option) => emit('remove', option),
}, writeModel)

// `searchableInside` moves the query box into the dropdown, which turns the
// field back into a plain combobox button.
const typeahead = computed(() => props.searchable && !props.searchableInside)

// Kept alongside the engine's own trigger ref, to hand focus back to it when
// the field is clicked somewhere that is not a control.
const triggerEl = ref<HTMLElement | null>(null)

function setTriggerElement(el: unknown) {
  triggerEl.value = el as HTMLElement | null
  setTriggerRef(el)
}

/** Wires the one input that is both the field and the filter (typeahead pattern). */
function setTypeaheadRef(el: unknown) {
  setTriggerElement(el)
  setInputRef(el)
}

// Chips fill most of the field, so a click rarely lands on the trigger itself.
// The whole field opens the popup — except on the controls inside it, which
// drive it themselves (the trigger toggles, the chevron toggles, a chip's ✕
// removes).
function onFieldClick(event: MouseEvent) {
  if ((event.target as HTMLElement | null)?.closest('button, input') != null) {
    return
  }
  triggerEl.value?.focus()
  open()
}

const selectedEntries = computed(() => selectedList.value.map((value) => ({ value, option: optionOf(value) })))

const selectedOption = computed(() => selectedEntries.value[0]?.option)

function labelOfValue(entry: { value: V; option: O | undefined }): string {
  return entry.option === undefined ? String(entry.value) : labelOf(entry.option)
}

// While open the field shows what is being typed; otherwise the selection.
const displayValue = computed(() => {
  if (searchQuery.value != null) {
    return searchQuery.value
  }
  if (props.multiple) {
    return ''
  }
  return selectedOption.value === undefined ? '' : labelOf(selectedOption.value)
})

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
  selected: (props: { selected: O | undefined }) => unknown
  option: (props: { option: O; index: number; selected: boolean; highlighted: boolean; disabled: boolean }) => unknown
  'no-options': (props: { query: string }) => unknown
  error: (props: { errors: readonly string[]; message: string }) => unknown
}>()
</script>

<template>
  <div class="relative" :class="[isInLabel && 'w-full']" :ref="setContainerRef">
    <!--
      The field is a surface, not the control: it forwards a click on the
      chips to the `<button>` trigger it contains, which owns the whole
      keyboard surface through `triggerProps`.
    -->
    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions, vuejs-accessibility/click-events-have-key-events -->
    <div class="input input-bordered flex items-center gap-2 w-full overflow-x-clip" :class="[
      colorClass,
      inputSizeClass,
      ghost && 'select-ghost',
      disabled && 'input-disabled',
      isInLabel && 'outline-none rounded-l-none border-x-0',
      customClass,
    ]" :style="popover ? { anchorName: cssAnchorName } : undefined" @click="onFieldClick">
      <template v-if="multiple">
        <template v-for="(entry, index) in selectedEntries" :key="String(entry.value) + '__' + index">
          <slot name="tag" :option="entry.option" :value="entry.value" :index="index"
            :remove="() => removeEntry(entry)">
            <span class="badge badge-soft flex items-center gap-1 overflow-clip pr-0" :class="chipSizeClass">
              {{ labelOfValue(entry) }}
              <button type="button" class="btn btn-ghost aspect-square h-full shadow-none"
                :class="fieldButtonSizeClass" :aria-label="removeItemLabel"
                @click.stop="removeEntry(entry)">✕</button>
            </span>
          </slot>
        </template>
      </template>

      <input v-if="typeahead" v-bind="comboboxInputProps" :ref="setTypeaheadRef" :value="displayValue"
        :placeholder="placeholder" :aria-label="ariaLabel" :aria-labelledby="ariaLabelledby"
        class="flex-1 min-w-24 bg-transparent outline-none" @keydown="handleKeydown" />

      <button v-else type="button" v-bind="triggerProps" :ref="setTriggerElement"
        :aria-label="ariaLabel" :aria-labelledby="ariaLabelledby"
        class="flex-1 text-left truncate bg-transparent outline-none cursor-pointer">
        <template v-if="multiple">
          <span v-if="!selectedEntries.length" class="text-base-content/50">{{ placeholder }}</span>
        </template>
        <slot v-else name="selected" :selected="selectedOption">
          <span :class="{ 'text-base-content/50': selectedOption === undefined }">
            {{ selectedOption === undefined ? placeholder : labelOf(selectedOption) }}
          </span>
        </slot>
      </button>

      <button type="button" tabindex="-1" aria-hidden="true" class="btn btn-ghost outline-none! h-4/5"
        :class="fieldButtonSizeClass" @click.stop="toggle">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>

    <slot v-if="showError" name="error" :errors="errors" :message="validationMessage">
      <span class="text-error text-sm mt-1 block">{{ validationMessage }}</span>
    </slot>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="isOpen" :ref="setDropdownRef" :popover="popover ? 'manual' : undefined"
        :style="popover ? popupStyle : undefined"
        class="dropdown-content menu flex-nowrap bg-base-100 rounded-box shadow z-50 p-0"
        :class="[subMenuSizeClass, popover ? 'm-0' : 'absolute mt-1 w-full']">
        <div v-if="searchableInside" class="p-2">
          <input v-bind="inputProps" :ref="setInputRef" class="input input-bordered w-full"
            :class="searchInputSizeClass" :placeholder="searchPlaceholder" />
        </div>

        <!-- The listbox is its own scroll container: the engine scrolls the
             highlighted option into view inside the element wired as the list. -->
        <ul v-bind="listboxProps" :ref="setListRef" class="block m-0 p-2 max-h-72 overflow-auto">
          <li v-for="(option, index) in visibleOptions" :key="String(keyOf(option)) + '__' + index"
            v-bind="getOptionProps(option, index)" :ref="(el) => setOptionRef(option, el)"
            class="block w-full rounded-box cursor-pointer data-highlighted:bg-base-300 aria-selected:bg-primary aria-selected:text-primary-content aria-selected:data-highlighted:outline-2 aria-selected:data-highlighted:-outline-offset-2 aria-selected:data-highlighted:text-base-content aria-disabled:opacity-50 aria-disabled:cursor-not-allowed">
            <a class="flex items-center gap-3 py-2 px-3 text-balance! bg-transparent">
              <input v-if="checkboxes" type="checkbox" class="checkbox checkbox-primary pointer-events-none"
                :class="checkboxSizeClass" tabindex="-1" aria-hidden="true" :checked="isSelected(option)" />
              <slot name="option" :option="option" :index="index" :selected="isSelected(option)"
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

<style scoped>
.dropdown-content.menu {
    @supports (scrollbar-color: auto) {

        *,
        *:hover {
            scrollbar-width: thin;
        }
    }

    @supports (scrollbar-width: none) {

        *,
        *:hover {
            scrollbar-width: thin;
        }
    }

    & ul {
        display: block;
    }

    & li a {
        white-space: nowrap;
    }
}
</style>
