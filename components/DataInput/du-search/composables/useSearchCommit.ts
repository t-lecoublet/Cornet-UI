import { type ComputedRef, type Ref } from 'vue'
import type { DuSearchOption } from '../du-search.types'

interface SearchCommitProps {
  multiple?: boolean
  autoCommit?: boolean
  remoteSearch?: boolean
  addOption?: boolean
  listValues: DuSearchOption[]
}

/** Owns the "commit the in-progress query" business rule (exact match / remote best-result / new option) and its blur trigger. */
export function useSearchCommit(
  props: SearchCommitProps,
  query: Ref<string>,
  isEditing: Ref<boolean>,
  selectedValues: Ref<any[]>,
  labelField: ComputedRef<string>,
  selectValue: (val: any) => void,
  updateModel: () => void,
) {
  function commitQuery() {
    if (query.value === '') {
      selectedValues.value = []
      updateModel()
      return
    }
    const match = props.listValues.find(
      (o) => String(o[labelField.value]).toLowerCase() === query.value.toLowerCase()
    )
    if (match) {
      selectValue(match)
    } else if (props.remoteSearch && props.listValues.length > 0) {
      // Remote search: select the best (first) result
      selectValue(props.listValues[0])
    } else if (props.addOption) {
      selectValue({ id: null, name: query.value })
    } else {
      selectedValues.value = []
      updateModel()
    }
    isEditing.value = false
    query.value = ''
  }

  function onBlurCleanup() {
    if (!props.multiple && isEditing.value) {
      if (props.autoCommit) {
        commitQuery()
      } else {
        if (query.value === '') {
          selectedValues.value = []
          updateModel()
        }
        isEditing.value = false
        query.value = ''
      }
    }
  }

  return { commitQuery, onBlurCleanup }
}
