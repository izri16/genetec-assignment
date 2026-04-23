import { Alert, Box, Button, Group, LoadingOverlay, Modal, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react'
import { useRef } from 'react'
import { FieldInput } from './FieldInput'
import type { FormField } from './fields'
import { useAsyncSubmit } from './useAsyncSubmit'
import { buildValidators } from './validators'

export interface UpsertEventFormProps<T> {
  onClose: () => void
  title: string
  fields: readonly FormField<T>[]
  initialValues: T
  onSave: (values: T) => void | Promise<void>
  successMessage?: string
  isEditing?: boolean
}

export function UpsertEventForm<T extends Record<string, unknown>>({
  onClose,
  title,
  fields,
  initialValues,
  onSave,
  successMessage = 'Saved',
  isEditing = false,
}: UpsertEventFormProps<T>) {
  const form = useForm<T>({
    initialValues,
    validate: buildValidators(fields),
  })
  const unchanged = isEditing && !form.isDirty()
  const { submit, submitting, saved, error: submitError } = useAsyncSubmit<T>(onSave)
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleSubmit = form.onSubmit(
    (values) => submit(values as T),
    // eslint-disable-next-line react-hooks/refs -- runs on submit event, not render
    (errors) => {
      // Focus the first invalid field in declaration order.
      const firstInvalid = fields.find((f) => errors[f.key])?.key
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus()
    },
  )

  return (
    <Modal
      opened
      onClose={onClose}
      title={title}
      centered
      trapFocus
      returnFocus
      closeOnClickOutside={false}
    >
      {saved ? (
        <Stack gap="sm">
          <Alert color="green" icon={<IconCheck size={16} />} role="status">
            {successMessage}
          </Alert>
          <Group justify="flex-end" mt="sm">
            <Button onClick={onClose} autoFocus>
              Close
            </Button>
          </Group>
        </Stack>
      ) : (
        <Box pos="relative">
          <LoadingOverlay
            visible={submitting}
            zIndex={1}
            overlayProps={{ backgroundOpacity: 0.15 }}
            loaderProps={{ size: 'sm' }}
          />
          <form onSubmit={handleSubmit} noValidate>
            <Stack gap="sm">
              {fields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  inputProps={form.getInputProps(field.key)}
                  inputRef={(el) => {
                    fieldRefs.current[field.key] = el
                  }}
                />
              ))}
              {submitError && (
                <Alert color="red" icon={<IconAlertTriangle size={16} />} role="alert">
                  {submitError}
                </Alert>
              )}
              <Group justify="flex-end" mt="sm">
                <Button variant="default" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button type="submit" loading={submitting} disabled={unchanged}>
                  {submitError ? 'Retry' : 'Save'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Box>
      )}
    </Modal>
  )
}
