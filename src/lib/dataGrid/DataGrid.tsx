import { Table } from '@mantine/core'
import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  label: string
  accessor: (row: T) => ReactNode
}

export interface DataGridProps<T> {
  rows: readonly T[]
  columns: readonly Column<T>[]
  getRowId: (row: T) => string
}

/**
 * Minimal row-renderer. Sorting, filtering, pagination, column show/hide,
 * and loading/empty/error states will be layered on in later passes.
 */
export function DataGrid<T>({ rows, columns, getRowId }: DataGridProps<T>) {
  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          {columns.map((col) => (
            <Table.Th key={col.key}>{col.label}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.map((row) => (
          <Table.Tr key={getRowId(row)}>
            {columns.map((col) => (
              <Table.Td key={col.key}>{col.accessor(row)}</Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
