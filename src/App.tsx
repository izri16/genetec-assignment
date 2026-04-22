import { Container, Stack, Title } from '@mantine/core'
import { DataGrid, type Column } from './lib'
import { MOCK_EVENTS, type Event } from './app/mockEvents'

const columns: Column<Event>[] = [
  { key: 'id', label: 'ID', accessor: (r) => r.id },
  {
    key: 'createdAt',
    label: 'Created',
    accessor: (r) => new Date(r.createdAt).toLocaleString(),
  },
  { key: 'name', label: 'Name', accessor: (r) => r.name },
  { key: 'location', label: 'Location', accessor: (r) => r.location },
  { key: 'severity', label: 'Severity', accessor: (r) => r.severity },
  { key: 'tags', label: 'Tags', accessor: (r) => r.tags.join(', ') },
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
