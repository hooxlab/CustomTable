// shad
import { SheetClose, SheetFooter } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// icons
import { RouteOff, Settings2, Trash, X } from "lucide-react"

// components
import RangeDatePicker from "@/components/custom/CustomTable/Date/RangeDatePicker"
import MultiSelect from "@/components/custom/CustomTable/Select/MultiSelect"
import SingleSelect from "@/components/custom/CustomTable/Select/SingleSelect"
import DatePicker from "@/components/custom/CustomTable/Date/DatePicker"
import SearchSelect from "@/components/custom/CustomTable/Select/SearchSelect"

// date
import { format } from 'date-fns'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface PendingFilterProps {
    [key: string]: any;
}

interface filterFieldsProps {

    // obbligatori
    type: string;
    label: string;
    field: string;

    // type = select | type = multiselect
    options?: { select_value: string; select_title: string; }[]
    url?: string;
}

interface HTableToolBarFilterProps {
    filterFields: filterFieldsProps[];
    pendingFilter: PendingFilterProps;
    setPendingFilter: React.Dispatch<React.SetStateAction<PendingFilterProps>>
    actions: {
        saveFilter: () => void;
        clearFilter: () => void;
        resetFilter: () => void;
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function HTableToolBarFilter({ filterFields, actions, pendingFilter, setPendingFilter }: HTableToolBarFilterProps) {

    const resetFilter = (field: string) => {
        setPendingFilter(prev => {
            const { [field]: unused, ...rest } = prev
            return rest
        })
    }

    const MultiSelectFunction = (element: string, field: string) => {
        setPendingFilter(prev => {
            const currentArray = prev[field] || []
            const newArray = currentArray.includes(element) ? currentArray.filter((item: string) => item !== element) : [...currentArray, element]
            if (newArray.length === 0) {
                const { [field]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [field]: newArray }
        })
    }

    return (
        <section>

            {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                fields
            ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <section className="flex flex-col gap-4">
                {filterFields.map((el, index) => {
                    switch (el.type) {

                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        // data #TODO
                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        case 'date':
                            return (
                                <div key={index}>
                                    <Label className="text-xs">{el.label}</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                        <DatePicker
                                            value={pendingFilter?.[el.field] as string || undefined}
                                            onChange={(date) => setPendingFilter(prev => ({ ...prev, [el.field]: date }))}
                                        />
                                        {pendingFilter?.[el.field] && (
                                            <div>
                                                <Button size="sm" className="px-2" variant="destructive" onClick={() => resetFilter(el.field)}>
                                                    <Trash />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )

                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        // date range #TODO
                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        case 'date_range':
                            return (
                                <div key={index}>
                                    <Label className="text-xs">{el.label}</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                        <div className="w-full">
                                            <RangeDatePicker
                                                date={pendingFilter?.[`range_${el.field}`] as object}
                                                onClose={(open: boolean) => {
                                                    if (open && pendingFilter?.[`range_${el.field}`] &&
                                                        (Object.keys(pendingFilter?.[`range_${el.field}`]).length <= 0 || !pendingFilter?.[`range_${el.field}`].to)
                                                    ) resetFilter(`range_${el.field}`)

                                                }}
                                                onChange={(range) => {
                                                    setPendingFilter(prev => ({
                                                        ...prev,
                                                        [`range_${el.field}`]: {
                                                            ...(range?.from && { from: format(range?.from as Date, 'yyyy-MM-dd') }),
                                                            ...(range?.to && { to: format(range.to as Date, 'yyyy-MM-dd') })
                                                        }
                                                    }))
                                                }}
                                            />
                                        </div>
                                        {pendingFilter?.[`range_${el.field}`] && (
                                            <div>
                                                <Button size="sm" className="px-2" variant="destructive" onClick={() => resetFilter(`range_${el.field}`)}>
                                                    <Trash />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )

                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        // select #TODO
                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        case 'select':
                            return (
                                <div key={index}>
                                    <Label className="text-xs">{el.label}</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                        <SearchSelect
                                            selected={pendingFilter?.[el.field] || {}}
                                            onChange={(value) => setPendingFilter(prev => ({ ...prev, [el.field]: value }))}
                                            values={el?.options || undefined}
                                            url={el?.url || undefined} 
                                            general={{
                                                name: "",
                                                value: undefined,
                                                title: undefined
                                            }}                                        />
                                        {pendingFilter?.[el.field] && (
                                            <div>
                                                <Button size="sm" className="px-2" variant="destructive" onClick={() => resetFilter(el.field)}>
                                                    <Trash />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )

                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        // multiselect #TODO
                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        case 'multiple_select':
                            return (
                                <div key={index}>
                                    <Label className="text-xs">{el.label}</Label>
                                    <div className="mt-1">
                                        <MultiSelect
                                            values={el?.options || undefined}
                                            url={el?.url || undefined}
                                            selected={pendingFilter?.[el.field] || []}
                                            toggleSelection={(element) => MultiSelectFunction(element, el.field)}
                                            clearSelections={() => resetFilter(el.field)}
                                        />
                                    </div>
                                </div>
                            )

                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        // boolean #TODO
                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        case 'boolean':
                            return (
                                <div key={index}>
                                    <Label className="text-xs">{el.label}</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                        <SingleSelect
                                            selected={pendingFilter?.[el.field] || {}}
                                            onChange={(value) => setPendingFilter(prev => ({ ...prev, [el.field]: value }))}
                                            values={el?.options || undefined}
                                            url={el?.url || undefined}
                                            general={{ name: el.field }}
                                        />
                                        {pendingFilter?.[el.field] && (
                                            <div>
                                                <Button size="sm" className="px-2" variant="destructive" onClick={() => resetFilter(el.field)}>
                                                    <Trash />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )


                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        // errore
                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        default:
                            return null
                    }
                })}
            </section>

            {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                actions
            ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <Separator className="my-4" />

            <SheetFooter className="flex !flex-col gap-2">
                <SheetClose asChild>
                    <Button size="sm" onClick={actions.saveFilter} disabled={Object.keys(pendingFilter).length <= 0 ? true : false}>
                        <Settings2 /> Filtra
                    </Button>
                </SheetClose>

                <SheetClose asChild>
                    <Button size="sm" variant="outline" onClick={actions.clearFilter}>
                        <X /> Annulla
                    </Button>
                </SheetClose>

                {Object.keys(pendingFilter).length > 0 && (
                    <SheetClose asChild>
                        <Button size="sm" variant="destructive" onClick={actions.resetFilter}>
                            <RouteOff /> Resetta filtri
                        </Button>
                    </SheetClose>
                )}
            </SheetFooter>
        </section>
    )
}