import { useQuery } from '@tanstack/react-query'
import { MOCK_EVENTS, type Event } from './mockEvents'

export type FetchMode = 'fast' | 'slow' | 'error'

const DELAYS: Record<FetchMode, number> = { fast: 300, slow: 2000, error: 800 }

function fetchEvents(mode: FetchMode): Promise<Event[]> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (mode === 'error') reject(new Error('Failed to load events. Please try again.'))
      else resolve(MOCK_EVENTS)
    }, DELAYS[mode])
  })
}

export function useEventsQuery(mode: FetchMode) {
  return useQuery({
    queryKey: ['events', mode],
    queryFn: () => fetchEvents(mode),
    retry: false,
  })
}
