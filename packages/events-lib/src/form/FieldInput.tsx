import { MultiSelect, Select, Textarea, TextInput } from '@mantine/core'
import type { GetInputPropsReturnType } from '@mantine/form'
import type { FormField } from './fields'

interface FieldInputProps<T> {
  field: FormField<T>
  inputProps: GetInputPropsReturnType
}

export function FieldInput<T>({ field, inputProps }: FieldInputProps<T>) {
  const label = field.required ? (
    field.label
  ) : (
    <>
      {field.label} <span style={{ color: 'var(--mantine-color-dimmed)' }}>(optional)</span>
    </>
  )
  const common = {
    label,
    placeholder: field.placeholder,
    name: field.key,
  }

  switch (field.type) {
    case 'text':
      return <TextInput {...common} {...inputProps} />
    case 'textarea':
      return <Textarea {...common} {...inputProps} />
    case 'datetime':
      return <TextInput {...common} type="datetime-local" {...inputProps} />
    case 'select':
      return <Select {...common} data={[...field.options]} {...inputProps} />
    case 'multiselect':
      return <MultiSelect {...common} data={[...field.options]} {...inputProps} />
  }
}
