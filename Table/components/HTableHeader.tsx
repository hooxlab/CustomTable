// shad
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// icons
import { ArrowUp, ArrowDown, ArrowUpDown, Group, Settings2, ArrowLeftToLine, ArrowRightToLine, X, Maximize, Minimize } from "lucide-react"

// table
import { Header } from "@tanstack/react-table"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface HTableHeaderProps<T> {
    header: Header<T, unknown>;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function HTableHeader<T>({ header }: HTableHeaderProps<T>) {
    return (
        <section className="flex items-stretch relative justify-between h-full">

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
                    <div onClick={() => header.column.toggleSorting()} className="group cursor-pointer px-1 flex items-center justify-between ">
                        {header.column.getIsSorted() === "asc" ?
                                <ArrowUp size={12} className="text-destructive" /> : header.column.getIsSorted() === "desc" ? <ArrowDown size={12} className="text-destructive" /> : <ArrowUpDown className="text-stone-400 group-hover:text-stone-900" size={12} />
                            }
                       <div className={`pl-1 r ${header.column.getIsSorted() ? 'font-bold text-destructive' : ''}`}>
                       {typeof header.column.columnDef.header === "function" ? header.column.columnDef.header(header.getContext()) : header.column.columnDef.header}
                       </div>
                    
                    </div>

                </>
            )}

            {!header.column.getCanSort() && (
                <div className="flex items-center px-1">{typeof header.column.columnDef.header === "function" ? header.column.columnDef.header(header.getContext()) : header.column.columnDef.header}</div>
            )}

            <div className="flex">

                {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    grouping
                ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

                {header.column.getIsGrouped() && (
                    <div  className="flex items-center px-1 text-stone-950 hover:text-destructive cursor-pointer" onClick={header.column.getToggleGroupingHandler()}>
                        <Group size={12}/>
                    </div>
                )}

                {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                   grouping + pinngin
                ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

                {(header.column.getCanPin() || header.column.getCanGroup()) && (
                   
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild className="h-full items-center flex items-center px-1 hover:bg-stone-100 hover:text-destructive cursor-pointer">
                            <div className={`${(header.column.getIsPinned() || header.column.getIsGrouped()) && "text-stone-950 hover:text-destructive pointer"} `}>
                                <Settings2 size={12} />
                            </div>
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