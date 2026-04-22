import { addHours, subDays } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import type { Event as _Event } from '../lib'

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

const NAME_PREFIXES = [
  'Door forced open',
  'Access denied',
  'Tailgating detected',
  'Badge read',
  'Camera offline',
  'Motion in restricted zone',
  'Alarm acknowledged',
  'Credential expired',
  'Network latency spike',
  'Firmware update applied',
]

const TAG_POOL = ['access', 'video', 'network', 'badge', 'alarm', 'maintenance', 'audit']

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length]
}

function pickTags(seed: number): string[] {
  // 1–3 tags per event, no duplicates.
  const tagsCount = (seed % 3) + 1
  const result = new Set<string>()
  for (let i = 0; i < tagsCount; i++) {
    result.add(pick(TAG_POOL, seed + i * 3))
  }
  return [...result]
}

export function generateMockEvents(count: number): Event[] {
  const anchor = new Date('2026-04-22T12:00:00Z')

  return Array.from({ length: count }, (_, i) => {
    const createdAt = addHours(subDays(anchor, i % 45), i % 24).toISOString()

    return {
      id: uuidv4(),
      createdAt,
      name: `${pick(NAME_PREFIXES, i)} #${i + 1}`,
      location: pick(LOCATIONS, i),
      severity: i % SEVERITY_LABELS.length,
      tags: pickTags(i),
    }
  })
}

export const MOCK_EVENTS: Event[] = generateMockEvents(250)
