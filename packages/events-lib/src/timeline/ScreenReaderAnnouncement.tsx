import { VisuallyHidden } from '@mantine/core'
import type { DayGroup } from './grouping'

interface Props<T> {
  focusedDay: DayGroup<T> | undefined
  focusedEvent: T | undefined
  getEventLabel: (event: T) => string
  eventIndex: number
  page: number
  totalPages: number
}

export function ScreenReaderAnnouncement<T>({
  focusedDay,
  focusedEvent,
  getEventLabel,
  eventIndex,
  page,
  totalPages,
}: Props<T>) {
  const text =
    focusedDay && focusedEvent != null
      ? formatAnnouncement(
          focusedDay.date,
          getEventLabel(focusedEvent),
          eventIndex,
          focusedDay.events.length,
          page,
          totalPages,
        )
      : ''

  return (
    <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
      {text}
    </VisuallyHidden>
  )
}

function formatAnnouncement(
  date: Date,
  eventLabel: string,
  eventIndex: number,
  dayEventsCount: number,
  page: number,
  totalPages: number,
): string {
  const dateStr = date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const position = `Item ${eventIndex + 1} of ${dayEventsCount}`
  const pageSuffix = totalPages > 1 ? `. Page ${page} of ${totalPages}` : ''
  return `${dateStr}. ${eventLabel}. ${position}${pageSuffix}.`
}
