import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import type { FormField } from 'events-lib'
import {
  LOCATIONS,
  SEVERITY_LABELS,
  TAG_POOL,
  severityLabel,
  type Event,
  type SeverityLabel,
} from './common'

export interface EventFormValues extends Record<string, unknown> {
  name: string
  description: string
  createdAt: string
  location: string
  severity: string
  tags: string[]
}

const toDatetimeLocal = (iso: string) => format(new Date(iso), "yyyy-MM-dd'T'HH:mm")

export const emptyEventForm = (): EventFormValues => ({
  name: '',
  description: '',
  createdAt: toDatetimeLocal(new Date().toISOString()),
  location: '',
  severity: '',
  tags: [],
})

export const eventToForm = (e: Event): EventFormValues => ({
  name: e.name,
  description: e.description,
  createdAt: toDatetimeLocal(e.createdAt),
  location: e.location,
  severity: severityLabel(e.severity),
  tags: e.tags,
})

export const formToEvent = (values: EventFormValues, id?: string): Event => ({
  id: id ?? uuidv4(),
  name: values.name.trim(),
  description: values.description.trim(),
  createdAt: new Date(values.createdAt).toISOString(),
  location: values.location,
  severity: SEVERITY_LABELS.indexOf(values.severity as SeverityLabel),
  tags: values.tags,
})

export const eventFormFields: FormField<EventFormValues>[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'e.g. Door forced open',
  },
  {
    key: 'description',
    label: 'Description',
    type: 'text',
    required: true,
    placeholder: 'Short summary of what happened',
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
