import { Box, Group, Text, Title } from '@mantine/core'
import { IconActivity } from '@tabler/icons-react'
import classes from './AppHeader.module.css'

interface AppHeaderProps {
  title: string
  badge?: string
}

export function AppHeader({ title, badge }: AppHeaderProps) {
  return (
    <Group gap="sm" align="center">
      <Box className={classes.logo}>
        <IconActivity size={20} stroke={2.2} />
      </Box>
      <Title order={2} lh={1}>
        {title}
      </Title>
      {badge && (
        <Text
          size="xs"
          c="dimmed"
          fw={600}
          tt="uppercase"
          lh={1}
          className={classes.badge}
          style={{ alignSelf: 'center' }}
        >
          {badge}
        </Text>
      )}
    </Group>
  )
}
