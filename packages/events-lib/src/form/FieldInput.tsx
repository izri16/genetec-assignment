import { MultiSelect, Select, Textarea, TextInput } from '@mantine/core'
import type { GetInputPropsReturnType } from '@mantine/form'
import type { Ref } from 'react'
import type { FormField } from './fields'
import classes from './FieldInput.module.css'

interface FieldInputProps<T> {
  field: FormField<T>
  inputProps: GetInputPropsReturnType
  // Forwarded to the underlying focusable element so the form can focus the
  // first invalid field without resorting to a DOM query.
  inputRef?: Ref<HTMLInputElement>
}

export function FieldInput<T>({ field, inputProps, inputRef }: FieldInputProps<T>) {
  const label = field.required ? (
    field.label
  ) : (
    <>
      {field.label} <span className={classes.optional}>(optional)</span>
    </>
  )
  const common = {
    label,
    placeholder: field.placeholder,
    name: field.key,
    autoComplete: 'off',
  }

  switch (field.type) {
    case 'text':
      return <TextInput {...common} {...inputProps} ref={inputRef} />
    case 'textarea':
      return <Textarea {...common} {...inputProps} ref={inputRef as Ref<HTMLTextAreaElement>} />
    case 'datetime':
      return <TextInput {...common} type="datetime-local" {...inputProps} ref={inputRef} />
    case 'select':
      return <Select {...common} data={[...field.options]} {...inputProps} ref={inputRef} />
    case 'multiselect':
      return <MultiSelect {...common} data={[...field.options]} {...inputProps} ref={inputRef} />
  }
}
