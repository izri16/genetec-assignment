import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFilters } from './filter'
import type { Column } from '../common'

interface Row {
  id: string
  name: string
  severity: 'low' | 'high'
}

// Fixture is arranged so the AND test genuinely narrows:
//   name='Door'     → 1, 3
//   severity='high' → 1, 3, 4  (strict superset of the name match)
//   AND             → 1, 3     (narrower than severity alone)
const rows: Row[] = [
  { id: '1', name: 'Door forced', severity: 'high' },
  { id: '2', name: 'Badge read', severity: 'low' },
  { id: '3', name: 'Door alarm', severity: 'high' },
  { id: '4', name: 'Motion detected', severity: 'high' },
]

const columns = [
  { key: 'id', label: 'ID', accessor: (r: Row) => r.id, filterOn: (r: Row) => r.id },
  { key: 'name', label: 'Name', accessor: (r: Row) => r.name, filterOn: (r: Row) => r.name },
  {
    key: 'severity',
    label: 'Severity',
    accessor: (r: Row) => r.severity,
    filterOn: (r: Row) => r.severity,
    filterOptions: ['low', 'high'],
  },
  { key: 'plain', label: 'Plain', accessor: (r: Row) => r.name }, // not filterable
] as const satisfies readonly Column<Row>[]

describe('useFilters', () => {
  it('returns all rows when no filter is active', () => {
    const { result } = renderHook(() => useFilters(rows, columns))
    expect(result.current.filteredRows).toBe(rows)
    expect(result.current.hasActiveFilters).toBe(false)
  })

  it('filters text columns with case-insensitive substring match', () => {
    const { result } = renderHook(() => useFilters(rows, columns))

    act(() => result.current.setFilter('name', 'DOOR'))

    expect(result.current.hasActiveFilters).toBe(true)
    expect(result.current.filteredRows.map((r) => r.id)).toEqual(['1', '3'])
  })

  it('filters Select-backed columns with exact match', () => {
    const { result } = renderHook(() => useFilters(rows, columns))

    act(() => result.current.setFilter('severity', 'high'))

    expect(result.current.filteredRows.map((r) => r.id)).toEqual(['1', '3', '4'])
  })

  it('ANDs multiple filters together', () => {
    const { result } = renderHook(() => useFilters(rows, columns))

    act(() => {
      result.current.setFilter('name', 'Door')
      result.current.setFilter('severity', 'high')
    })

    expect(result.current.filteredRows.map((r) => r.id)).toEqual(['1', '3'])
  })

  it('removes a filter when value is empty', () => {
    const { result } = renderHook(() => useFilters(rows, columns))

    act(() => result.current.setFilter('name', 'Door'))
    expect(result.current.hasActiveFilters).toBe(true)

    act(() => result.current.setFilter('name', ''))
    expect(result.current.hasActiveFilters).toBe(false)
    expect(result.current.filteredRows).toBe(rows)
  })

  it('clearAll removes every filter', () => {
    const { result } = renderHook(() => useFilters(rows, columns))

    act(() => {
      result.current.setFilter('name', 'Door')
      result.current.setFilter('severity', 'high')
    })
    expect(result.current.hasActiveFilters).toBe(true)

    act(() => result.current.clearAllFilters())
    expect(result.current.hasActiveFilters).toBe(false)
    expect(result.current.filteredRows).toBe(rows)
  })

  it('ignores filters targeting non-filterable columns', () => {
    const { result } = renderHook(() => useFilters(rows, columns))

    // 'plain' is a valid column key (so TS accepts it) but has no filterOn,
    // so the hook silently drops it at the predicate step.
    act(() => result.current.setFilter('plain', 'anything'))

    expect(result.current.filteredRows).toBe(rows)
  })

  it('rejects typo/unknown keys at compile time', () => {
    const { result } = renderHook(() => useFilters(rows, columns))

    // @ts-expect-error — 'severrity' (typo) is not a valid column key.
    result.current.setFilter('severrity', 'high')
  })

  it('returns the same rows reference when nothing changes (referential stability)', () => {
    const { result, rerender } = renderHook(() => useFilters(rows, columns))
    const first = result.current.filteredRows
    rerender()
    expect(result.current.filteredRows).toBe(first)
  })
})
