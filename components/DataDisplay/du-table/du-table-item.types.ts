export type DuTableItemScope = 'col' | 'row' | 'colgroup' | 'rowgroup'

export interface DuTableItemProps {
  customClass?: string
  isHeader?: boolean
  /**
   * What a header cell heads. Defaults to `'col'` for a header cell: without
   * it a screen reader has to guess. Ignored on a data cell.
   */
  scope?: DuTableItemScope
  colspan?: number
  rowspan?: number
}
