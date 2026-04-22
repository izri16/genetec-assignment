import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  label: string
  accessor: (row: T) => ReactNode
  // Presence makes the column sortable
  compare?: (a: T, b: T) => number
}
