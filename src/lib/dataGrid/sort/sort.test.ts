import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useSort } from './sort'
import type { Column } from '../common'

interface Row {
  id: string
  num: number
  date: Date
}

const rows: Row[] = [
  { id: 'c', num: 2, date: new Date('2026-01-10') },
  { id: 'a', num: 3, date: new Date('2026-01-05') },
  { id: 'b', num: 1, date: new Date('2026-01-20') },
]

const columns: Column<Row>[] = [
  {
    key: 'id',
    label: 'ID',
    accessor: (r) => r.id,
    compare: (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  },
  {
    key: 'num',
    label: 'Num',
    accessor: (r) => r.num,
    compare: (a, b) => a.num - b.num,
  },
  {
    key: 'date',
    label: 'Date',
    accessor: (r) => r.date.toISOString(),
    compare: (a, b) => a.date.getTime() - b.date.getTime(),
  },
  { key: 'plain', label: 'Plain', accessor: (r) => r.id }, // not sortable
]

describe('useSort', () => {
  it('returns rows unchanged when no sort is active', () => {
    const { result } = renderHook(() => useSort(rows, columns))

    expect(result.current.sortState).toBeNull()
    expect(result.current.sortedRows).toBe(rows)
  })

  it('sorts strings ascending, then descending, then off', () => {
    const { result } = renderHook(() => useSort(rows, columns))

    act(() => result.current.toggleSort('id'))
    expect(result.current.sortState).toEqual({ key: 'id', direction: 'asc' })
    expect(result.current.sortedRows.map((r) => r.id)).toEqual(['a', 'b', 'c'])

    act(() => result.current.toggleSort('id'))
    expect(result.current.sortState).toEqual({ key: 'id', direction: 'desc' })
    expect(result.current.sortedRows.map((r) => r.id)).toEqual(['c', 'b', 'a'])

    act(() => result.current.toggleSort('id'))
    expect(result.current.sortState).toBeNull()
    expect(result.current.sortedRows).toBe(rows)
  })

  it('switching to a different column starts at ascending', () => {
    const { result } = renderHook(() => useSort(rows, columns))

    act(() => result.current.toggleSort('id')) // asc
    act(() => result.current.toggleSort('id')) // desc
    act(() => result.current.toggleSort('num'))
    expect(result.current.sortState).toEqual({ key: 'num', direction: 'asc' })
  })
})
