import { type Category, type Event } from '../common'
import * as serverMemory from './serverMemory'

// Each category simulates a different backend characteristic so the grid
// exercises all of its states (fast / slow / error / empty) from real user
// actions instead of artificial toggle buttons.
const CATEGORY_DELAYS: Record<Category, number> = {
  access: 300,
  video: 2000,
  alarms: 800,
  network: 300,
}

export function fetchEvents(category: Category): Promise<Event[]> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (category === 'alarms') {
        reject(new Error('Failed to load events. Please try again.'))
        return
      }
      resolve(serverMemory.list(category))
    }, CATEGORY_DELAYS[category])
  })
}

// Simulated save endpoint: 500ms latency, every 4th call fails so the form
// can exercise its error branch without flaky determinism.
let saveCallCount = 0

export async function upsertEvent(
  category: Category,
  event: Event,
  isEdit: boolean,
): Promise<Event> {
  await new Promise((r) => window.setTimeout(r, 500))
  saveCallCount++
  if (saveCallCount % 4 === 0) {
    throw new Error('Save failed. Please try again.')
  }
  return serverMemory.upsert(category, event, isEdit)
}
