export * from './common'
export * from './eventColumns'
export * from './eventForm'
export * from './SeverityBadge'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type Category, type Event } from './common'
import { fetchEvents, upsertEvent } from './eventsService'

export function useEventsQuery(category: Category) {
  return useQuery({
    queryKey: ['events', category],
    queryFn: () => fetchEvents(category),
    retry: false,
  })
}

interface UpsertEventMutationParams {
  event: Event
  isEdit: boolean
}

export function useUpsertEventMutation(category: Category) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ event, isEdit }: UpsertEventMutationParams) =>
      upsertEvent(category, event, isEdit),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events', category] }),
  })
}
