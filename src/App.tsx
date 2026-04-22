import { Container, Stack, Title } from '@mantine/core'
import { DataGrid, type Column } from './lib'
import { LOCATIONS, MOCK_EVENTS, SEVERITIES, type Event } from './app/mockEvents'

const SEVERITY_RANK = Object.fromEntries(SEVERITIES.map((s, i) => [s, i])) as Record<
  Event['severity'],
  number
>

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
    width: 140,
    filterOn: (r) => r.location,
    filterOptions: LOCATIONS,
  },
  {
    key: 'severity',
    label: 'Severity',
    accessor: (r) => r.severity,
    compare: (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
    width: 110,
    filterOn: (r) => r.severity,
    filterOptions: SEVERITIES,
  },
  {
    key: 'tags',
    label: 'Tags',
    accessor: (r) => r.tags.join(', '),
    filterOn: (r) => r.tags.join(' '),
  },
]

function App() {
  return (
    <Container size="xl" py="lg">
      <Stack gap="md">
        <Title order={1}>Events</Title>
        <DataGrid rows={MOCK_EVENTS} columns={columns} getRowId={(r) => r.id} />
      </Stack>
    </Container>
  )
}

export default App
