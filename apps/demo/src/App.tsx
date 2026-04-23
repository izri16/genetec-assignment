import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DataGrid, UpsertEventForm, type Column, type FormField } from 'events-lib'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  LOCATIONS,
  SEVERITY_LABELS,
  TAG_POOL,
  severityLabel,
  type Category,
  type Event,
  type SeverityLabel,
} from './mockEvents'
import { useEventsQuery, useUpsertEventMutation } from './useEventsQuery'

// Case-insensitive, deterministic string compare. Not locale-aware.
const byString =
  <T,>(get: (row: T) => string) =>
  (a: T, b: T) => {
    const x = get(a).toLowerCase()
    const y = get(b).toLowerCase()
    return x < y ? -1 : x > y ? 1 : 0
  }

const columns: Column<Event>[] = [
  {
    key: 'id',
    label: 'ID',
    accessor: (r) => r.id,
    compare: byString((r) => r.id),
    width: '25%',
    filterOn: (r) => r.id,
    hideable: false,
  },
  {
    key: 'createdAt',
    label: 'Created',
    accessor: (r) => new Date(r.createdAt).toLocaleString(),
    compare: byString((r) => r.createdAt),
    width: 180,
  },
  {
    key: 'name',
    label: 'Name',
    accessor: (r) => r.name,
    compare: byString((r) => r.name),
    filterOn: (r) => r.name,
  },
  {
    key: 'location',
    label: 'Location',
    accessor: (r) => r.location,
    compare: byString((r) => r.location),
    width: 150,
    filterOn: (r) => r.location,
    filterOptions: LOCATIONS,
  },
  {
    key: 'severity',
    label: 'Severity',
    accessor: (r) => severityLabel(r.severity),
    compare: (a, b) => a.severity - b.severity,
    width: 150,
    filterOn: (r) => severityLabel(r.severity),
    filterOptions: SEVERITY_LABELS,
  },
  {
    key: 'tags',
    label: 'Tags',
    accessor: (r) => r.tags.join(', '),
    filterOn: (r) => r.tags.join(' '),
  },
]

interface EventFormValues extends Record<string, unknown> {
  name: string
  createdAt: string
  location: string
  severity: string
  tags: string[]
}

const emptyForm = (): EventFormValues => ({
  name: '',
  createdAt: toDatetimeLocal(new Date().toISOString()),
  location: '',
  severity: '',
  tags: [],
})

const eventFields: FormField<EventFormValues>[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'e.g. Door forced open',
  },
  {
    key: 'createdAt',
    label: 'Created at',
    type: 'datetime',
    required: true,
    // An event can't be logged as occurring in the future.
    validate: (v) =>
      new Date(v as string).getTime() > Date.now() ? 'Cannot be in the future' : null,
  },
  { key: 'location', label: 'Location', type: 'select', required: true, options: LOCATIONS },
  { key: 'severity', label: 'Severity', type: 'select', required: true, options: SEVERITY_LABELS },
  { key: 'tags', label: 'Tags', type: 'multiselect', options: TAG_POOL },
]

const toDatetimeLocal = (iso: string) => format(new Date(iso), "yyyy-MM-dd'T'HH:mm")

const eventToForm = (e: Event): EventFormValues => ({
  name: e.name,
  createdAt: toDatetimeLocal(e.createdAt),
  location: e.location,
  severity: severityLabel(e.severity),
  tags: e.tags,
})

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
    const event: Event = {
      id: editing?.id ?? uuidv4(),
      name: values.name.trim(),
      createdAt: new Date(values.createdAt).toISOString(),
      location: values.location,
      severity: SEVERITY_LABELS.indexOf(values.severity as SeverityLabel),
      tags: values.tags,
    }
    await upsertEvent.mutateAsync({ event, isEdit: !!editing })
  }

  return (
    <Container size="xl" py="lg" h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Stack gap="md" style={{ flex: 1, minHeight: 0 }}>
        <Title order={1}>Event console</Title>
        <Group justify="space-between" wrap="wrap">
          <Group gap="sm">
            <SegmentedControl
              value={category}
              onChange={(v) => setCategory(v as Category)}
              data={CATEGORY_OPTIONS}
            />
            <SegmentedControl
              value={view}
              onChange={(v) => setView(v as View)}
              data={VIEW_OPTIONS}
            />
          </Group>
          <Button leftSection={<IconPlus size={16} />} onClick={handleNewEvent}>
            New event
          </Button>
        </Group>
        <Box style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {view === 'grid' ? (
            <DataGrid
              rows={isRetrying ? [] : (data ?? [])}
              columns={columns}
              getRowId={(r) => r.id}
              loading={isLoading || isRetrying}
              error={errorElement}
              onRowClick={handleRowClick}
            />
          ) : (
            <Paper withBorder p="xl" style={{ flex: 1 }}>
              <Text c="dimmed" ta="center">
                Timeline view — coming soon
              </Text>
            </Paper>
          )}
        </Box>
      </Stack>
      {formOpen && (
        <UpsertEventForm
          onClose={() => setFormOpen(false)}
          title={editing ? 'Edit event' : 'New event'}
          fields={eventFields}
          initialValues={editing ? eventToForm(editing) : emptyForm()}
          onSave={handleSave}
          successMessage={editing ? 'Event updated' : 'Event created'}
          isEditing={!!editing}
        />
      )}
    </Container>
  )
}

export default App
