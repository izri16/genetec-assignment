import { useMemo, useState } from 'react'

export function usePagination<T>(rows: readonly T[], pageSize: number) {
  const [page, setPage] = useState(1)

  // Reset to page 1 when the row count or page size changes.
  //
  // Using the "set state during render" pattern, not useEffect, to avoid the
  // cascading-renders warning. See
  // https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
  const [prevLength, setPrevLength] = useState(rows.length)
  const [prevPageSize, setPrevPageSize] = useState(pageSize)
  if (rows.length !== prevLength || pageSize !== prevPageSize) {
    setPrevLength(rows.length)
    setPrevPageSize(pageSize)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return rows.slice(start, start + pageSize)
  }, [rows, page, pageSize])

  const rangeStart = rows.length === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, rows.length)

  return { pageRows, rangeStart, rangeEnd, page, setPage, totalPages }
}
