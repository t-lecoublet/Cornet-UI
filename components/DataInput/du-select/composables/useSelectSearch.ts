import { computed, type Ref } from 'vue'

interface SelectSearchProps {
  options: any[]
}

/** Owns the filtered-options view over the query string. */
export function useSelectSearch(
  props: SelectSearchProps,
  query: Ref<string>,
  highlightedIndex: Ref<number>,
  optionLabel: (opt: any) => string,
) {
  const filteredOptions = computed(() => {
    const q = query.value?.toString().trim().toLowerCase()
    if (!q) return props.options
    return props.options.filter((o) => optionLabel(o).toString().toLowerCase().includes(q))
  })

  function onQuery() {
    highlightedIndex.value = 0
  }

  function resetQuery() {
    query.value = ''
  }

  return { filteredOptions, onQuery, resetQuery }
}
