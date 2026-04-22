import { Group, Table, UnstyledButton } from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import type { Column } from '../common'
import type { SortState } from './sort'

interface SortableHeaderProps<T> {
  column: Column<T>
  sortState: SortState | null
  onToggleSort: (key: string) => void
  /** Rendered at the right of the header (e.g. filter icon). */
  endSlot?: ReactNode
}

export function SortableHeader<T>({
  column,
  sortState,
  onToggleSort,
  endSlot,
}: SortableHeaderProps<T>) {
  const sortable = Boolean(column.compare)
  const active = sortState?.key === column.key ? sortState.direction : null
  const ariaSort = active === 'asc' ? 'ascending' : active === 'desc' ? 'descending' : 'none'

  return (
    <Table.Th aria-sort={sortable ? ariaSort : undefined}>
      <Group gap={4} wrap="nowrap" justify="space-between">
        {sortable ? (
          <UnstyledButton
            onClick={() => onToggleSort(column.key)}
            aria-label={`Sort by ${column.label}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 'inherit' }}
          >
            <span>{column.label}</span>
            <span style={{ display: 'inline-flex', opacity: active ? 1 : 0.4 }}>
              {active === 'asc' ? (
                <IconChevronUp size={14} stroke={2} />
              ) : active === 'desc' ? (
                <IconChevronDown size={14} stroke={2} />
              ) : (
                <IconSelector size={14} stroke={2} />
              )}
            </span>
          </UnstyledButton>
        ) : (
          <span>{column.label}</span>
        )}
        {endSlot}
      </Group>
    </Table.Th>
  )
}
