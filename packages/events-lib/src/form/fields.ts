interface BaseFormField<T> {
  key: keyof T & string
  label: string
  required?: boolean
  placeholder?: string
  /**
   * Custom validator, runs after the required check. Return an error message
   * to flag the field, or null when valid.
   */
  validate?: (value: T[keyof T], values: T) => string | null
}

interface TextFormField<T> extends BaseFormField<T> {
  type: 'text' | 'textarea' | 'datetime'
}

interface ChoiceFormField<T> extends BaseFormField<T> {
  type: 'select' | 'multiselect'
  options: readonly string[]
}

export type FormField<T> = TextFormField<T> | ChoiceFormField<T>
