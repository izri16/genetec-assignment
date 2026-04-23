import type { FormRulesRecord } from '@mantine/form'
import type { FormField } from './fields'

export function isEmpty(v: unknown): boolean {
  if (v == null) return true
  if (typeof v === 'string') return v.trim() === ''
  if (Array.isArray(v)) return v.length === 0
  return false
}

/**
 * Translates our FormField schema (required + optional custom validate) into
 * the rules object expected by @mantine/form's useForm.
 */
export function buildValidators<T>(fields: readonly FormField<T>[]): FormRulesRecord<T> {
  const rules: Record<string, (value: unknown, values: T) => string | null> = {}
  for (const field of fields) {
    rules[field.key] = (value, values) => {
      if (field.required && isEmpty(value)) return `${field.label} is required`
      if (field.validate) return field.validate(value as T[keyof T], values)
      return null
    }
  }
  return rules as FormRulesRecord<T>
}
