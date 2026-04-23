import { Paper } from '@mantine/core'
import type { ReactNode } from 'react'
import classes from './EventCard.module.css'

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
      className={classes.card}
      data-clickable={onClick ? true : undefined}
      data-focused={isFocused || undefined}
    >
      {children}
    </Paper>
  )
}
