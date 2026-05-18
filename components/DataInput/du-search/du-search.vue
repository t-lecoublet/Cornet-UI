<script setup lang="ts">
import { ref, computed, reactive, nextTick, onMounted, onBeforeUnmount, watch } from "vue"
import { useSizeMapping, type Size } from "../../../composables/useSizeProps"
import { useVariantMapping, type Variant } from "../../../composables/useVariantProps"
import type { SEARCHProps, SearchOption } from "./du-search.types"

const props = withDefaults(defineProps<SEARCHProps>(), {
    size: "default",
    subSize: undefined,
    variant: "default",
    type: "text",
    ghost: false,
    disabled: false,
    addOption: false,
    autoCommit: false,
    remoteSearch: false,
    labelBy: "name",
    required: false,
    multiple: false,
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

const emit = defineEmits(["update:modelValue", "select", "remove", "add", "query"])

const labelField = computed(() => props.labelBy ?? "name")

const selectedValues = ref<any[]>([])
watch(
    () => props.modelValue,
    (val) => {
        if (props.multiple) {
            selectedValues.value = Array.isArray(val) ? [...val] : []
        } else {
            selectedValues.value = val ? [val] : []
        }
    },
    { immediate: true }
)

const open = ref(false)
const query = ref("")
const highlightedIndex = ref(-1)
const isEditing = ref(false)
const root = ref<HTMLElement | null>(null)
const listId = `du-search-list-${Math.random().toString(36).slice(2, 9)}`

const queryValue = computed(() =>
    query.value === "" ? null : { id: null, name: query.value }
)

const filteredValues = computed(() => {
    let values = props.listValues
    if (query.value && !props.remoteSearch) {
        values = values.filter((el) =>
            el.name.toLowerCase().includes(query.value.toLowerCase())
        )
    }
    if (props.limit) {
        return values.slice(0, props.limit)
    }
    return values
})

const inputValue = computed(() => {
    if (props.multiple) {
        const selectedPart = selectedValues.value.map((v) => v[labelField.value]).join(", ")
        if (selectedPart && query.value) {
            return `${selectedPart}, ${query.value}`
        } else if (selectedPart) {
            return selectedPart
        } else {
            return query.value
        }
    }
    if (isEditing.value) {
        return query.value
    }
    return selectedValues.value[0]?.[labelField.value] || ""
})

function isSelected(option: SearchOption) {
    if (props.multiple) {
        return selectedValues.value.some((v) => v.id === option.id && v.name === option.name)
    } else {
        const selected = selectedValues.value[0]
        return selected && selected.id === option.id && selected.name === option.name
    }
}

function updateModel() {
    if (props.multiple) {
        emit("update:modelValue", [...selectedValues.value])
    } else {
        emit("update:modelValue", selectedValues.value[0] ?? null)
    }
}

function selectValue(val: any) {
    const isNew = props.addOption && val.id === null
    if (props.multiple) {
        if (!selectedValues.value.find((v) => v.id === val.id && v.name === val.name)) {
            selectedValues.value.push(val)
            if (isNew) emit("add", val)
            else emit("select", val)
            updateModel()
        }
        query.value = ""
    } else {
        selectedValues.value = [val]
        if (isNew) emit("add", val)
        else emit("select", val)
        updateModel()
        open.value = false
        query.value = ""
        isEditing.value = false
    }
}

function onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value

    // En mode simple, commencer l'édition dès qu'on tape
    if (!props.multiple) {
        isEditing.value = true
    }

    if (props.multiple) {
        // Reconstruit la partie des valeurs sélectionnées
        const selectedPart = selectedValues.value.map((v) => v.name).join(", ")

        // Extrait la query en retirant la partie des valeurs sélectionnées
        let newQuery = ""
        if (selectedPart && val.startsWith(selectedPart)) {
            // Retire la partie sélectionnée + la virgule et l'espace qui suivent
            const remainder = val.slice(selectedPart.length)
            if (remainder.startsWith(", ")) {
                newQuery = remainder.slice(2) // Retire ", "
            } else if (remainder === "") {
                newQuery = ""
            } else {
                // Cas où on modifie directement après les valeurs sélectionnées
                newQuery = remainder
            }
        } else if (!selectedPart) {
            // Aucune valeur sélectionnée, tout l'input est la query
            newQuery = val
        }

        // Vérifie si on tape une virgule pour ajouter une nouvelle valeur
        if (newQuery.includes(",")) {
            const parts = newQuery.split(",").map((p) => p.trim()).filter(Boolean)
            const lastPart = parts.pop()

            for (const part of parts) {
                const match = props.listValues.find(
                    (o) => o.name.toLowerCase() === part.toLowerCase()
                )
                if (match && !selectedValues.value.some((v) => v.id === match.id)) {
                    selectedValues.value.push(match)
                    emit("select", match)
                }
            }
            updateModel()
            query.value = lastPart ?? ""
        } else {
            query.value = newQuery
        }
    } else {
        query.value = val
        // En mode simple, si l'input est vide, vider la sélection
        if (val === "") {
            selectedValues.value = []
            updateModel()
        }
    }

    emit("query", query.value)
    open.value = true
    highlightedIndex.value = 0
}

function onKeydown(e: KeyboardEvent) {
    const len =
        filteredValues.value.length + (props.addOption && queryValue.value ? 1 : 0)

    if (!open.value && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        open.value = true
        e.preventDefault()
        return
    }

    if (e.key === "ArrowDown") {
        highlightedIndex.value = (highlightedIndex.value + 1 + len) % len
        scrollHighlightedIntoView()
        e.preventDefault()
    } else if (e.key === "ArrowUp") {
        highlightedIndex.value = (highlightedIndex.value - 1 + len) % len
        scrollHighlightedIntoView()
        e.preventDefault()
    } else if (e.key === "Enter") {
        if (highlightedIndex.value >= 0 && highlightedIndex.value < len) {
            if (props.addOption && queryValue.value) {
                if (highlightedIndex.value === 0) {
                    selectValue(queryValue.value)
                } else {
                    selectValue(filteredValues.value[highlightedIndex.value - 1])
                }
            } else {
                selectValue(filteredValues.value[highlightedIndex.value])
            }
        }
        e.preventDefault()
    } else if (e.key === "Escape") {
        open.value = false
        highlightedIndex.value = -1
        // En mode simple, arrêter l'édition
        if (!props.multiple && isEditing.value) {
            // Si la query est vide, garder la sélection vide
            if (query.value === "") {
                selectedValues.value = []
                updateModel()
            }
            isEditing.value = false
            query.value = ""
        }
        e.preventDefault()
    } else if (e.key === "Backspace" && props.multiple) {
        // Ne supprime une valeur sélectionnée que si la query est vide
        if (query.value === "" && selectedValues.value.length > 0) {
            const removed = selectedValues.value.pop()
            emit("remove", removed)
            updateModel()
            e.preventDefault()
        }
    }
}

function scrollHighlightedIntoView() {
    nextTick(() => {
        const list = root.value?.querySelector(`#${listId}`)
        const active = list?.querySelectorAll("li")[highlightedIndex.value]
        if (active && "scrollIntoView" in active) {
            ; (active as HTMLElement).scrollIntoView({ block: "nearest" })
        }
    })
}

function commitQuery() {
    if (query.value === "") {
        selectedValues.value = []
        updateModel()
        return
    }
    const match = props.listValues.find(
        o => String(o[labelField.value]).toLowerCase() === query.value.toLowerCase()
    )
    if (match) {
        selectValue(match)
    } else if (props.remoteSearch && props.listValues.length > 0) {
        // Recherche distante : sélectionner le meilleur résultat (premier)
        selectValue(props.listValues[0])
    } else if (props.addOption) {
        selectValue({ id: null, name: query.value })
    } else {
        selectedValues.value = []
        updateModel()
    }
    isEditing.value = false
    query.value = ""
}

function onBlurCleanup() {
    if (!props.multiple && isEditing.value) {
        if (props.autoCommit) {
            commitQuery()
        } else {
            if (query.value === "") {
                selectedValues.value = []
                updateModel()
            }
            isEditing.value = false
            query.value = ""
        }
    }
}

function onClickOutside(e: MouseEvent) {
    if (!root.value) return
    if (!root.value.contains(e.target as Node)) {
        open.value = false
        onBlurCleanup()
    }
}

function onFocusOut(_e: FocusEvent) {
    setTimeout(() => {
        if (!root.value) return

        const activeElement = document.activeElement
        if (!activeElement || !root.value.contains(activeElement)) {
            open.value = false
            onBlurCleanup()
        }
    }, 0)
}

function onFocus(e: FocusEvent) {
    if (!open.value) {
        open.value = true
    }
}

onMounted(() => {
    document.addEventListener("click", onClickOutside)
    root.value?.addEventListener('focusout', onFocusOut)
})
onBeforeUnmount(() => {
    document.removeEventListener("click", onClickOutside)
    root.value?.removeEventListener('focusout', onFocusOut)
})
</script>

<template>
    <div ref="root" class="relative" role="combobox" :aria-expanded="open" :aria-owns="listId" @focus="onFocus">
        <input :id="id" :name="name" :type="props.type" :required="props.required" :pattern="props.pattern"
            :placeholder="placeholder" :class="computedInputClass" :disabled="props.disabled" autocomplete="off"
            :value="inputValue" @input="onInput" @focus="open = true" @keydown="onKeydown" aria-autocomplete="list"
            :aria-controls="listId" />

        <transition enter-active-class="transition ease-out duration-100" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <ul v-if="open" :id="listId"
                class=" dropdown-content absolute mt-1 max-h-60 w-full overflow-auto rounded-box bg-base-100 shadow z-50 menu flex-nowrap"
                :class="[subSizeClass]"
                role="listbox">
                <li v-if="props.addOption && queryValue" class="cursor-pointer rounded" :class="{
                    'bg-base-300': highlightedIndex === 0
                }" role="option" :aria-selected="(highlightedIndex === 0)" @mousedown="selectValue(queryValue)">
                    <slot name="add-option" :query="query">Ajouter "{{ query }}"</slot>
                </li>

                <li v-if="!props.addOption && filteredValues.length === 0" class=" text-gray-400">
                    <slot name="no-results">Aucun résultat</slot>
                </li>

                <li v-for="(val, i) in filteredValues" :key="val.id" class="block w-full rounded-box" :class="{
                    'bg-primary text-primary-content': isSelected(val),
                    'bg-base-300': highlightedIndex === (props.addOption && queryValue ? i + 1 : i) && !isSelected(val),
                    'bg-primary/75': isSelected(val) && highlightedIndex === (props.addOption && queryValue ? i + 1 : i)
                }" role="option" :aria-selected="(highlightedIndex === (props.addOption && queryValue ? i + 1 : i))"
                    @mousedown="selectValue(val)"
                    @mouseover.prevent="highlightedIndex = (props.addOption && queryValue ? i + 1 : i)">
                    <a class="flex items-center gap-3 bg-transparent">
                        <slot name="option" :option="val" :index="i">
                            {{ val[labelField] }}
                        </slot>
                    </a>

                </li>
            </ul>
        </transition>
    </div>
</template>
