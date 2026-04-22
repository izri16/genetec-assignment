import { useQuery } from '@tanstack/react-query'
import { CATEGORY_EVENTS, type Category, type Event } from './mockEvents'

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
