import { ActionIcon, Button, Popover, Select, Stack, TextInput } from '@mantine/core'
import { useState } from 'react'
import type { Column } from '../common'

interface FilterPopoverProps<T> {
  column: Column<T>
  value: string
  onChange: (value: string) => void
}

export function FilterPopover<T>({ column, value, onChange }: FilterPopoverProps<T>) {
  const [opened, setOpened] = useState(false)
  const active = value !== ''

  const handleToggleOpen = () => setOpened((o) => !o)

  const handleOptionChange = (v: string | null) => onChange(v ?? '')

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange(e.currentTarget.value)

  const handleClear = () => {
    onChange('')
    setOpened(false)
  }

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
        <ActionIcon
          size="sm"
          variant={active ? 'filled' : 'subtle'}
          color={active ? 'blue' : 'gray'}
          onClick={handleToggleOpen}
          aria-label={`Filter by ${column.label}`}
          aria-pressed={active}
        >
          <FunnelIcon filled={active} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs" style={{ minWidth: 200 }}>
          {column.filterOptions ? (
            <Select
              data={column.filterOptions as string[]}
              value={value || null}
              onChange={handleOptionChange}
              placeholder={`Select ${column.label}`}
              clearable
              searchable
              data-autofocus
              // Render the dropdown inside the Popover. Otherwise Select's
              // default portal places the dropdown on document.body, and
              // clicking an option trips Popover's "click outside" logic,
              // closing the popover before the selection commits.
              comboboxProps={{ withinPortal: false }}
            />
          ) : (
            <TextInput
              value={value}
              onChange={handleTextChange}
              placeholder={`Filter ${column.label}`}
              data-autofocus
            />
          )}
          {active && (
            <Button variant="subtle" size="xs" onClick={handleClear}>
              Clear
            </Button>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

function FunnelIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={12}
      height={12}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 3h12l-4.5 6V14l-3 -1V9L2 3z" />
    </svg>
  )
}
