import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  label: string
  accessor: (row: T) => ReactNode
  // Presence makes the column sortable
  compare?: (a: T, b: T) => number
  /**
   * Column width. Number → pixels, string → any CSS length.
   * Columns without a width share remaining space evenly (table-layout: fixed).
   */
  width?: string | number
  /**
   * Presence makes the column filterable. Returns the matchable string for
   * the row. Text filters use case-insensitive substring match; Select
   * filters (see `filterOptions`) use exact match.
   */
  filterOn?: (row: T) => string
  /**
   * If provided, the filter UI renders a Select of these values instead of
   * a free-text input (exact match against the chosen option).
   */
  filterOptions?: readonly string[]
}
