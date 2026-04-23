import type { Event as _Event } from 'events-lib'

/**
 * Mock dataset used to drive the demo. Lives in the app layer (not the lib)
 * because it carries app-specific domain fields (location, severity, tags)
 * on top of the core Event contract.
 *
 * Deterministic: we seed from a simple counter so rows are stable across
 * reloads — easier to eyeball sort/filter behavior during development.
 */
// Stored as an ordinal so sorting is just numeric compare. Labels live at the presentation layer.
export const SEVERITY_LABELS = ['low', 'medium', 'high', 'critical'] as const
export type SeverityLabel = (typeof SEVERITY_LABELS)[number]

export interface Event extends _Event {
  description: string
  location: string
  severity: number
  tags: string[]
}

export const severityLabel = (s: number): SeverityLabel => SEVERITY_LABELS[s]

export const LOCATIONS = [
  'Montreal HQ',
  'Toronto Office',
  'Vancouver Lab',
  'Ottawa DC',
  'Calgary Site',
  'Quebec City',
] as const

export const TAG_POOL = [
  'access',
  'video',
  'network',
  'badge',
  'alarm',
  'maintenance',
  'audit',
] as const

export const CATEGORIES = ['access', 'video', 'alarms', 'network'] as const
export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  access: 'Access',
  video: 'Video',
  alarms: 'Alarms',
  network: 'Network',
}
