<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useSizeMapping } from "../../../composables/useSizeProps"
import { useVariantMapping } from "../../../composables/useVariantProps"
import type { DuSelectProps, DuSelectEmit } from './du-select.types'
import { useSelectOptions } from './composables/useSelectOptions'
import { useSelectSearch } from './composables/useSelectSearch'
import { useSelectOpenState } from './composables/useSelectOpenState'
import { useSelectSelection } from './composables/useSelectSelection'
import { useSelectKeyboardNav } from './composables/useSelectKeyboardNav'
import { useSelectDismiss } from './composables/useSelectDismiss'

const props = withDefaults(defineProps<DuSelectProps>(), {
    options: () => [],
    multiple: false,
    placeholder: 'Select...',
    searchable: false,
    searchableInside: false,
    searchPlaceholder: 'Search...',
    searchNoResultsText: 'No options found',
    checkboxes: false,
    closeOnSelect: true,
    trackBy: 'id',
    labelBy: 'name',
    returnObject: false,
    clearable: false,
    ghost: false,
    variant: 'default',
    size: 'default',
    disabled: false,
    search: false,
    removeItemLabel: 'Remove',
})

const emit = defineEmits<DuSelectEmit>()

const { colorClass } = useVariantMapping(props, "select")
const { sizeClass: inputSizeClass } = useSizeMapping(props, "input")
const { sizeClass: subMenuSizeClass } = useSizeMapping(props, "menu")
const ghostClass = computed(() => (props.ghost ? "select-ghost" : ""))

const isInLabel = inject("isInLabel", false);

const root = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const searchInputInside = ref<HTMLInputElement | null>(null)
const open = ref(false)
const query = ref('')
const highlightedIndex = ref(-1)
const listId = `du-select-list-${Math.random().toString(36).slice(2, 9)}`

const { optionValue, optionLabel, labelFromOption, labelFromValue, keyForOption, valKey, optionFromValue } =
    useSelectOptions(props)

const { filteredOptions, onQuery, resetQuery } = useSelectSearch(props, query, highlightedIndex, optionLabel)

const { openDropdown, close, toggle, focusToggle } = useSelectOpenState(
    props,
    emit,
    open,
    highlightedIndex,
    searchInput,
    searchInputInside,
    resetQuery,
)

const { selectedValues, selectedOption, isSelected, toggleOption, removeValue } =
    useSelectSelection(props, emit, { optionValue, optionFromValue }, close)

const { onKeydown } = useSelectKeyboardNav(
    props,
    root,
    listId,
    open,
    highlightedIndex,
    query,
    filteredOptions,
    selectedValues,
    openDropdown,
    close,
    toggleOption,
    removeValue,
)

const { onFocus } = useSelectDismiss(root, open, openDropdown, close)

function handleOptionClick(opt: any) {
    toggleOption(opt)
}
</script>

<template>
    <div class="relative" :class="[isInLabel && 'w-full']" ref="root" @keydown="onKeydown">
        <div class="input input-bordered flex items-center gap-2 cursor-text w-full overflow-x-clip"
            :class="[colorClass, inputSizeClass, ghostClass, { 'input-disabled': disabled }, { 'outline-none rounded-l-none border-x-0': isInLabel }]" tabindex="0" role="combobox"
            :aria-expanded="open" :aria-controls="listId" @click="focusToggle" @focus="onFocus">
            <template v-if="multiple">
                <template v-for="(val, idx) in selectedValues" :key="valKey(val, idx)">
                    <slot name="tag" :value="optionFromValue(val)" :index="idx">
                        <label class="badge badge-sm badge-neutral mr-1 flex items-center gap-2 cursor-pointer">
                            {{ labelFromValue(val) }}
                            <button class="btn btn-ghost btn-circle btn-xs p-0" @click.stop="removeValue(val)"
                                :aria-label="removeItemLabel">✕</button>
                        </label>
                    </slot>
                </template>

                <input v-if="searchable" ref="searchInput" v-model="query" @focus="open = true" @input="onQuery"
                    class="input input-ghost flex-1 w-full !outline-none pl-0"
                    :class="{ ' placeholder:!text-base-content': selectedValues.length }"
                    :placeholder="selectedValues.length ? '' : placeholder" aria-autocomplete="list" />

                <span v-else class="flex-1" :class="{ 'text-gray-400': !selectedValues.length }">
                    {{ !selectedValues.length ? placeholder : '' }}
                </span>
            </template>

            <template v-else>
                <template v-if="searchable">
                    <input ref="searchInput" v-model="query" @focus="open = true" @input="onQuery"
                        class="input input-ghost flex-1 min-w-[6rem] !outline-none pl-0"
                        :class="{ ' placeholder:!text-base-content': selectedOption }"
                        :placeholder="selectedOption ? labelFromOption(selectedOption) : placeholder"
                        aria-autocomplete="list" />
                </template>
                <template v-else>
                    <slot name="selected" :selected="selectedOption">
                        <span class="flex-1">{{ selectedOption ? labelFromOption(selectedOption) : placeholder }}</span>
                    </slot>
                </template>
            </template>

            <div class="btn btn-ghost btn-sm outline-none! h-4/5" type="button" @click.stop="toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
        </div>

        <transition enter-active-class="transition ease-out duration-100" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="open"
                class="absolute dropdown-content menu flex-nowrap bg-base-100 rounded-box shadow mt-1 w-full z-50 p-0"
                role="listbox" :id="listId" :class="[subMenuSizeClass]">
                <!-- optional internal search at top of dropdown -->
                <div v-if="searchable && searchableInside" class="p-2">
                    <input v-model="query" ref="searchInputInside" class="input input-bordered w-full"
                        :placeholder="searchPlaceholder" @input="onQuery" />
                </div>

                <div class="block max-h-72 overflow-auto">
                    <ul class="block m-0 p-2">
                        <li v-for="(opt, i) in filteredOptions" :key="keyForOption(opt, i)"
                            class="block w-full rounded-box"
                            :class="[{ 'bg-primary text-primary-content': isSelected(opt), 'bg-base-300': i === highlightedIndex, 'bg-primary/75': isSelected(opt) && i === highlightedIndex }, 'cursor-pointer']"
                            role="option" :aria-selected="isSelected(opt)" @mousedown.prevent="handleOptionClick(opt)"
                            @mouseover.prevent="highlightedIndex = i">
                            <a class="flex items-center gap-3 py-2 px-3 text-balance! bg-transparent">
                                <input v-if="checkboxes" type="checkbox" class="checkbox checkbox-sm"
                                    :checked="isSelected(opt)" @change.stop.prevent="toggleOption(opt)" tabindex="-1" />
                                <slot name="option" :option="opt" :index="i">
                                    {{ labelFromOption(opt) }}
                                </slot>
                                <span v-if="clearable && isSelected(opt)" class="ml-auto opacity-60 hover:opacity-100" aria-hidden="true">✕</span>
                            </a>
                        </li>

                        <li v-if="filteredOptions.length === 0" class="p-2 text-sm text-gray-500">
                            <slot name="no-options">{{ searchNoResultsText }}</slot>
                        </li>
                    </ul>
                </div>


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