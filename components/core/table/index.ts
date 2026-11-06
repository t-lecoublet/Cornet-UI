// Internal barrel for the table engine. It is NOT re-exported from the library
// entry point: DuTable is the public surface, and the engine's API can change
// without notice.
export { useTable } from './useTable'
export { compareForDirection, compareValues, displayText, normalizeText, textMatches } from './compare'

export type {
  Table,
  TableColumnDef,
  TableExpandButtonProps,
  TableHeaderCellProps,
  TableModel,
  TableOptions,
  TableRowBase,
  TableRowControlProps,
  TableRowKey,
  TableRowProps,
  TableSelectAllState,
  TableSelectionMode,
  TableSortButtonProps,
  TableSortDirection,
  TableSortEntry,
  TableSortMode,
} from './types'
