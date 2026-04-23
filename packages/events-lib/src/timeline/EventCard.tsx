import { Paper } from '@mantine/core'
import type { ReactNode } from 'react'

interface Props {
  isFocused: boolean
  onClick?: () => void
  children: ReactNode
}

export function EventCard({ isFocused, onClick, children }: Props) {
  return (
    <Paper
      withBorder
      p="xs"
      onClick={onClick}
      data-focused={isFocused || undefined}
      style={{
        position: 'relative',
        cursor: onClick ? 'pointer' : undefined,
        background: isFocused ? 'var(--mantine-color-blue-light)' : undefined,
        borderColor: isFocused ? 'var(--mantine-color-blue-filled)' : undefined,
        // Leaves room for the sticky day header when scrollIntoView targets
        // a card near the top — otherwise it lands under the header.
        scrollMarginTop: 40,
      }}
    >
      {children}
    </Paper>
  )
}
