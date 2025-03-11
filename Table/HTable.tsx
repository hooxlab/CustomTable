"use client"

import { useState, useEffect, useMemo, useCallback } from "react"

// components
import Loader from "@/components/custom/CustomTable/Loader"
import Modal from "@/components/custom/CustomTable/Modal"
import HTableHeader from "@/components/custom/CustomTable/Table/components/HTableHeader"
import HTablePagination from "@/components/custom/CustomTable/Table/components/HTablePagination"
import HTableToolBar from "@/components/custom/CustomTable/Table/components/HTableToolBar"


// shad
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

// icons
import { CornerDownRight, CornerLeftDown, Trash, Pen, Eye, SquareX } from "lucide-react"

// axios
import { apiClient } from "@/utils/Interceptor"

// query
import { useQuery, keepPreviousData } from '@tanstack/react-query'

// table
import {
    Row, ColumnDef, flexRender, getCoreRowModel, useReactTable,
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

interface HTableProps<T> {

    // general
    tableName: string;

    // get data
    url: string;
    urlParams?: string;

    // colums
    columns: ColumnDef<T>[]

    // filter
    isFilter?: { active: boolean; slim: boolean; };

    // custom filter
    filters?: { [key: string]: any };
    setFilters?: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;

    // crud
    crud?: { read: boolean; update: boolean; delete: boolean; }

    // settings
    settings?: { search: boolean; create: boolean; import: boolean; export: boolean; filter: boolean; }

    // custom elements in toolbar
    customToolBarElements?: {
        top?: React.ReactNode;
        bottom?: React.ReactNode;
    }

    // filter table
    filterFields?: filterFieldsProps[]

    // router
    router?: any,

    // relations
    relationships?: { [key: string]: { [key: string]: string } };
    primaryKey?: string;
    filterName?: string;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function HTable<T>({
    tableName,

    url,
    urlParams = "",

    columns,

    isFilter = { active: false, slim: false },

    filters,
    setFilters,

    crud = { read: true, update: true, delete: true },

    settings = { search: true, create: true, import: true, export: true, filter: true },
    customToolBarElements,

    filterFields = [],

    router,

    relationships,
    primaryKey = "id",
    filterName
}: HTableProps<T>) {

    // storage
    const initialValues = {
        search: [],
        pagination: { pageIndex: 0, pageSize: isFilter.active ? 10 : 50 },
        grouping: [],
        pinning: { left: [], right: [] },
        colums: {},
        sorting: []
    }
    const storage = localStorage.getItem(tableName)
    const [storageExists, setStorageExists] = useState(localStorage.getItem(tableName) !== JSON.stringify(initialValues))
    const storedData = storage ? JSON.parse(storage) : initialValues

    // relationship
    const [relationshipsData, setRelationshipsData] = useState<{ [key: string]: any }>({})
    const effectiveFilterName = filterName || primaryKey

    // modal delete
    const [dialogDelete, setDialogDelete] = useState({ open: false, id: '' })

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // table state
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
    // filter
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const [_filters, _setFilters] = useState<{ [key: string]: any }>({})
    const effectiveFilters = filters || _filters
    const effectiveSetFilters = setFilters || _setFilters

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // relationship
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // filter
    const relationshipsFilter = useCallback((row: Row<T>) => {
        if (isFilter.active && relationships) {
            effectiveSetFilters((prev) => {
                const element = String((row.original as { [key: string]: any })[primaryKey])
                const currentArray = prev[effectiveFilterName] || []
                const newArray = currentArray.includes(element) ? currentArray.filter((item: string) => item !== element) : [...currentArray, element]

                if (newArray.length === 0) {
                    const newFilters = { ...prev }
                    delete newFilters[effectiveFilterName]
                    return newFilters
                } else return { ...prev, [effectiveFilterName]: newArray }
            })
        }
    }, [effectiveSetFilters])

    // checked
    const checkedFilter = useCallback((row: Row<T>) => {
        if (isFilter.active && relationships) {
            if (effectiveFilters[effectiveFilterName] && effectiveFilters[effectiveFilterName].includes(String((row.original as { [key: string]: any })[primaryKey]))) return true
            return false
        }
        return false
    }, [effectiveFilters])

    // create params relationship
    useEffect(() => {
        if (relationships && relationships[tableName]) {
            let data: { [key: string]: string | string[] } = {}
            Object.entries(effectiveFilters).map(([key, value]) => {
                if (relationships[tableName][key]) {
                    if (typeof value == 'object') data[relationships[tableName][key]] = Object.values(value) as string[]
                    else data[relationships[tableName][key]] = String(value)
                }
            })
            setRelationshipsData(data)
        }
    }, [effectiveFilters])

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
    // params
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const dataParams = useMemo(() => ({
        urlParams: urlParams,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        order: sorting,
        search: globalFilter,
        relations: relationshipsData
    }), [pagination, urlParams, sorting, globalFilter, relationshipsData])

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
        staleTime: 1000,
        queryFn: async () => fetchData(),
        placeholderData: keepPreviousData,
    })

    // total elements
    const rowCount = useMemo(() => data?.tot_records ?? 0, [data])

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // table
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const table = useReactTable({

        // init
        data: data?.results ?? [],
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
        defaultColumn: { minSize: 300, maxSize: 1200 },

        // total elements
        rowCount,

        // state
        state: { pagination, sorting, globalFilter, columnPinning, grouping, columnVisibility }
    })

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // router
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const navigate = (url: string) => {
        if (router) router(url)
        const newUrl = window.location.pathname.endsWith('/') ? window.location.pathname + url : window.location.pathname + '/' + url
        window.history.pushState({}, '', newUrl)
        window.dispatchEvent(new Event('popstate'))
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // export
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const exportFunction = async () => {
        const dataexport = { urlParams: urlParams, nopagination: true, order: sorting, search: globalFilter }
        const res = await apiClient.get(url, { params: dataexport })
        return res.data.results
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // delete #TODO
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
            <div>
                <HTableToolBar<T>
                    table={table}
                    isFilter={isFilter}
                    settings={settings}
                    storage={{ exist: storageExists, reset: resetLocalStorage }}
                    exportData={() => exportFunction()}
                    filterFields={filterFields}
                    navigate={navigate}
                    customElemnts={customToolBarElements}
                />
            </div>

            {/* table */}
            <Table className="min-w-full max-w-full overflow-hidden">

                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="*:px-4 *:border">
                            {isFilter.active && (<TableHead></TableHead>)}
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className="text-xs">
                                    <HTableHeader header={header} />
                                </TableHead>
                            ))}
                            {!isFilter.active && Object.entries(crud).some(([, value]) => value) && <TableHead></TableHead>}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} className="border h-12">
                                <Loader size="sm" />
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && (
                        <>
                            {table.getRowModel().rows?.length > 0 && (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="*:px-4 *:border cursor-pointer *:text-xs" onClick={() => relationshipsFilter(row)}>

                                        {/* checkbox */}
                                        {isFilter.active && (
                                            <TableCell className={`text-center ${!isFilter.slim ? "w-10 [&:has([role=checkbox])]:pr-4" : "[&:has([role=checkbox])]:px-0 [&:has([role=checkbox])]:py-1 w-2"}`}>
                                                <Checkbox checked={checkedFilter(row)} />
                                            </TableCell>
                                        )}

                                        {/* data */}
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                className={`${isFilter.slim && "px-0 py-1"}`}
                                                key={cell.id}
                                                onDoubleClick={() => {
                                                    if (row.getIsGrouped()) return
                                                    const id = (row.original as { _id: string })._id
                                                    if (crud.read) navigate(`visualizza/${id}`)
                                                    if (crud.update) navigate(`modifica/${id}`)
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

                                        {/* crud */}
                                        {!isFilter.active && Object.entries(crud).some(([, value]) => value) && (
                                            <TableCell className="w-40">
                                                <section className="flex justify-center gap-2">
                                                    {crud.read && (
                                                        <Button
                                                            variant="ghost" size="sm" className="px-2"
                                                            onClick={() => navigate(`visualizza/${(row.original as { id: string | number }).id}`)}
                                                        ><Eye /></Button>
                                                    )}
                                                    {crud.update && (
                                                        <Button
                                                            variant="ghost" size="sm" className="px-2"
                                                            onClick={() => navigate(`modifica/${(row.original as { id: string | number }).id}`)}
                                                        ><Pen /></Button>
                                                    )}
                                                    {crud.delete && (
                                                        <Button
                                                            variant="ghost" size="sm" className="px-2 text-destructive hover:text-destructive"
                                                            onClick={() => setDialogDelete({ open: true, id: (row.original as { id: string }).id })}
                                                        ><Trash /></Button>
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
            {table.getRowModel().rows?.length > 0 && !isFilter.slim && (
                <HTablePagination<T>
                    table={table}
                    isFilter={isFilter.active}
                    info={{ pageIndex: pagination.pageIndex, rowCount: rowCount, pageSize: pagination.pageSize }}
                />
            )}

            {/* modal delete */}
            <Modal
                icon={<SquareX className="size-6" />}
                title="Elimina elemento"
                description="Una volta eliminato non sarà più possibile recuperarlo."
                open={dialogDelete.open}
                size="sm"
                close={() => setDialogDelete({ id: "", open: false })}
                navigate={navigate}
            >
                <div className="flex flex-col gap-4 mt-8">
                    <Button size="lg" variant="destructive" onClick={() => deleteRow(dialogDelete.id)}>Conferma</Button>
                    <Button size="lg" variant="ghost" onClick={() => setDialogDelete({ id: "", open: false })}>Annulla</Button>
                </div>
            </Modal>

        </>
    )
}