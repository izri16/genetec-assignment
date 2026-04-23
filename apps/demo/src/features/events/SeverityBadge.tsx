import { Badge } from '@mantine/core'
import { severityLabel } from './common'

const SEVERITY_STYLE = [
  { color: 'green.8', variant: 'filled' },
  { color: 'yellow.8', variant: 'filled' },
  { color: 'orange.8', variant: 'filled' },
  { color: 'red.8', variant: 'filled' },
] as const

interface Props {
  severity: number
}

export function SeverityBadge({ severity }: Props) {
  const style = SEVERITY_STYLE[severity]
  return (
    <Badge size="xs" radius="sm" color={style.color} variant={style.variant}>
      {severityLabel(severity)}
    </Badge>
  )
}
