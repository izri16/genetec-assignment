import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePagination } from './pagination'

const makeRows = (n: number) => Array.from({ length: n }, (_, i) => ({ id: i }))

describe('usePagination', () => {
  it('starts on page 1 and slices the first page', () => {
    const rows = makeRows(50)
    const { result } = renderHook(() => usePagination(rows, 20))

    expect(result.current.page).toBe(1)
    expect(result.current.totalPages).toBe(3)
    expect(result.current.pageRows).toHaveLength(20)
    expect(result.current.pageRows[0]).toEqual({ id: 0 })
    expect(result.current.rangeStart).toBe(1)
    expect(result.current.rangeEnd).toBe(20)
  })

  it('last page is short when rows do not divide evenly', () => {
    const rows = makeRows(50)
    const { result } = renderHook(() => usePagination(rows, 20))

    act(() => result.current.setPage(3))

    expect(result.current.pageRows).toHaveLength(10)
    expect(result.current.pageRows[0]).toEqual({ id: 40 })
    expect(result.current.rangeStart).toBe(41)
    expect(result.current.rangeEnd).toBe(50)
  })

  it('reports totalPages = 1 and empty rows for an empty dataset', () => {
    const rows = makeRows(0)
    const { result } = renderHook(() => usePagination(rows, 20))

    expect(result.current.totalPages).toBe(1)
    expect(result.current.pageRows).toHaveLength(0)
    expect(result.current.rangeStart).toBe(0)
    expect(result.current.rangeEnd).toBe(0)
  })

  it('resets to page 1 when the row count changes', () => {
    const { result, rerender } = renderHook(({ rows }) => usePagination(rows, 20), {
      initialProps: { rows: makeRows(100) },
    })

    act(() => result.current.setPage(4))
    expect(result.current.page).toBe(4)

    rerender({ rows: makeRows(40) }) // length shrunk

    expect(result.current.page).toBe(1)
  })

  it('keeps the current page when rows reference changes but length is stable', () => {
    const { result, rerender } = renderHook(({ rows }) => usePagination(rows, 20), {
      initialProps: { rows: makeRows(100) },
    })

    act(() => result.current.setPage(3))
    rerender({ rows: makeRows(100) }) // new reference, same length

    expect(result.current.page).toBe(3)
  })

  it('resets to page 1 when pageSize changes', () => {
    const rows = makeRows(100)
    const { result, rerender } = renderHook(({ size }) => usePagination(rows, size), {
      initialProps: { size: 20 },
    })

    act(() => result.current.setPage(4))
    expect(result.current.page).toBe(4)

    rerender({ size: 50 })

    expect(result.current.page).toBe(1)
  })
})
