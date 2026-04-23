import { ActionIcon, Box, Stack, Text } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import { type Event } from './common'
import { SeverityBadge } from './SeverityBadge'

const truncate = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const

interface Props {
  event: Event
  onEdit: (event: Event) => void
}

export function TimelineEventCard({ event, onEdit }: Props) {
  return (
    <>
      <Stack gap={4} style={{ paddingRight: 20 }}>
        <Text size="sm" fw={600} style={truncate}>
          {event.name}
        </Text>
        <Text size="xs" c="dimmed" style={truncate}>
          {event.location}
        </Text>
        <Box style={{ alignSelf: 'flex-start' }}>
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
        style={{ position: 'absolute', top: 4, right: 4 }}
      >
        <IconPencil size={12} />
      </ActionIcon>
    </>
  )
}
