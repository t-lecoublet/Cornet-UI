import { computed, type Ref } from 'vue'
import type { DuSearchOption } from '../du-search.types'

interface SearchQueryProps {
  listValues: DuSearchOption[]
  remoteSearch?: boolean
  limit?: number
  labelBy?: string
}

/** Owns the label-field resolution and the filtered/query-derived option views. */
export function useSearchQuery(props: SearchQueryProps, query: Ref<string>) {
  const labelField = computed(() => props.labelBy ?? 'name')

  const queryValue = computed(() =>
    query.value === '' ? null : { id: null, name: query.value }
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

  return { labelField, queryValue, filteredValues }
}
