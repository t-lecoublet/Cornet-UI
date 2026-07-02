import { computed } from 'vue'

interface PaginationPagesProps {
  modelValue: number
  total: number
  perPage: number
  maxPages: number
  showEllipsis: boolean
}

/** Derives the total page count and the windowed/ellipsis-aware list of page buttons to render. */
export function usePaginationPages(props: PaginationPagesProps) {
  const totalPages = computed(() => Math.ceil(props.total / props.perPage))

  const pages = computed(() => {
    const result: (number | string)[] = []
    const current = props.modelValue

    if (props.maxPages > 0) {
      const maxPagesHalf = Math.floor(props.maxPages / 2)
      let startPage = Math.max(1, current - maxPagesHalf)
      const endPage = Math.min(totalPages.value, startPage + props.maxPages - 1)

      if (endPage - startPage + 1 < props.maxPages) {
        startPage = Math.max(1, endPage - props.maxPages + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        result.push(i)
      }

      return result
    }

    result.push(1)

    if (props.showEllipsis && current > 3) {
      result.push('...')
    }

    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(current + 1, totalPages.value - 1);
      i++
    ) {
      result.push(i)
    }

    if (props.showEllipsis && current < totalPages.value - 2) {
      result.push('...')
    }

    if (totalPages.value > 1) {
      result.push(totalPages.value)
    }

    return result
  })

  return { totalPages, pages }
}
