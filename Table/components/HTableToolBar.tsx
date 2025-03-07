/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react"

// tanstack
import { Table, Header, Column } from "@tanstack/react-table"

// shad
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent,
    DropdownMenuSubTrigger, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// components
import HTableToolBarFilter from "@/components/custom/CustomTable/Table/components/HTableToolBarFilter"

// export excel
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

// icons
import { Trash, FileDown, Columns3, BookText, Maximize, ArrowLeftToLine, ArrowRightToLine, RotateCcw, Loader2, FileUp, Filter, Plus } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

type ColumnFile = {
    header: string;
    key: string;
    width: number;
}

interface filterFieldsProps {
    type: string;
    label: string;
    field: string;
    options?: { select_value: string; select_title: string; }[]
    url?: string;
}

export interface HTableToolBarProps<T> {
    table: Table<T>;

    // filter
    isFilter: { active: boolean; slim: boolean; };

    // settings
    settings: {
        search: boolean;
        create: boolean;
        import: boolean;
        export: boolean;
        filter: boolean
    }

    // storage and export
    storage: { exist: boolean; reset: () => void; }
    exportData: () => Promise<{ [key: string]: any }[]>;

    // filter table
    filterFields?: filterFieldsProps[];

    // router
    navigate: any;

    // custom elements
    customElemnts?: {
        top?: React.ReactNode;
        bottom?: React.ReactNode;
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function HTableToolBar<T>({
    table,
    isFilter,
    settings,
    storage,
    exportData,
    filterFields = [],
    navigate,
    customElemnts
}: HTableToolBarProps<T>) {

    // init filter
    const [pendingFilter, setPendingFilter] = useState({})

    // loader
    const [loading, setLoading] = useState(false)

    // search
    const [search, setSearch] = useState("")

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // filter (reset - clear - save)
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const resetFilter = () => {
        setPendingFilter({})
        // setFilters({})
        table.firstPage()
    }

    const clearFilter = () => {
        // setFilters(pendingFilter)
        table.firstPage()
    }

    const saveFilter = () => {
        // setFilters((prev) => ({ ...prev, ...pendingFilter }))
        table.firstPage()
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // pinning
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const leftColumns = table.getState()?.columnPinning?.left ?? []
    const rightColumns = table.getState()?.columnPinning?.right ?? []
    const grouping = table.getState()?.grouping ?? []

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // search state for delay
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    useEffect(() => {
        const handler = setTimeout(() => {
            table.firstPage()
            const val = search == "" ? [] : String(search)
            table.setGlobalFilter(val)
        }, 500)

        return () => clearTimeout(handler)
    }, [search])

    const resetSearch = () => {
        setSearch("")
        table.setGlobalFilter([])
        table.firstPage()
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // export
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const exportToExcel = async () => {

        // caricamento
        setLoading(true)

        // query
        const res = await exportData()

        // tipo di file e estensione
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        const fileExtension = '.xlsx'

        // creo una nuova istanza
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Sheet1')

        // estraggo le colonne e imposto le colonne
        const columns: Partial<ColumnFile>[] = table.getHeaderGroups()[0].headers.map((el: Header<T, unknown>) => (
            { header: el.column.columnDef.header as string, key: el.id, width: 40 }
        ))
        worksheet.columns = columns

        // estraggo le righe (i dati) e imposto le righe
        res.forEach(item => worksheet.addRow(item))

        // Crea un buffer e scrivo il file Excel
        const buffer = await workbook.xlsx.writeBuffer()
        const fileData = new Blob([buffer], { type: fileType })
        saveAs(fileData, "Export" + fileExtension)

        setLoading(false)
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // component
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    return (
        <>
            {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                search
            ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            {settings.search && (
                <section className={`grid gap-2 ${isFilter.slim ? "mb-2" : "grid-cols-2 mb-4"}`}>
                    <div className="flex gap-2">
                        <Input
                            autoFocus={false}
                            className="!text-xs h-8" value={search} placeholder="Cerca..."
                            onChange={e => setSearch(e.target.value)}
                        />
                        {table.getState().globalFilter.length > 0 && (
                            <div>
                                <Button size="sm" className="px-2" variant="destructive" onClick={resetSearch}>
                                    <Trash className="size-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    {customElemnts?.top}
                </section>
            )}

            {!isFilter.active && (
                <div className="grid grid-cols-4 items-center gap-2 py-1 mb-4">
                    <div className="flex gap-2 items-center">

                        {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                            local storage
                        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

                        {storage.exist && (
                            <Button variant="destructive" size="sm" onClick={storage.reset}>
                                <RotateCcw /> Pulisci tabella
                            </Button>
                        )}

                        {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                            columns
                        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

                        {table.getAllColumns().length > 0 && (
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm"><Columns3 /> Colonne</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 max-h-[500px] overflow-auto">
                                        <DropdownMenuLabel className="text-xs font-normal">Gestione colonne</DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        {/* all */}
                                        {!table.getIsAllColumnsVisible() && (
                                            <>
                                                <DropdownMenuCheckboxItem className="text-xs" checked={table.getIsAllColumnsVisible()} onClick={() => table.setColumnVisibility({})}>
                                                    Tutte le colonne
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}

                                        {/* list */}
                                        {table.getAllLeafColumns().map((column: Column<T, unknown>) => {
                                            return (
                                                <DropdownMenuCheckboxItem className="text-xs" key={column.id} checked={column.getIsVisible()} onClick={column.getToggleVisibilityHandler()}>
                                                    {column.id}
                                                </DropdownMenuCheckboxItem>
                                            )
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* reset */}
                                {!table.getIsAllColumnsVisible() && (
                                    <Button size="sm" className="px-2" variant="destructive" onClick={() => table.setColumnVisibility({})}>
                                        <Trash />
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                            settings (grouping, pinning)
                        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

                        {(leftColumns.length > 0 || rightColumns.length > 0 || grouping.length > 0) && (
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm"><BookText /> Gestione</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 max-h-[500px] overflow-auto">
                                        <DropdownMenuLabel className="text-xs font-normal">Colonne</DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        {/* left pinning */}
                                        {leftColumns.length > 0 && (
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="text-xs"><ArrowLeftToLine /> <span>Bloccate a sinistra</span></DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        {leftColumns.map((el, index) => (
                                                            <DropdownMenuItem className="text-xs" key={index}><ArrowLeftToLine /> <span>{el}</span></DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                        )}

                                        {/* right pinning */}
                                        {rightColumns.length > 0 && (
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="text-xs"><ArrowRightToLine /> <span>Bloccate a destra</span></DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        {rightColumns.map((el, index) => (
                                                            <DropdownMenuItem className="text-xs" key={index}><ArrowRightToLine /> <span>{el}</span></DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                        )}

                                        {/* grouping */}
                                        {grouping.length > 0 && (
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="text-xs"><Maximize /> <span>Raggruppate</span></DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        {grouping.map((el, index) => (
                                                            <DropdownMenuItem className="text-xs" key={index}><Maximize /> <span>{el}</span></DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* clear */}
                                <Button
                                    size="sm" variant="destructive" className="px-2"
                                    onClick={() => { table.setGrouping([]); table.setColumnPinning({ left: [], right: [] }) }}
                                >
                                    <RotateCcw />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        add - import - export - filter
                    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

                    <div className="col-span-3 items-center flex justify-end gap-2">
                        {settings.create && (
                            <Button variant="default" size="sm" onClick={() => navigate('aggiungi')}>
                                <Plus className="size-4" /> Aggiungi
                            </Button>
                        )}

                        {settings.import && (
                            <Button variant="default" size="sm">
                                <FileUp className="size-4" /> Importa
                            </Button>
                        )}

                        {settings.export && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportToExcel}
                                disabled={loading || table.getRowModel().rows?.length == 0}
                            >
                                {loading ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />} Esporta
                            </Button>
                        )}

                        {customElemnts?.bottom}

                        {settings.filter && filterFields?.length > 0 && (
                            <>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" disabled={table.getRowModel().rows?.length == 0}>
                                            <Filter /> Filtra
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent onCloseAutoFocus={clearFilter} className="[&_.absolute.right-4.top-4]:hidden">
                                        <SheetHeader>
                                            <SheetTitle>Filtra tabella</SheetTitle>
                                            <SheetDescription className="text-xs">Filtra la tabella per i campi che ti servono.</SheetDescription>
                                        </SheetHeader>
                                        <Separator className="my-4" />

                                        <HTableToolBarFilter
                                            actions={{ resetFilter, clearFilter, saveFilter }}
                                            pendingFilter={pendingFilter}
                                            setPendingFilter={setPendingFilter}
                                            filterFields={filterFields}
                                        />
                                    </SheetContent>
                                </Sheet>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}