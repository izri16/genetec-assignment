import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  Pagination,
  Stack,
  Table,
  Text,
} from '@mantine/core'
import type { ReactNode } from 'react'
import { usePagination } from './pagination'
import { useSort, SortableHeader } from './sort'
import { FilterPopover, useFilters } from './filter'
import { ColumnVisibilityMenu, useColumnVisibility } from './columnVisibility'
import type { Column } from './common'

export interface DataGridProps<T> {
  rows: readonly T[]
  columns: readonly Column<T>[]
  getRowId: (row: T) => string
  /** Rows per page. Defaults to 20. */
  pageSize?: number
  /**
   * When true, dims the table and shows a spinner overlay. If there are no
   * rows yet (initial load), the body shows a loading fallbackContent instead.
   */
  loading?: boolean
  error?: ReactNode
  noRowsElement?: ReactNode
}

const DEFAULT_PAGE_SIZE = 20

export function DataGrid<T>({
  rows,
  columns,
  getRowId,
  pageSize = DEFAULT_PAGE_SIZE,
  loading = false,
  error,
  noRowsElement,
}: DataGridProps<T>) {
  const { visibleColumns, isColumnVisible, toggleColumnVisibility } = useColumnVisibility(columns)
  const { filters, setFilter, clearAllFilters, filteredRows, hasActiveFilters } = useFilters(
    rows,
    visibleColumns,
  )
  const { sortState, toggleSort, sortedRows } = useSort(filteredRows, visibleColumns)
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

  // Error wins over loading (something went wrong, don't pretend otherwise).
  // With no rows to show we replace the body with a fallbackContent; with rows
  // we keep them and rely on the overlay for the loading signal.
  const bodyState: 'error' | 'loading' | 'empty' | 'ready' = error
    ? 'error'
    : pageRows.length === 0
      ? loading
        ? 'loading'
        : 'empty'
      : 'ready'

  const fallbackContent =
    bodyState === 'loading' ? (
      <Center py="xl">
        <Loader size="sm" />
      </Center>
    ) : bodyState === 'error' ? (
      <Center py="xl" c="red">
        {error}
      </Center>
    ) : bodyState === 'empty' ? (
      <Center py="xl">
        <Text c="dimmed">{noRowsElement ?? 'No rows'}</Text>
      </Center>
    ) : null

  return (
    <Stack gap="sm">
      <Group justify="flex-end" gap="xs">
        {hasActiveFilters && (
          <Button variant="subtle" size="xs" onClick={clearAllFilters}>
            Clear all filters
          </Button>
        )}
        <ColumnVisibilityMenu
          columns={columns}
          isColumnVisible={isColumnVisible}
          onToggleColumn={toggleColumnVisibility}
        />
      </Group>
      <Box pos="relative">
        <LoadingOverlay
          visible={loading && bodyState === 'ready'}
          zIndex={1}
          overlayProps={{ backgroundOpacity: 0.15 }}
          loaderProps={{ size: 'sm' }}
        />
        <Table striped highlightOnHover withTableBorder withColumnBorders layout="fixed">
          <colgroup>
            {visibleColumns.map((col) => (
              <col key={col.key} style={col.width != null ? { width: col.width } : undefined} />
            ))}
          </colgroup>
          <Table.Thead>
            <Table.Tr>
              {visibleColumns.map((col) => (
                <SortableHeader
                  key={col.key}
                  column={col}
                  sortState={sortState}
                  onToggleSort={handleToggleSort}
                  endSlot={
                    col.filterOn ? (
                      <FilterPopover
                        column={col}
                        value={filters[col.key] ?? ''}
                        onChange={(v) => setFilter(col.key, v)}
                      />
                    ) : null
                  }
                />
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {bodyState === 'ready' ? (
              pageRows.map((row) => (
                <Table.Tr key={getRowId(row)}>
                  {visibleColumns.map((col) => (
                    <Table.Td
                      key={col.key}
                      style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {col.accessor(row)}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={Math.max(visibleColumns.length, 1)}>{fallbackContent}</Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>
      {bodyState === 'ready' && (
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {`Showing ${rangeStart}–${rangeEnd} of ${sortedRows.length}`}
          </Text>
          <Pagination value={page} onChange={setPage} total={totalPages} size="sm" withEdges />
        </Group>
      )}
    </Stack>
  )
}
