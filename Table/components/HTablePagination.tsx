// shad
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

// icons
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

// tanstack
import { Table } from "@tanstack/react-table"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface HTablePaginationProps<T> {
    table: Table<T>;
    isFilter: boolean;
    info: { pageIndex: number; rowCount: number; pageSize: number; }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function HTablePagination<T>({ table, info, isFilter }: HTablePaginationProps<T>) {

    const buttonList = [
        {
            icon: <ChevronsLeft className="size-4" />,
            onclick: () => table.firstPage(),
            disabled: !table.getCanPreviousPage(),
            text: 'Torna alla prima pagina'
        },
        {
            icon: <ChevronLeft className="size-4" />,
            onclick: () => table.previousPage(),
            disabled: !table.getCanPreviousPage(),
            text: 'Indietro'
        },
        {
            icon: <ChevronRight className="size-4" />,
            onclick: () => table.nextPage(),
            disabled: !table.getCanNextPage(),
            text: 'Avanti'
        },
        {
            icon: <ChevronsRight className="size-4" />,
            onclick: () => table.lastPage(),
            disabled: !table.getCanNextPage(),
            text: "Vai all'ultima pagina"
        }
    ]

    return (
        <section className="grid lg:grid-cols-2 gap-4 items-center mt-4">
            <div className="flex items-center lg:justify-start justify-end gap-4 *:py-2 *:px-4 *:border *:rounded-md *:text-xs">
                <div className="flex-1 text-center lg:flex-none lg:text-start">
                    Pagina {info.pageIndex + 1} di {Math.ceil(info.rowCount / info.pageSize)}
                </div>
                <div className="flex-1 text-center lg:flex-none lg:text-start">
                    Elementi totali: {info.rowCount}
                </div>
            </div>
            <div className="flex items-center justify-end gap-4">
                {!isFilter && (
                    <Select value={table.getState().pagination.pageSize.toString()} onValueChange={value => { table.setPageSize(Number(value)) }}>
                        <SelectTrigger className="w-[80px] text-xs">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            {[25, 50, 100].map(pageSize => (
                                <SelectItem key={pageSize} className="text-xs" value={pageSize.toString()}>{pageSize}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <section className="border rounded-md lg:w-auto w-full flex justify-center">
                    <TooltipProvider>
                        {buttonList.map((el, index) => {
                            return (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <Button size="sm" variant="ghost" onClick={el.onclick} disabled={el.disabled}>{el.icon}</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{el.text}</TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </TooltipProvider>
                </section>
            </div>
        </section>
    )
}