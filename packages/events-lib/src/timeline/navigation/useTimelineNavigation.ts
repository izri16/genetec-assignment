import { useEffect, useState } from 'react'

export interface FocusPosition {
  dayIndex: number
  eventIndex: number
}

export interface NavDay {
  events: { length: number }
}

export interface NavContext {
  days: readonly NavDay[]
  page: number
  totalPages: number
}

export interface NavResult {
  focusPosition: FocusPosition
  page: number
}

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'

export function isArrowKey(key: string): key is ArrowKey {
  return key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight'
}

const eventsCount = (d: NavDay) => d.events.length

/**
 * Snap a focus position back into the valid range of the current days.
 * "Clamp" here = if the stored position is out of bounds, pull it to the
 * nearest in-bounds cell rather than leaving a dangling pointer.
 */
export function clampFocusPosition(pos: FocusPosition, days: readonly NavDay[]): FocusPosition {
  if (days.length === 0) return { dayIndex: 0, eventIndex: 0 }
  const dayIndex = Math.min(pos.dayIndex, days.length - 1)
  const day = days[dayIndex]
  if (eventsCount(day) === 0) return { dayIndex, eventIndex: 0 }
  const eventIndex = Math.min(pos.eventIndex, eventsCount(day) - 1)
  return { dayIndex, eventIndex }
}

/**
 * Pure reducer for arrow-key navigation. Returns the next focus (and target
 * page) or `null` to mean "we didn't handle this key — let it fall through
 * to the browser's default" (e.g. page scrolling).
 */
export function nextUnclampedFocusPosition(
  key: ArrowKey,
  pos: FocusPosition,
  ctx: NavContext,
): NavResult | null {
  const { days, page, totalPages } = ctx
  if (days.length === 0) return null
  const { dayIndex, eventIndex } = pos
  const day = days[dayIndex]
  if (!day) return null

  switch (key) {
    case 'ArrowDown':
      return eventIndex + 1 < eventsCount(day)
        ? { focusPosition: { dayIndex, eventIndex: eventIndex + 1 }, page }
        : null
    case 'ArrowUp':
      return eventIndex > 0
        ? { focusPosition: { dayIndex, eventIndex: eventIndex - 1 }, page }
        : null
    case 'ArrowRight':
      if (dayIndex + 1 < days.length)
        return { focusPosition: { dayIndex: dayIndex + 1, eventIndex }, page }
      if (page < totalPages) return { focusPosition: { dayIndex: 0, eventIndex }, page: page + 1 }
      return null
    case 'ArrowLeft':
      if (dayIndex > 0) return { focusPosition: { dayIndex: dayIndex - 1, eventIndex }, page }
      if (page > 1)
        return {
          focusPosition: { dayIndex: Number.MAX_SAFE_INTEGER, eventIndex },
          page: page - 1,
        }
      return null
  }
}

interface Params {
  days: readonly NavDay[]
  page: number
  totalPages: number
  setPage: (page: number) => void
}

export function useTimelineNavigation({ days, page, totalPages, setPage }: Params) {
  const [focusPosition, setFocusPosition] = useState<FocusPosition>({
    dayIndex: 0,
    eventIndex: 0,
  })
  const safeFocusPosition = clampFocusPosition(focusPosition, days)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isArrowKey(e.key)) return
      // Don't hijack keys from whatever is focused (form inputs, radio groups,
      // pagination buttons) — we preventDefault below, which would otherwise
      // kill the browser's native arrow behavior (caret move, radio switch…).
      if (document.activeElement && document.activeElement !== document.body) return
      const result = nextUnclampedFocusPosition(e.key, safeFocusPosition, {
        days,
        page,
        totalPages,
      })
      if (!result) return
      e.preventDefault()
      setPage(result.page)
      setFocusPosition(result.focusPosition)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [safeFocusPosition, days, page, totalPages, setPage])

  return { focusPosition: safeFocusPosition, setFocusPosition }
}
