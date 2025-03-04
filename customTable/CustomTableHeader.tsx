// shad
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// icons
import { ArrowUp, ArrowDown, ArrowUpDown, Group, Settings2, ArrowLeftToLine, ArrowRightToLine, X, Maximize, Minimize } from "lucide-react"

// table
import { Header } from "@tanstack/react-table"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function CustomTableHeader<T>({ header }: { header: Header<T, unknown> }) {
    return (
        <section className="flex items-center gap-2 relative group">

            {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                resize
            ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            {header.column.getCanResize() && (
                <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`
                        absolute top-0 bottom-0 right-0 w-1 rounded-md cursor-ew-resize bg-primary my-1
                        select-none touch-none
                        opacity-0 group-hover:opacity-100
                        transition-opacity ${header.column.getIsResizing() ? ' opacity-100' : ''}
                    `}
                />
            )}

            {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                title + sort
            ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            {header.column.getCanSort() && (
                <>
                    <div onClick={() => header.column.toggleSorting()} className="cursor-pointer flex items-center gap-2">
                        {typeof header.column.columnDef.header === "function" ? header.column.columnDef.header(header.getContext()) : header.column.columnDef.header}
                        <Button variant="ghost" size="icon">
                            {header.column.getIsSorted() === "asc" ?
                                <ArrowUp className="size-4 text-primary" /> :
                                header.column.getIsSorted() === "desc" ? <ArrowDown className="size-4 text-primary" /> :
                                    <ArrowUpDown className="size-4" />
                            }
                        </Button>
                    </div>
                    {header.column.getIsSorted() && (
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => header.column.clearSorting()}>
                            <X />
                        </Button>
                    )}
                </>
            )}

            {!header.column.getCanSort() && (
                <div>{typeof header.column.columnDef.header === "function" ? header.column.columnDef.header(header.getContext()) : header.column.columnDef.header}</div>
            )}

            <div className="flex items-center gap-2">

                {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    grouping
                ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

                {header.column.getIsGrouped() && (
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={header.column.getToggleGroupingHandler()}>
                        <Group className="size-4" />
                    </Button>
                )}

                {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                   grouping + pinngin
                ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

                {(header.column.getCanPin() || header.column.getCanGroup()) && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="focus-visible:ring-0 focus-visible:ring-offset-0">
                            <Button size="icon" variant="ghost" className={`${(header.column.getIsPinned() || header.column.getIsGrouped()) && "text-primary"}`}>
                                <Settings2 />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel className="text-xs font-normal">Opzioni Colonna</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {!header.isPlaceholder && header.column.getCanPin() && (
                                <>
                                    {header.column.getIsPinned() && (
                                        <DropdownMenuItem onClick={() => { header.column.pin(false) }} className="text-xs">
                                            Sblocca
                                            <DropdownMenuShortcut>
                                                <X className="size-3" />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    )}

                                    {header.column.getIsPinned() !== 'left' && (
                                        <DropdownMenuItem onClick={() => { header.column.pin('left') }} className="text-xs">
                                            Blocca a sinistra
                                            <DropdownMenuShortcut>
                                                <ArrowLeftToLine className="size-3" />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    )}

                                    {header.column.getIsPinned() !== 'right' && (
                                        <DropdownMenuItem onClick={() => { header.column.pin('right') }} className="text-xs">
                                            Blocca a destra
                                            <DropdownMenuShortcut>
                                                <ArrowRightToLine className="size-3" />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    )}

                                    {header.column.getCanGroup() && (
                                        <DropdownMenuItem {...{ onClick: header.column.getToggleGroupingHandler() }} className="text-xs">
                                            {header.column.getIsGrouped() ? `Espandi (${header.column.getGroupedIndex()}) ` : `Raggruppa`}
                                            <DropdownMenuShortcut>
                                                {header.column.getIsGrouped() ? <Maximize className="size-3" /> : <Minimize className="size-3" />}
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    )}
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

        </section>
    )
}