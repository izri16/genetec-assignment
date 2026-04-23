import { Badge, Box, Center, Divider, Group, Loader, Pagination, Stack, Text } from '@mantine/core'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { usePagination } from '../dataGrid/pagination'
import { EventCard } from './EventCard'
import { groupEventsByDay } from './grouping'
import { useTimelineNavigation } from './navigation'
import { ScreenReaderAnnouncement } from './ScreenReaderAnnouncement'

export interface TimelineEvent {
  date: Date | string
}

export interface TimelineProps<T extends TimelineEvent> {
  events: readonly T[]
  getEventId: (event: T) => string
  getEventLabel: (event: T) => string
  renderEvent: (event: T) => ReactNode
  daysPerPage?: number
  loading?: boolean
  error?: ReactNode
  noEventsElement?: ReactNode
  toolbar?: ReactNode
}

const formatDayHeader = (d: Date): string =>
  d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

export function Timeline<T extends TimelineEvent>({
  events,
  getEventId,
  getEventLabel,
  renderEvent,
  daysPerPage = 7,
  loading = false,
  error,
  noEventsElement,
  toolbar,
}: TimelineProps<T>) {
  const eventsByDay = useMemo(() => groupEventsByDay(events), [events])
  const { pageRows: days, page, setPage, totalPages } = usePagination(eventsByDay, daysPerPage)

  const { focusPosition, setFocusPosition } = useTimelineNavigation({
    days,
    page,
    totalPages,
    setPage,
  })

  const focusedDay = days[focusPosition.dayIndex]
  const focusedEvent = focusedDay?.events[focusPosition.eventIndex]

  // Clicking the "Timeline" SegmentedControl leaves that radio focused; its
  // native ←/→ would flip back to the Grid tab. Drop focus on mount so the
  // ambient arrow handling takes over immediately.
  useEffect(() => {
    const el = document.activeElement as HTMLElement | null
    el?.blur?.()
  }, [])

  // Scroll the focused card into view when arrow navigation moves focus
  // off-screen. Without this the user sees nothing happen.
  const scrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const focused = scrollRef.current?.querySelector<HTMLElement>('[data-focused="true"]')
    focused?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [focusPosition.dayIndex, focusPosition.eventIndex, page])

  let body: ReactNode
  if (error) {
    body = (
      <Center style={{ flex: 1 }} c="red">
        {error}
      </Center>
    )
  } else if (loading && events.length === 0) {
    body = (
      <Center style={{ flex: 1 }}>
        <Loader size="sm" />
      </Center>
    )
  } else if (days.length === 0) {
    body = (
      <Center style={{ flex: 1 }}>
        <Text c="dimmed">{noEventsElement ?? 'No events'}</Text>
      </Center>
    )
  } else {
    body = (
      <Box
        ref={scrollRef}
        aria-label="Events by day"
        style={{
          display: 'flex',
          gap: 'var(--mantine-spacing-sm)',
          overflow: 'auto',
          alignItems: 'flex-start',
          flex: 1,
          minHeight: 0,
          paddingBottom: 4,
        }}
      >
        {days.map((day, dayIdx) => (
          <Stack key={day.date.getTime()} gap="xs" style={{ flex: 1, minWidth: 0 }}>
            <Box
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                background: 'var(--mantine-color-body)',
                paddingBottom: 4,
              }}
            >
              <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
                <Text fw={500} size="sm" truncate>
                  {formatDayHeader(day.date)}
                </Text>
                <Badge size="sm" variant="default" radius="sm">
                  {day.events.length}
                </Badge>
              </Group>
              <Divider mt={4} />
            </Box>
            {day.events.map((event, eventIdx) => (
              <EventCard
                key={getEventId(event)}
                isFocused={
                  focusPosition.dayIndex === dayIdx && focusPosition.eventIndex === eventIdx
                }
                onClick={() => setFocusPosition({ dayIndex: dayIdx, eventIndex: eventIdx })}
              >
                {renderEvent(event)}
              </EventCard>
            ))}
          </Stack>
        ))}
      </Box>
    )
  }

  return (
    <Stack gap="sm" h="100%" style={{ minHeight: 0 }}>
      <ScreenReaderAnnouncement
        focusedDay={focusedDay}
        focusedEvent={focusedEvent}
        getEventLabel={getEventLabel}
        eventIndex={focusPosition.eventIndex}
        page={page}
        totalPages={totalPages}
      />
      <Group justify="space-between" align="center" wrap="nowrap">
        <Box>{toolbar}</Box>
        <Text size="xs" c="dimmed">
          Use ← → ↑ ↓ to navigate
        </Text>
      </Group>
      {body}
      {days.length > 0 && totalPages > 1 && (
        <Group justify="flex-end">
          <Pagination value={page} onChange={setPage} total={totalPages} size="sm" withEdges />
        </Group>
      )}
    </Stack>
  )
}
