import { Button, Container, Group, Stack, Title } from '@mantine/core'
import { useState } from 'react'
import { DataGrid, type Column } from 'events-lib'
import { LOCATIONS, SEVERITY_LABELS, severityLabel, type Event } from './mockEvents'
import { useEventsQuery, type FetchMode } from './useEventsQuery'

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
    // ISO 8601 strings sort chronologically as plain strings.
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

function App() {
  const [mode, setMode] = useState<FetchMode>('fast')
  const { data, isLoading, isFetching, isError, error, refetch } = useEventsQuery(mode)

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

  return (
    <Container size="xl" py="lg">
      <Stack gap="md">
        <Title order={1}>Events</Title>
        <Group>
          <Button onClick={() => setMode('fast')}>Fast load</Button>
          <Button onClick={() => setMode('slow')}>Slow load</Button>
          <Button color="red" onClick={() => setMode('error')}>
            Error
          </Button>
        </Group>
        <DataGrid
          rows={isRetrying ? [] : (data ?? [])}
          columns={columns}
          getRowId={(r) => r.id}
          loading={isLoading || isRetrying}
          error={errorElement}
        />
      </Stack>
    </Container>
  )
}

export default App
