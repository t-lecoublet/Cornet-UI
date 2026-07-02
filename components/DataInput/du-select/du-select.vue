<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, inject } from 'vue'
import { useSizeMapping } from "../../../composables/useSizeProps"
import { useVariantMapping } from "../../../composables/useVariantProps"
import type { DuSelectProps } from './du-select.types'

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

const emit = defineEmits<{
    'update:modelValue': [value: any]
    select: [option: any]
    remove: [option: any]
    open: []
    close: []
}>()

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

function optionValue(opt: any): any {
    if (opt && typeof opt === 'object') return opt[props.trackBy] ?? opt.value ?? opt.id ?? opt
    return opt
}
function optionLabel(opt: any): string {
    if (opt && typeof opt === 'object') return opt[props.labelBy] ?? opt.label ?? opt.name ?? String(opt)
    return String(opt)
}
function labelFromOption(opt: any): string { return optionLabel(opt) }
function labelFromValue(val: any): string {
    const o = props.options.find(o => optionValue(o) === val)
    return o ? optionLabel(o) : String(val)
}
function keyForOption(opt: any, i: number): string {
    const v = optionValue(opt)
    return `${String(v)}__${i}`
}
function valKey(val: any, idx: number): string { return `${String(val)}__${idx}` }

const selectedValues = ref<any[]>([])
const selectedSingle = ref<any>(null)

function syncFromModel() {
    if (props.multiple) {
        if (Array.isArray(props.modelValue)) {
            selectedValues.value = props.modelValue.map(v => (v && typeof v === 'object' ? optionValue(v) : v))
        } else {
            selectedValues.value = []
        }
    } else {
        if (props.modelValue && typeof props.modelValue === 'object') {
            selectedSingle.value = optionValue(props.modelValue)
        } else {
            selectedSingle.value = props.modelValue
        }
    }
}

watch(() => props.modelValue, () => syncFromModel(), { immediate: true })

const filteredOptions = computed(() => {
    const q = query.value?.toString().trim().toLowerCase()
    if (!q) return props.options
    return props.options.filter(o => optionLabel(o).toString().toLowerCase().includes(q))
})

function isSelected(opt: any): boolean {
    const v = optionValue(opt)
    if (props.multiple) return selectedValues.value.includes(v)
    return selectedSingle.value === v
}

function optionFromValue(v: any): any {
    return props.options.find(o => optionValue(o) === v) ?? v
}

function emitModelForMultiple() {
    const out = props.returnObject ? selectedValues.value.map(v => optionFromValue(v)) : [...selectedValues.value]
    emit('update:modelValue', out)
}
function emitModelForSingle(val: any) {
    const out = props.returnObject ? optionFromValue(val) : val
    emit('update:modelValue', out)
}

function toggleOption(opt: any) {
    const v = optionValue(opt)
    if (props.multiple) {
        const idx = selectedValues.value.indexOf(v)
        if (idx === -1) {
            selectedValues.value.push(v)
            emit('select', optionFromValue(v))
        } else {
            selectedValues.value.splice(idx, 1)
            emit('remove', optionFromValue(v))
        }
        emitModelForMultiple()
    } else {
        if (props.clearable && selectedSingle.value === v) {
            selectedSingle.value = null
            emit('update:modelValue', null)
            close()
        } else {
            selectedSingle.value = v
            emit('select', optionFromValue(v))
            emitModelForSingle(v)
            if (props.closeOnSelect) close()
        }
    }
}

function handleOptionClick(opt: any) {
    toggleOption(opt)
}

function removeValue(val: any) {
    if (!props.multiple) return
    const idx = selectedValues.value.indexOf(val)
    if (idx > -1) {
        selectedValues.value.splice(idx, 1)
        emit('remove', optionFromValue(val))
        emitModelForMultiple()
    }
}

function openDropdown() {
    open.value = true
    emit('open')
    highlightedIndex.value = 0
    nextTick(() => {
        if (props.searchable && (props.searchableInside || props.multiple)) {
            // focus internal search if present
            if (searchInput.value) searchInput.value.focus()
            if (searchInputInside.value) searchInputInside.value.focus()
        }
    })
}
function close() {
    open.value = false
    query.value = ''
    highlightedIndex.value = -1
    emit('close')
}
function toggle() {
    if (open.value) close()
    else openDropdown()
}
function focusToggle() {
    if (!open.value) openDropdown()
    else {
        // focus search input if there
        nextTick(() => {
            if (searchInput.value) searchInput.value.focus()
            if (searchInputInside.value) searchInputInside.value.focus()
        })
    }
}

function onQuery() {
    highlightedIndex.value = 0
}

function onKeydown(e: KeyboardEvent) {
    if (!open.value && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        openDropdown()
        e.preventDefault()
        return
    }
    const len = filteredOptions.value.length
    if (e.key === 'ArrowDown') {
        highlightedIndex.value = (highlightedIndex.value + 1 + len) % len
        scrollHighlightedIntoView()
        e.preventDefault()
    } else if (e.key === 'ArrowUp') {
        highlightedIndex.value = (highlightedIndex.value - 1 + len) % len
        scrollHighlightedIntoView()
        e.preventDefault()
    } else if (e.key === 'Enter') {
        if (highlightedIndex.value >= 0 && highlightedIndex.value < len) {
            toggleOption(filteredOptions.value[highlightedIndex.value])
        }
        e.preventDefault()
    } else if (e.key === 'Escape') {
        close()
        e.preventDefault()
    } else if (e.key === 'Backspace' && props.multiple && query.value === '') {
        // remove last tag
        const last = selectedValues.value[selectedValues.value.length - 1]
        if (last !== undefined) removeValue(last)
    }
}

function scrollHighlightedIntoView() {
    nextTick(() => {
        const list = root.value?.querySelector(`#${listId}`)
        const active = list?.querySelectorAll('li')[highlightedIndex.value]
        if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest' })
    })
}

function onClickOutside(e: Event) {
    if (!root.value) return
    if (!root.value.contains(e.target as Node)) close()
}

function onFocusOut(_e: FocusEvent) {
    setTimeout(() => {
        if (!root.value) return

        // Check if the new focus target is outside our component
        const activeElement = document.activeElement
        if (!activeElement || !root.value.contains(activeElement)) {
            close()
        }
    }, 0)
}

function onFocus(_e: FocusEvent) {
    if (!open.value) {
        openDropdown()
    }
}

onMounted(() => {
    document.addEventListener('click', onClickOutside)
    root.value?.addEventListener('focusout', onFocusOut)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside)
    root.value?.removeEventListener('focusout', onFocusOut)
})

const selectedOption = computed(() => optionFromValue(selectedSingle.value))

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