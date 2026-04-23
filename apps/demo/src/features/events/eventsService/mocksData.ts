import { addHours, subDays } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { LOCATIONS, SEVERITY_LABELS, TAG_POOL, type Category, type Event } from '../common'

const NAMES_BY_CATEGORY = {
  access: [
    'Door forced open',
    'Access denied',
    'Tailgating detected',
    'Badge read',
    'Credential expired',
    'Visitor checked in',
    'Cardholder added',
    'Access granted',
  ],
  video: [
    'Camera offline',
    'Motion in restricted zone',
    'Video feed lost',
    'Object detected',
    'PTZ preset recalled',
    'Archive rotation completed',
    'Stream buffering',
    'Tamper alert',
  ],
} as const

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

export function generateMockEvents(count: number, names: readonly string[]): Event[] {
  const anchor = new Date('2026-04-22T12:00:00Z')

  return Array.from({ length: count }, (_, i) => {
    const createdAt = addHours(subDays(anchor, i % 45), i % 24).toISOString()

    return {
      id: uuidv4(),
      createdAt,
      name: pick(names, i),
      location: pick(LOCATIONS, i),
      severity: i % SEVERITY_LABELS.length,
      tags: pickTags(i),
    }
  })
}

export const SEED_EVENTS: Record<Category, Event[]> = {
  access: generateMockEvents(120, NAMES_BY_CATEGORY.access),
  video: generateMockEvents(80, NAMES_BY_CATEGORY.video),
  alarms: [],
  network: [],
}
