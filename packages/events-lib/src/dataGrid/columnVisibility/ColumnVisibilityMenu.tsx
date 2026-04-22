import { ActionIcon, Badge, Checkbox, Group, Popover, Stack } from '@mantine/core'
import { useState } from 'react'
import type { Column } from '../common'

interface ColumnVisibilityMenuProps<T> {
  columns: readonly Column<T>[]
  isColumnVisible: (key: string) => boolean
  onToggleColumn: (key: string) => void
}

export function ColumnVisibilityMenu<T>({
  columns,
  isColumnVisible,
  onToggleColumn,
}: ColumnVisibilityMenuProps<T>) {
  const [opened, setOpened] = useState(false)
  const hiddenCount = columns.filter((c) => !isColumnVisible(c.key)).length
  const hasHiddenColumns = hiddenCount > 0

  const handleToggleOpen = () => setOpened((o) => !o)

  const handleToggleColumn = (key: string) => () => onToggleColumn(key)

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      shadow="md"
      withArrow
      trapFocus
      returnFocus
    >
      <Popover.Target>
        <Group gap={4} wrap="nowrap">
          {hasHiddenColumns && (
            <Badge size="xs" variant="light" color="blue">
              {hiddenCount} hidden
            </Badge>
          )}
          <ActionIcon
            variant={hasHiddenColumns ? 'filled' : 'subtle'}
            color={hasHiddenColumns ? 'blue' : 'gray'}
            onClick={handleToggleOpen}
            aria-label={
              hasHiddenColumns ? `Configure columns (${hiddenCount} hidden)` : 'Configure columns'
            }
            aria-pressed={hasHiddenColumns}
          >
            <GearIcon />
          </ActionIcon>
        </Group>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs" style={{ minWidth: 180 }}>
          {columns.map((col) => (
            <Checkbox
              key={col.key}
              label={col.label}
              checked={isColumnVisible(col.key)}
              disabled={col.hideable === false}
              onChange={handleToggleColumn(col.key)}
            />
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

function GearIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={14}
      height={14}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
    </svg>
  )
}
