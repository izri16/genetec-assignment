import { useState } from 'react'
import type { Column } from '../common'

export function useColumnVisibility<T>(columns: readonly Column<T>[]) {
  const [hiddenKeys, setHiddenKeys] = useState<ReadonlySet<string>>(() => new Set())

  const toggleColumnVisibility = (key: string) => {
    const col = columns.find((c) => c.key === key)
    if (col?.hideable === false) return
    setHiddenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const visibleColumns = columns.filter((c) => !hiddenKeys.has(c.key))

  const isColumnVisible = (key: string) => !hiddenKeys.has(key)

  return { visibleColumns, isColumnVisible, toggleColumnVisibility }
}
