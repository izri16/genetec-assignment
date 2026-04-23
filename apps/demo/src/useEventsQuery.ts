import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CATEGORY_EVENTS,
  upsertEvent as _upsertEvent,
  type Category,
  type Event,
} from './mockEvents'

// Each category simulates a different backend characteristic so the grid
// exercises all of its states (fast / slow / error / empty) from real user
// actions instead of artificial toggle buttons.
const CATEGORY_DELAYS: Record<Category, number> = {
  access: 300,
  video: 2000,
  alarms: 800,
  network: 300,
}

function fetchEvents(category: Category): Promise<Event[]> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (category === 'alarms') {
        reject(new Error('Failed to load events. Please try again.'))
        return
      }
      resolve(CATEGORY_EVENTS[category])
    }, CATEGORY_DELAYS[category])
  })
}

export function useEventsQuery(category: Category) {
  return useQuery({
    queryKey: ['events', category],
    queryFn: () => fetchEvents(category),
    retry: false,
  })
}

// Simulated save endpoint: 500ms latency, every 4th call fails so the form
// can exercise its error branch without flaky determinism.
let saveCallCount = 0

async function upsertEvent(category: Category, event: Event, isEdit: boolean): Promise<Event> {
  await new Promise((r) => window.setTimeout(r, 500))
  saveCallCount++
  if (saveCallCount % 4 === 0) {
    throw new Error('Save failed. Please try again.')
  }
  _upsertEvent(category, event, isEdit)
  return event
}

interface UpsertVariables {
  event: Event
  isEdit: boolean
}

export function useUpsertEventMutation(category: Category) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ event, isEdit }: UpsertVariables) => upsertEvent(category, event, isEdit),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events', category] }),
  })
}
