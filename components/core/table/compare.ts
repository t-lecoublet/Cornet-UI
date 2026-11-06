// Pure helpers behind the table engine's default sort and search. No Vue, no
// DOM — they are the part most worth testing in isolation.

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

const isEmpty = (value: unknown): boolean =>
  value === null || value === undefined || value === '' || (typeof value === 'number' && Number.isNaN(value))

/**
 * Ascending order for two cell values.
 *
 * Numbers compare as numbers, dates by time, booleans false-first, and
 * everything else as text through a numeric-aware collator — so `item 2`
 * sorts before `item 10`, and `é` sits next to `e` instead of after `z`.
 *
 * Empty values (`null`, `undefined`, `''`, `NaN`) are **not** handled here:
 * they go last in both directions, which `compareRows` arranges. A blank
 * cell is missing data, not the smallest value.
 */
export function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime()
  }
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b)
  }
  if (typeof a === 'bigint' && typeof b === 'bigint') {
    return a < b ? -1 : a > b ? 1 : 0
  }
  return collator.compare(String(a), String(b))
}

/**
 * Orders two values for a given direction, with empty values last either way.
 * Returns `0` when both are empty, so the next sort key (or the original
 * order — `Array.prototype.sort` is stable) decides.
 */
export function compareForDirection(a: unknown, b: unknown, direction: 'asc' | 'desc'): number {
  const emptyA = isEmpty(a)
  const emptyB = isEmpty(b)
  if (emptyA || emptyB) {
    return emptyA === emptyB ? 0 : emptyA ? 1 : -1
  }
  const order = compareValues(a, b)
  return direction === 'asc' ? order : -order
}

/** Lower-cased, accent-free text: `Élodie` is found by `elo`. */
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

/** The default search: the cell's displayed text contains the query, ignoring case and accents. */
export function textMatches(text: string, query: string): boolean {
  return normalizeText(text).includes(normalizeText(query.trim()))
}

/** The text a value shows when no `format` is given. */
export function displayText(value: unknown): string {
  if (isEmpty(value)) {
    return ''
  }
  if (value instanceof Date) {
    return value.toLocaleString()
  }
  // Arrays and plain objects read the way Vue's own `{{ }}` would show them.
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}
