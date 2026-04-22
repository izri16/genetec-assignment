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
}
