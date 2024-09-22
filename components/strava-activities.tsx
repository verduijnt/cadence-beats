'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Activity } from '@/interfaces/activities'
import { Button } from './ui/button'
import {
  LucideChevronsUpDown,
  LucideChevronDown,
  LucideChevronUp,
} from 'lucide-react'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { formatDistance, formatTime } from '@/utils/utils'
import { useEffect, useState } from 'react'

export const columns: ColumnDef<Activity>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div
          className='flex cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          {column.getIsSorted() === 'asc' ? (
            <LucideChevronDown className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <LucideChevronUp className='ml-2 h-4 w-4' />
          ) : (
            <LucideChevronsUpDown className='ml-2 h-4 w-4' />
          )}
        </div>
      )
    },
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <div>{row.getValue('type')}</div>,
  },
  {
    accessorKey: 'average_cadence',
    header: ({ column }) => {
      return (
        <div
          className='flex cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() != 'desc')}
        >
          Average Cadence
          {column.getIsSorted() === 'asc' ? (
            <LucideChevronDown className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <LucideChevronUp className='ml-2 h-4 w-4' />
          ) : (
            <LucideChevronsUpDown className='ml-2 h-4 w-4' />
          )}
        </div>
      )
    },
    cell: ({ row }) => <div>{row.getValue('average_cadence')}</div>,
  },
  {
    accessorKey: 'distance',
    header: 'Distance (in km)',
    cell: ({ row }) => <div>{formatDistance(row.getValue('distance'))}</div>,
  },
  {
    accessorKey: 'moving_time',
    header: 'Moving Time',
    cell: ({ row }) => <div>{formatTime(row.getValue('moving_time'))}</div>,
  },
  {
    accessorKey: 'elapsed_time',
    header: 'Elapsed Time',
    cell: ({ row }) => <div>{formatTime(row.getValue('elapsed_time'))}</div>,
  },
]

export default function StravaActivities({
  activities,
  selectedActivities,
  setSelectedActivities,
}: {
  activities: Activity[] | undefined
  selectedActivities: Activity[]
  setSelectedActivities: (data: Activity[]) => void
}) {
  if (!activities) {
    return <div>No activities</div>
  }

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: activities,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 30, //custom default page size
      },
    },
  })

  useEffect(() => {
    const selectedRowModel = table.getSelectedRowModel()
    const selectedRowsData = selectedRowModel.rows.map((row) => row.original)

    setSelectedActivities(selectedRowsData)
  }, [rowSelection])

  return (
    <div>
      <div className='flex items-center py-4'>
        <Select
          onValueChange={(value) => {
            table
              .getColumn('type')
              ?.setFilterValue(value === 'all' ? '' : value)
          }}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select a type' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Types</SelectLabel>
              <SelectItem value='all'>All</SelectItem>
              {activities
                .map((item) => item.type)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {item}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
