import { useMemo, useState } from 'react'
import type { Column } from '../common'

export type FilterState = Record<string, string>

function getActiveFilters(filters: FilterState): FilterState {
  return Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
}

/**
 * Per-column filtering. Each filter value is a plain string; an empty string
 * means "no filter for this column".
 *
 * Match rules:
 *   - column has `filterOptions` → exact match (Select-driven)
 *   - otherwise → case-insensitive substring match (text input-driven)
 */
export function useFilters<T, C extends readonly Column<T>[]>(rows: readonly T[], columns: C) {
  // Constrain `setFilter` keys to the column keys — catches typos when the
  // consumer declares `columns` with `as const satisfies readonly Column<T>[]`.
  //
  // We could go further and narrow to *filterable* keys only (Extract over
  // `{ filterOn: ... }`), but that's likely overkill, and would introduce
  // extra type inference complexity.
  type Key = C[number]['key']

  const [rawFilters, setRawFilters] = useState<FilterState>({})

  const setFilter = (key: Key, value: string) =>
    setRawFilters((prev) => ({ ...prev, [key]: value }))

  const clearAllFilters = () => setRawFilters({})

  const filters = getActiveFilters(rawFilters)
  const hasActiveFilters = Object.keys(filters).length > 0

  const filteredRows = useMemo<readonly T[]>(() => {
    const activeFilters = getActiveFilters(rawFilters)
    if (Object.keys(activeFilters).length === 0) return rows

    const predicates = Object.entries(activeFilters)
      .map(([key, value]) => {
        const col = columns.find((c) => c.key === key)
        if (!col?.filterOn) return null
        const filterOn = col.filterOn
        if (col.filterOptions) {
          return (row: T) => filterOn(row) === value
        }
        const needle = value.toLowerCase()
        return (row: T) => filterOn(row).toLowerCase().includes(needle)
      })
      .filter((p): p is (row: T) => boolean => p !== null)

    if (predicates.length === 0) return rows
    return rows.filter((row) => predicates.every((p) => p(row)))
  }, [rows, rawFilters, columns])

  return { filters, setFilter, clearAllFilters, filteredRows, hasActiveFilters }
}
