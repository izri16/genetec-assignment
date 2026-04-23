import { format } from 'date-fns'
import { describe, expect, it } from 'vitest'
import { groupEventsByDay } from './grouping'

interface Ev {
  id: string
  date: string
}
const ev = (id: string, date: string): Ev => ({ id, date })

describe('groupEventsByDay', () => {
  it('buckets events with the same local-day date together', () => {
    const events = [
      ev('a', '2026-04-22T08:00:00'),
      ev('b', '2026-04-22T23:30:00'),
      ev('c', '2026-04-23T00:05:00'),
    ]
    const groups = groupEventsByDay(events)

    expect(groups.map((g) => format(g.date, 'yyyy-MM-dd'))).toEqual(['2026-04-23', '2026-04-22'])
    expect(groups[0].events.map((e) => e.id)).toEqual(['c'])
    expect(groups[1].events.map((e) => e.id)).toEqual(['b', 'a'])
  })

  it('sorts buckets newest-first', () => {
    const events = [ev('old', '2026-04-10T12:00:00'), ev('new', '2026-04-20T12:00:00')]
    const groups = groupEventsByDay(events)

    expect(groups[0].events[0].id).toBe('new')
    expect(groups[1].events[0].id).toBe('old')
  })

  it('sorts events inside a bucket newest-first', () => {
    const events = [
      ev('late', '2026-04-22T18:00:00'),
      ev('early', '2026-04-22T07:00:00'),
      ev('mid', '2026-04-22T12:00:00'),
    ]
    const [group] = groupEventsByDay(events)

    expect(group.events.map((e) => e.id)).toEqual(['late', 'mid', 'early'])
  })

  it('drops events whose date is unparseable', () => {
    const events = [ev('ok', '2026-04-22T12:00:00'), ev('bad', 'not-a-date')]
    const groups = groupEventsByDay(events)

    expect(groups).toHaveLength(1)
    expect(groups[0].events.map((e) => e.id)).toEqual(['ok'])
  })
})
