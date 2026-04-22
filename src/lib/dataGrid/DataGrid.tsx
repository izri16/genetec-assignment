import { Group, Pagination, Stack, Table, Text } from '@mantine/core'
import { usePagination } from './pagination'
import { useSort } from './sort'
import type { Column } from './common'
import { SortableHeader } from './sort'

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
  const { sortState, toggleSort, sortedRows } = useSort(rows, columns)
  const { page, pageRows, rangeEnd, rangeStart, setPage, totalPages } = usePagination(
    sortedRows,
    pageSize,
  )

  // Sort doesn't change row count, so the length-based reset in usePagination
  // won't fire. Reset explicitly so a sort change feels like a fresh view.
  const handleToggleSort = (key: string) => {
    toggleSort(key)
    setPage(1)
  }

  return (
    <Stack gap="sm">
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <SortableHeader
                key={col.key}
                column={col}
                sortState={sortState}
                onToggle={handleToggleSort}
              />
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
