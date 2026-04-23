import { Box, Button, Group, SegmentedControl, Stack, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { DataGrid, Timeline, UpsertEventForm } from 'events-lib'
import { AppHeader } from './components/AppHeader'
import { PageLayout } from './components/PageLayout'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  emptyEventForm,
  eventColumns,
  eventFormFields,
  eventToForm,
  formToEvent,
  SeverityBadge,
  useEventsQuery,
  useUpsertEventMutation,
  type Category,
  type Event,
  type EventFormValues,
} from './features/events'

const truncate = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const

const renderEventCard = (e: Event) => (
  <Stack gap={4}>
    <Text size="sm" fw={600} style={truncate}>
      {e.name}
    </Text>
    <Text size="xs" c="dimmed" style={truncate}>
      {e.location}
    </Text>
    <Box style={{ alignSelf: 'flex-start' }}>
      <SeverityBadge severity={e.severity} />
    </Box>
  </Stack>
)

type View = 'grid' | 'timeline'

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] }))
const VIEW_OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'timeline', label: 'Timeline' },
]

function App() {
  const [category, setCategory] = useState<Category>('access')
  const [view, setView] = useState<View>('grid')
  const [editing, setEditing] = useState<Event | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const { data, isLoading, isFetching, isError, error, refetch } = useEventsQuery(category)
  const upsertEvent = useUpsertEventMutation(category)

  // Suppress the error fallback while a retry is in flight — otherwise the
  // grid flickers between cached data and the error message.
  const isRetrying = isError && isFetching
  const showError = isError && !isRetrying

  const errorElement = showError ? (
    <Stack align="center" gap="xs">
      <span>{error?.message}</span>
      <Button size="xs" variant="light" onClick={() => refetch()}>
        Retry
      </Button>
    </Stack>
  ) : undefined

  const handleNewEvent = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleRowClick = (row: Event) => {
    setEditing(row)
    setFormOpen(true)
  }

  const handleSave = async (values: EventFormValues) => {
    await upsertEvent.mutateAsync({
      event: formToEvent(values, editing?.id),
      isEdit: !!editing,
    })
  }

  const toolbar = (
    <Group justify="space-between" wrap="wrap">
      <SegmentedControl
        value={category}
        onChange={(v) => setCategory(v as Category)}
        data={CATEGORY_OPTIONS}
      />
      <Button leftSection={<IconPlus size={16} />} onClick={handleNewEvent}>
        New event
      </Button>
    </Group>
  )

  const viewSwitcher = (
    <SegmentedControl
      value={view}
      onChange={(v) => setView(v as View)}
      data={VIEW_OPTIONS}
      size="xs"
    />
  )

  return (
    <PageLayout header={<AppHeader title="Events console" badge="demo" />} toolbar={toolbar}>
      {view === 'grid' ? (
        <DataGrid
          rows={isRetrying ? [] : (data ?? [])}
          columns={eventColumns}
          getRowId={(r) => r.id}
          loading={isLoading || isRetrying}
          error={errorElement}
          noRowsElement="No events"
          onRowClick={handleRowClick}
          toolbar={viewSwitcher}
        />
      ) : (
        <Timeline
          events={(isRetrying ? [] : (data ?? [])).map((e) => ({ ...e, date: e.createdAt }))}
          getEventId={(e) => e.id}
          getEventLabel={(e) => e.name}
          renderEvent={renderEventCard}
          loading={isLoading || isRetrying}
          error={errorElement}
          onEventClick={handleRowClick}
          toolbar={viewSwitcher}
        />
      )}
      {formOpen && (
        <UpsertEventForm
          onClose={() => setFormOpen(false)}
          title={editing ? 'Edit event' : 'New event'}
          fields={eventFormFields}
          initialValues={editing ? eventToForm(editing) : emptyEventForm()}
          onSave={handleSave}
          successMessage={editing ? 'Event updated' : 'Event created'}
          isEditing={!!editing}
        />
      )}
    </PageLayout>
  )
}

export default App
