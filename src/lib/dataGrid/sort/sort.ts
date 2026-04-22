import { useCallback, useMemo, useState } from 'react'
import type { Column } from '../common'

export type SortDirection = 'asc' | 'desc'
export interface SortState {
  key: string
  direction: SortDirection
}

/**
 * Single-column sort with a three-state toggle (asc → desc → off → asc).
 * Only columns that declare a `compare` function are sortable.
 */
export function useSort<T>(rows: readonly T[], columns: readonly Column<T>[]) {
  const [sortState, setSortState] = useState<SortState | null>(null)

  const toggleSort = useCallback((key: string) => {
    setSortState((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
  }, [])

  const sortedRows = useMemo<readonly T[]>(() => {
    if (sortState == null) return rows
    const col = columns.find((c) => c.key === sortState.key)
    if (!col?.compare) return rows
    const compare = col.compare
    const direction = sortState.direction === 'asc' ? 1 : -1
    // Copy before sorting — `Array.prototype.sort` mutates in place.
    return [...rows].sort((a, b) => compare(a, b) * direction)
  }, [rows, sortState, columns])

  return { sortState, toggleSort, sortedRows }
}
