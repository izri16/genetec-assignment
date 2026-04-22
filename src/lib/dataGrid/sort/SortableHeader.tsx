import { Table, UnstyledButton } from '@mantine/core'
import { type SortState } from './sort'
import type { Column } from '../common'

interface SortableHeaderProps<T> {
  column: Column<T>
  sortState: SortState | null
  onToggle: (key: string) => void
}

export function SortableHeader<T>({ column, sortState, onToggle }: SortableHeaderProps<T>) {
  const sortable = Boolean(column.compare)
  const active = sortState?.key === column.key ? sortState.direction : null
  const ariaSort = active === 'asc' ? 'ascending' : active === 'desc' ? 'descending' : 'none'

  if (!sortable) {
    return <Table.Th>{column.label}</Table.Th>
  }

  const arrow = active === 'asc' ? '▲' : active === 'desc' ? '▼' : '↕'

  return (
    <Table.Th aria-sort={ariaSort}>
      <UnstyledButton
        onClick={() => onToggle(column.key)}
        aria-label={`Sort by ${column.label}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 'inherit' }}
      >
        <span>{column.label}</span>
        <span aria-hidden style={{ opacity: active ? 1 : 0.4 }}>
          {arrow}
        </span>
      </UnstyledButton>
    </Table.Th>
  )
}
