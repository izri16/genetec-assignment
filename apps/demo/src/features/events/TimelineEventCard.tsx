import { ActionIcon, Box, Stack, Text } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import { type Event } from './common'
import { SeverityBadge } from './SeverityBadge'
import classes from './TimelineEventCard.module.css'

interface Props {
  event: Event
  onEdit: (event: Event) => void
}

export function TimelineEventCard({ event, onEdit }: Props) {
  return (
    <>
      <Stack gap={4} className={classes.body}>
        <Text size="sm" fw={600} className={classes.truncate}>
          {event.name}
        </Text>
        <Text size="xs" c="dimmed" className={classes.truncate}>
          {event.location}
        </Text>
        <Box className={classes.severity}>
          <SeverityBadge severity={event.severity} />
        </Box>
      </Stack>
      <ActionIcon
        size="xs"
        variant="subtle"
        color="gray"
        aria-label="Edit event"
        onClick={(ev) => {
          ev.stopPropagation()
          onEdit(event)
        }}
        className={classes.edit}
      >
        <IconPencil size={12} />
      </ActionIcon>
    </>
  )
}
