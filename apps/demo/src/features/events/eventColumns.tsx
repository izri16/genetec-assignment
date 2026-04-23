import type { Column } from 'events-lib'
import { LOCATIONS, SEVERITY_LABELS, severityLabel, type Event } from './common'
import { SeverityBadge } from './SeverityBadge'

// Case-insensitive, deterministic string compare. Not locale-aware.
const byString =
  <T,>(get: (row: T) => string) =>
  (a: T, b: T) => {
    const x = get(a).toLowerCase()
    const y = get(b).toLowerCase()
    return x < y ? -1 : x > y ? 1 : 0
  }

export const eventColumns: Column<Event>[] = [
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
    accessor: (r) => <SeverityBadge severity={r.severity} />,
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
