"use client"

import { useState, useEffect, useMemo } from "react"

// next
import { useParams, useRouter } from "next/navigation"

// components
import CustomLoader from "@/components/custom/customLoader"
import CustomModal from "@/components/custom/customModal/customModal"
import CustomTableHeader from "@/components/custom/customTable/CustomTableHeader"
import { CustomTableToolBar } from "@/components/custom/customTable/CustomTableToolBar"
import { CustomTablePagination } from "@/components/custom/customTable/CustomTablePagination"

// shad
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// icons
import { CornerDownRight, CornerLeftDown, Trash, Pen, Eye, SquareX } from "lucide-react"

// axios
import { apiClient } from "@/utils/interseptor"

// query
import { useQuery, keepPreviousData } from '@tanstack/react-query'

// table
import {
    ColumnDef, flexRender, getCoreRowModel, useReactTable,
    getPaginationRowModel,
    SortingState, getSortedRowModel,
    ColumnFiltersState, getFilteredRowModel,
    getGroupedRowModel, getExpandedRowModel
} from "@tanstack/react-table"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface filterFieldsProps {
    type: string;
    label: string;
    field: string;
    options?: { select_value: string; select_title: string; }[]
    url?: string;
}

interface CustomTableProps<T> {

    // relations
    tableName: string;

    // get data
    url: string;
    urlParams?: string;

    // colums
    columns: ColumnDef<T>[]

    // filter
    isFilter?: boolean;

    // crud
    crud?: { read: boolean; update: boolean; delete: boolean; }

    // settings
    settings?: { create: boolean; import: boolean; export: boolean; filter: boolean; }

    filterFields?: filterFieldsProps[]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function CustomTable<T>({
    url,
    tableName,
    urlParams = "",
    columns,
    isFilter = false,
    crud = { read: true, update: true, delete: true },
    settings = { create: true, import: true, export: true, filter: true },
    filterFields = []
}: CustomTableProps<T>) {

    // storage
    const initialValues = {
        search: [],
        pagination: { pageIndex: 0, pageSize: isFilter ? 10 : 50 },
        grouping: [],
        pinning: { left: [], right: [] },
        colums: {},
        sorting: []
    }
    const storage = localStorage.getItem(tableName)
    const [storageExists, setStorageExists] = useState(localStorage.getItem(tableName) !== JSON.stringify(initialValues))
    const storedData = storage ? JSON.parse(storage) : initialValues

    // params and router
    const params = useParams()
    const router = useRouter()

    // modal delete
    const [dialogDelete, setDialogDelete] = useState({ open: false, id: '' })

    // pagination
    const [pagination, setPagination] = useState(storedData.pagination)

    // sorting
    const [sorting, setSorting] = useState<SortingState>(storedData.sorting)

    // fixed columns
    const [columnPinning, setColumnPinning] = useState(storedData.pinning)

    // search
    const [globalFilter, setGlobalFilter] = useState<ColumnFiltersState>([])

    // grouping
    const [grouping, setGrouping] = useState<string[]>(storedData.grouping)

    // visibility
    const [columnVisibility, setColumnVisibility] = useState(storedData.colums)

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // localstorage
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const resetLocalStorage = () => {
        if (tableName) localStorage.setItem(tableName, JSON.stringify(initialValues))
        setGlobalFilter(initialValues.search)
        setPagination(initialValues.pagination)
        setGrouping(initialValues.grouping)
        setColumnPinning(initialValues.pinning)
        setColumnVisibility(initialValues.colums)
        setSorting(initialValues.sorting)
        setStorageExists(false)
    }

    useEffect(() => {
        if (tableName) {
            const filter_values = JSON.stringify({
                search: globalFilter,
                pagination: pagination,
                grouping: grouping,
                pinning: columnPinning,
                colums: columnVisibility,
                sorting: sorting
            })
            localStorage.setItem(tableName, filter_values)
            setStorageExists(filter_values !== JSON.stringify(initialValues))
        }
    }, [globalFilter, pagination, grouping, columnPinning, columnVisibility, sorting, tableName, initialValues])

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // filter
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //TODO

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // params
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const dataParams = useMemo(() => ({
        urlParams: urlParams,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        order: sorting,
        search: globalFilter
    }), [pagination, urlParams, sorting, globalFilter])

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // get
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const fetchData = async () => {
        const res = await apiClient.get(url, { params: dataParams })
        return res.data
    }

    // data
    const { data, isLoading } = useQuery({
        queryKey: [tableName, url, dataParams],
        queryFn: async () => fetchData(),
        placeholderData: keepPreviousData,
        staleTime: 1000
    })

    // total elements
    const rowCount = useMemo(() => data?.total_count ?? 0, [data])

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // table
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const table = useReactTable({

        // init
        data: data?.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),

        // pagination
        manualPagination: true,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,

        // sorting
        manualSorting: true,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,

        // filtering (search)
        manualFiltering: true,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,

        // pinning
        onColumnPinningChange: setColumnPinning,

        // visibility
        onColumnVisibilityChange: setColumnVisibility,

        // grouping
        // manualGrouping: true,
        getGroupedRowModel: getGroupedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onGroupingChange: setGrouping,

        // resize
        columnResizeMode: 'onChange',
        columnResizeDirection: 'ltr',
        defaultColumn: { minSize: 250, maxSize: 1200 },

        // total elements
        rowCount,

        // state
        state: { pagination, sorting, globalFilter, columnPinning, grouping, columnVisibility }
    })

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // export
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const exportFunction = async () => {
        const dataexport = { urlParams: urlParams, nopagination: true, order: sorting, search: globalFilter }
        const res = await apiClient.get(url, { params: dataexport })
        return res.data.data
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // delete
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const deleteRow = (id: number | string) => {
        console.log(id)
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // code
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    return (
        <>
            {/* toolbar */}
            <div className="mb-4">
                <CustomTableToolBar<T>
                    table={table}
                    isFilter={isFilter}
                    grouping={grouping}
                    settings={settings}
                    storage={{ exist: storageExists, reset: resetLocalStorage }}
                    exportData={() => exportFunction()}
                    filterFields={filterFields}
                />
            </div>

            {/* table */}
            <Table className="min-w-full max-w-full overflow-hidden">

                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="*:px-4 *:border">

                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className="text-xs">
                                    <CustomTableHeader header={header} />
                                </TableHead>
                            ))}

