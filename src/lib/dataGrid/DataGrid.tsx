import { Group, Pagination, Stack, Table, Text } from '@mantine/core'
import { type ReactNode } from 'react'
import { usePagination } from './pagination'

export interface Column<T> {
  key: string
  label: string
  accessor: (row: T) => ReactNode
}

export interface DataGridProps<T> {
  rows: readonly T[]
  columns: readonly Column<T>[]
  getRowId: (row: T) => string
  /** Rows per page. Defaults to 20. */
  pageSize?: number
}

const DEFAULT_PAGE_SIZE = 20

export function DataGrid<T>({
  rows,
  columns,
  getRowId,
  pageSize = DEFAULT_PAGE_SIZE,
}: DataGridProps<T>) {
  const { page, pageRows, rangeEnd, rangeStart, setPage, totalPages } = usePagination(
    rows,
    pageSize,
  )

  return (
    <Stack gap="sm">
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={col.key}>{col.label}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pageRows.map((row) => (
            <Table.Tr key={getRowId(row)}>
              {columns.map((col) => (
                <Table.Td key={col.key}>{col.accessor(row)}</Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          {rows.length === 0 ? 'No rows' : `Showing ${rangeStart}–${rangeEnd} of ${rows.length}`}
        </Text>
        <Pagination value={page} onChange={setPage} total={totalPages} size="sm" withEdges />
      </Group>
    </Stack>
  )
}
