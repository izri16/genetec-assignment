import { Box, Container, Stack } from '@mantine/core'
import type { ReactNode } from 'react'
import classes from './PageLayout.module.css'

interface PageLayoutProps {
  header: ReactNode
  toolbar?: ReactNode
  children: ReactNode
}

// Full-viewport-height page: header + toolbar pinned at top, children fill
// the remaining space. The content area is flex so the grid/timeline inside
// can stretch and manage its own overflow.
export function PageLayout({ header, toolbar, children }: PageLayoutProps) {
  return (
    <Container size="xl" py="lg" className={classes.root}>
      <Stack gap={0} className={classes.body}>
        {header}
        {toolbar && <Box mt="xl">{toolbar}</Box>}
        <Box component="main" className={classes.content} mt="sm">
          {children}
        </Box>
      </Stack>
    </Container>
  )
}
