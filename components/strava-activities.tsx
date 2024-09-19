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
import { getStravaActivities } from '@/app/actions'
import { useEffect, useState } from 'react'
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
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
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

export default function StravaActivities() {
  const [isLoading, setIsLoading] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [averageCadence, setAverageCadence] = useState<string | undefined>(
    undefined
  )

  const fetchActivities = async () => {
    setIsLoading(true)
    const latestActivities = await getStravaActivities(30)
    if (latestActivities) {
      setActivities(latestActivities)
      setIsLoading(false)
    }
  }

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows
    const cadenceValues = selectedRows.map(
      (row) => row.getValue('average_cadence') as number
    )

    const totalSum = cadenceValues.reduce(
      (sum: number, value: number) => sum + value,
      0
    )

    const averageCadence =
      cadenceValues.length > 0 ? totalSum / cadenceValues.length : 0

    setAverageCadence(averageCadence.toFixed(2))
  }, [rowSelection])

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

  return (
    <div>
      {activities.length === 0 && !isLoading && (
        <Button onClick={fetchActivities}>Get latest Strava activities</Button>
      )}
      {isLoading ? (
        <div>Loading recent activities...</div>
      ) : (
        activities.length > 0 && (
          <>
            <div>Activities</div>
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
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )
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
                        Geen resultaten gevonden.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div>Average Cadence: {averageCadence}</div>
          </>
        )
      )}
    </div>
  )
}
