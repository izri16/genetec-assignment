import { useState } from 'react'

export interface UseAsyncSubmitResult<T> {
  submit: (values: T) => Promise<void>
  submitting: boolean
  saved: boolean
  error: string | null
  reset: () => void
}

/**
 * Wraps an async save action with the boilerplate a form needs: a
 * submitting flag (for loading UI), a saved flag (for success UI), and an
 * error message captured from rejections.
 */
export function useAsyncSubmit<T>(
  action: (values: T) => void | Promise<void>,
): UseAsyncSubmitResult<T> {
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (values: T) => {
    try {
      setSubmitting(true)
      setError(null)
      await action(values)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setSaved(false)
    setError(null)
  }

  return { submit, submitting, saved, error, reset }
}
