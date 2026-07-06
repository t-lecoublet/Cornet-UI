<script setup lang="ts">
import { ref, computed, reactive } from "vue"
import { useSizeMapping, type Size } from "../../../composables/useSizeProps"
import { useVariantMapping } from "../../../composables/useVariantProps"
import type { DuSearchProps, DuSearchEmit } from "./du-search.types"
import { useSearchQuery } from "./composables/useSearchQuery"
import { useSearchSelection } from "./composables/useSearchSelection"
import { useSearchInput } from "./composables/useSearchInput"
import { useSearchCommit } from "./composables/useSearchCommit"
import { useSearchKeyboardNav } from "./composables/useSearchKeyboardNav"
import { useSearchDismiss } from "./composables/useSearchDismiss"

const props = withDefaults(defineProps<DuSearchProps>(), {
    size: "default",
    subSize: undefined,
    variant: "default",
    type: "text",
    ghost: false,
    disabled: false,
    addOption: false,
    addOptionText: 'Add',
    noResultsText: 'No results',
    autoCommit: false,
    remoteSearch: false,
    labelBy: "name",
    required: false,
    multiple: false,
    clearable: false,
})

const { sizeClass } = useSizeMapping(props, 'input')
const subSizeProps = reactive({ get size(): Size { return props.subSize ?? props.size } })
const { sizeClass: subSizeClass } = useSizeMapping(subSizeProps, 'menu')
const { colorClass } = useVariantMapping(props, 'input')

const computedInputClass = computed(() => {
    const classes = ['input', 'input-bordered', 'w-full', 'focus:invalid:input-error']

    if (props.size !== 'default' && sizeClass.value) {
        classes.push(sizeClass.value)
    }

    if (props.variant !== 'default' && colorClass.value !== 'input-default') {
        classes.push(colorClass.value)
    }

    if (props.ghost) {
        classes.push('input-ghost')
    }

    if (props.customClass) {
        classes.push(props.customClass)
    }

    return classes.join(' ')
})

const emit = defineEmits<DuSearchEmit>()

const open = ref(false)
const query = ref("")
const highlightedIndex = ref(-1)
const isEditing = ref(false)
const root = ref<HTMLElement | null>(null)
const listId = `du-search-list-${Math.random().toString(36).slice(2, 9)}`

const { labelField, queryValue, filteredValues } = useSearchQuery(props, query)

const { selectedValues, isSelected, updateModel, selectValue, handleOptionClick } =
    useSearchSelection(props, emit, open, query, isEditing)

const { inputValue, onInput } = useSearchInput(
    props,
    emit,
    selectedValues,
    query,
    isEditing,
    labelField,
    open,
    highlightedIndex,
    updateModel,
)

const { onBlurCleanup } = useSearchCommit(
    props,
    query,
    isEditing,
    selectedValues,
    labelField,
    selectValue,
    updateModel,
)

const { onKeydown } = useSearchKeyboardNav(
    props,
    emit,
    root,
    listId,
    open,
    highlightedIndex,
    query,
    isEditing,
    selectedValues,
    filteredValues,
    queryValue,
    selectValue,
    handleOptionClick,
    updateModel,
)

const { onFocus } = useSearchDismiss(root, open, onBlurCleanup)
</script>

<template>
    <div ref="root" class="relative" role="combobox" :aria-expanded="open" :aria-owns="listId">
        <input :id="id" :name="name" :type="props.type" :required="props.required" :pattern="props.pattern"
            :placeholder="placeholder" :class="computedInputClass" :disabled="props.disabled" autocomplete="off"
            :value="inputValue" @input="onInput" @focus="onFocus" @keydown="onKeydown" aria-autocomplete="list"
            :aria-controls="listId" />

        <transition enter-active-class="transition ease-out duration-100" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <ul v-if="open" :id="listId"
                class=" dropdown-content absolute mt-1 max-h-60 w-full overflow-auto rounded-box bg-base-100 shadow z-50 menu flex-nowrap gap-0.5"
                :class="[subSizeClass]"
                role="listbox">
                <li v-if="props.addOption && queryValue" class="cursor-pointer rounded" :class="{
                    'bg-base-300': highlightedIndex === 0
                }" role="option" :aria-selected="(highlightedIndex === 0)" @mousedown="selectValue(queryValue)">
                    <slot name="add-option" :query="query">{{ addOptionText }} "{{ query }}"</slot>
                </li>

                <li v-if="!props.addOption && filteredValues.length === 0" class=" text-gray-400">
                    <slot name="no-results">{{ noResultsText }}</slot>
                </li>

                <li v-for="(val, i) in filteredValues" :key="val.id" class="block w-full rounded-box" :class="{
                    'bg-primary text-primary-content': isSelected(val),
                    'bg-base-300': highlightedIndex === (props.addOption && queryValue ? i + 1 : i) && !isSelected(val),
                    'bg-primary/75': isSelected(val) && highlightedIndex === (props.addOption && queryValue ? i + 1 : i)
                }" role="option" :aria-selected="(highlightedIndex === (props.addOption && queryValue ? i + 1 : i))"
                    @mousedown="handleOptionClick(val)"
                    @mouseover.prevent="highlightedIndex = (props.addOption && queryValue ? i + 1 : i)">
                    <a class="flex items-center gap-3 bg-transparent">
                        <slot name="option" :option="val" :index="i">
                            {{ val[labelField] }}
                        </slot>
                        <span v-if="clearable && isSelected(val)" class="ml-auto opacity-60 hover:opacity-100" aria-hidden="true">✕</span>
                    </a>

                </li>
            </ul>
        </transition>
    </div>
</template>
