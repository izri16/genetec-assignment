import { compareDesc, format, isValid, startOfDay } from 'date-fns'

export interface DayGroup<T> {
  date: Date
  events: T[]
}

export function groupEventsByDay<T extends { date: Date | string }>(
  events: readonly T[],
): DayGroup<T>[] {
  const sorted = [...events]
    .filter((e) => isValid(new Date(e.date)))
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  const byDay = new Map<string, DayGroup<T>>()
  for (const event of sorted) {
    const date = new Date(event.date)
    const key = format(date, 'yyyy-MM-dd')
    let group = byDay.get(key)
    if (!group) {
      group = { date: startOfDay(date), events: [] }
      byDay.set(key, group)
    }
    group.events.push(event)
  }
  return Array.from(byDay.values())
}
