import { describe, expect, it } from 'vitest'
import {
  clampFocusPosition,
  nextUnclampedFocusPosition,
  type NavDay,
} from './useTimelineNavigation'

const daysRange = (...sizes: number[]): NavDay[] =>
  sizes.map((n) => ({ events: Array.from({ length: n }, (_, i) => i) }))

describe('clampFocusPosition', () => {
  it('collapses to {0,0} when there are no days', () => {
    expect(clampFocusPosition({ dayIndex: 5, eventIndex: 3 }, [])).toEqual({
      dayIndex: 0,
      eventIndex: 0,
    })
  })

  it('clamps a day past the last column onto the last column', () => {
    const days = daysRange(2, 3)
    expect(clampFocusPosition({ dayIndex: 9, eventIndex: 1 }, days)).toEqual({
      dayIndex: 1,
      eventIndex: 1,
    })
  })

  it('clamps an event past the last event onto the last event', () => {
    const days = daysRange(2, 5)
    expect(clampFocusPosition({ dayIndex: 0, eventIndex: 9 }, days)).toEqual({
      dayIndex: 0,
      eventIndex: 1,
    })
  })

  it('handles an empty day column', () => {
    expect(clampFocusPosition({ dayIndex: 0, eventIndex: 3 }, daysRange(0))).toEqual({
      dayIndex: 0,
      eventIndex: 0,
    })
  })
})

describe('nextUnclampedFocusPosition', () => {
  const days = daysRange(3, 2, 4) // day0=3 events, day1=2 events, day2=4 events
  const ctx = { days, page: 1, totalPages: 1 }

  it('moves down within a column and stops at the bottom', () => {
    expect(nextUnclampedFocusPosition('ArrowDown', { dayIndex: 0, eventIndex: 0 }, ctx)).toEqual({
      focusPosition: { dayIndex: 0, eventIndex: 1 },
      page: 1,
    })
    expect(nextUnclampedFocusPosition('ArrowDown', { dayIndex: 0, eventIndex: 2 }, ctx)).toBeNull()
  })

  it('moves up within a column and stops at the top', () => {
    expect(nextUnclampedFocusPosition('ArrowUp', { dayIndex: 2, eventIndex: 2 }, ctx)).toEqual({
      focusPosition: { dayIndex: 2, eventIndex: 1 },
      page: 1,
    })
    expect(nextUnclampedFocusPosition('ArrowUp', { dayIndex: 2, eventIndex: 0 }, ctx)).toBeNull()
  })

  it('moves right across columns', () => {
    expect(nextUnclampedFocusPosition('ArrowRight', { dayIndex: 0, eventIndex: 1 }, ctx)).toEqual({
      focusPosition: { dayIndex: 1, eventIndex: 1 },
      page: 1,
    })
  })

  it('moves to the older page when ArrowRight passes the rightmost column', () => {
    // Moving right travels into the past → page + 1.
    const result = nextUnclampedFocusPosition(
      'ArrowRight',
      { dayIndex: 2, eventIndex: 1 },
      { days, page: 1, totalPages: 3 },
    )
    expect(result).toEqual({ focusPosition: { dayIndex: 0, eventIndex: 1 }, page: 2 })
  })

  it('returns null at the rightmost column of the oldest page', () => {
    expect(
      nextUnclampedFocusPosition(
        'ArrowRight',
        { dayIndex: 2, eventIndex: 0 },
        { days, page: 3, totalPages: 3 },
      ),
    ).toBeNull()
  })

  it('moves left across columns', () => {
    expect(nextUnclampedFocusPosition('ArrowLeft', { dayIndex: 2, eventIndex: 0 }, ctx)).toEqual({
      focusPosition: { dayIndex: 1, eventIndex: 0 },
      page: 1,
    })
  })

  it('moves to the newer page when ArrowLeft passes the leftmost column', () => {
    const result = nextUnclampedFocusPosition(
      'ArrowLeft',
      { dayIndex: 0, eventIndex: 1 },
      { days, page: 2, totalPages: 3 },
    )
    expect(result?.page).toBe(1)
    // Caller is expected to clamp the out-of-range day via clampFocusPosition.
    expect(result?.focusPosition.dayIndex).toBe(Number.MAX_SAFE_INTEGER)
    expect(result?.focusPosition.eventIndex).toBe(1)
  })

  it('returns null at the leftmost column of the newest page', () => {
    expect(
      nextUnclampedFocusPosition(
        'ArrowLeft',
        { dayIndex: 0, eventIndex: 0 },
        { days, page: 1, totalPages: 3 },
      ),
    ).toBeNull()
  })
})