                            {Object.entries(crud).some(([, value]) => value) && <TableHead></TableHead>}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} className="border h-12">
                                <CustomLoader size="sm" />
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && (
                        <>
                            {table.getRowModel().rows?.length > 0 && (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="*:px-4 *:border cursor-pointer *:text-xs">

                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                onDoubleClick={() => {
                                                    if (row.getIsGrouped()) return
                                                    const id = (row.original as { _id: string })._id
                                                    if (crud.read) router.push(`${params.name}/visualizza/${id}`)
                                                    if (crud.update) router.push(`${params.name}/modifica/${id}`)
                                                }}
                                            >
                                                {cell.getIsGrouped() && (
                                                    <div className={`text-xs flex gap-1 items-center ${row.getIsExpanded() && 'text-primary'}`} onClick={row.getToggleExpandedHandler()}>
                                                        {row.getIsExpanded() ? <CornerLeftDown className="size-4" /> : <CornerDownRight className="size-4" />}
                                                        <span>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                                                        <span>({row.subRows.length})</span>
                                                    </div>
                                                )}

                                                {!cell.getIsGrouped() && flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}

                                        {Object.entries(crud).some(([, value]) => value) && !isFilter && (
                                            <TableCell className="w-40">
                                                <section className="flex justify-center gap-2">
                                                    {crud.read && (
                                                        <Button
                                                            variant="ghost" size="sm" className="px-2"
                                                            onClick={() => router.push(`${params.name}/visualizza/${(row.original as { id: string | number }).id}`)}
                                                        >
                                                            <Eye />
                                                        </Button>
                                                    )}
                                                    {crud.update && (
                                                        <Button
                                                            variant="ghost" size="sm" className="px-2"
                                                            onClick={() => router.push(`${params.name}/modifica/${(row.original as { id: string | number }).id}`)}
                                                        >
                                                            <Pen />
                                                        </Button>
                                                    )}
                                                    {crud.delete && (
                                                        <Button
                                                            variant="ghost" size="sm" className="px-2 text-destructive hover:text-destructive"
                                                            onClick={() => setDialogDelete({ open: true, id: (row.original as { id: string }).id })}
                                                        >
                                                            <Trash />
                                                        </Button>
                                                    )}
                                                </section>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}

                            {table.getRowModel().rows?.length == 0 && (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="border h-12 text-xs text-destructive">Nessun risultato disponibile.</TableCell>
                                </TableRow>
                            )}
                        </>
                    )}

                </TableBody>
            </Table>

            {/* pagination */}
            {table.getRowModel().rows?.length > 0 && (
                <CustomTablePagination<T>
                    table={table}
                    isFilter={isFilter}
                    info={{ pageIndex: pagination.pageIndex, rowCount: rowCount, pageSize: pagination.pageSize }}
                />
            )}

            {/* modal delete */}
            <CustomModal
                customName="Elimina elemento"
                description="Una volta eliminato non sarà più possibile recuperarlo."
                icon={<SquareX className="size-6" />}
                open={dialogDelete.open}
                small={true}
                close={() => setDialogDelete({ id: "", open: false })}
            >
                <div className="flex flex-col gap-4 mt-8">
                    <Button size="lg" variant="destructive" onClick={() => deleteRow(dialogDelete.id)}>Conferma</Button>
                    <Button size="lg" variant="ghost" onClick={() => setDialogDelete({ id: "", open: false })}>Annulla</Button>
                </div>
            </CustomModal>

        </>
    )
}