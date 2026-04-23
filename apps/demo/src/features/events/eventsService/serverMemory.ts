import { CATEGORIES, type Category, type Event } from '../common'
import { SEED_EVENTS } from './mocksData'

// Simulates the backend's source of truth for events. Kept module-scoped so
// every call site sees the same mutable state for the lifetime of the tab.
const store: Record<Category, Event[]> = Object.fromEntries(
  CATEGORIES.map((c) => [c, [...SEED_EVENTS[c]]]),
) as Record<Category, Event[]>

export function list(category: Category): Event[] {
  return [...store[category]]
}

export function upsert(category: Category, event: Event, isEdit: boolean): Event {
  const current = store[category]
  store[category] = isEdit
    ? current.map((e) => (e.id === event.id ? event : e))
    : [event, ...current]
  return event
}
