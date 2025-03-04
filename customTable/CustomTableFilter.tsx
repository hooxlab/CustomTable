// shad
import { SheetClose, SheetFooter } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// icons
import { RouteOff, Settings2, Trash, X } from "lucide-react"

// components
import { CustomRangeDatePicker } from "@/components/custom/customDate/customRangeDatePicker"
import { CustomMultiSelect } from "@/components/custom/customSelect/customMultiSelect"
import CustomSingleSelect from "@/components/custom/customSelect/customSingleSelect"
import { CustomDatePicker } from "@/components/custom/customDate/customDatePicker"
import { CustomSelect } from "@/components/custom/customSelect/customSelect"

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

interface CustomTableFilterProps {
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

export default function CustomTableFilter({ filterFields, actions, pendingFilter, setPendingFilter }: CustomTableFilterProps) {

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
                        // data
                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        case 'date':
                            return (
                                <div key={index}>
                                    <Label className="text-xs">{el.label}</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                        <CustomDatePicker
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
                        // date range
                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        case 'date_range':
                            return (
                                <div key={index}>
                                    <Label className="text-xs">{el.label}</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                        <div className="w-full">
                                            <CustomRangeDatePicker
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
                        // select
                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        case 'select':
                            return (
                                <div key={index}>
                                    <Label className="text-xs">{el.label}</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                        <CustomSelect
                                            selected={pendingFilter?.[el.field] || {}}
                                            onChange={(value, title) => setPendingFilter(prev => ({ ...prev, [el.field]: { id: value, name: title } }))}
                                            values={el?.options || undefined}
                                            url={el?.url || undefined}
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
                        // multiselect
                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        case 'multiple_select':
                            return (
                                <div key={index}>
                                    <Label className="text-xs">{el.label}</Label>
                                    <div className="mt-1">
                                        <CustomMultiSelect
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
                        // boolean
                        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                        case 'boolean':
                            return (
                                <div key={index}>
                                    <Label className="text-xs">{el.label}</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                        <CustomSingleSelect
                                            selected={pendingFilter?.[el.field] || {}}
                                            onChange={(value, title) => setPendingFilter(prev => ({ ...prev, [el.field]: { id: value, name: title } }))}
                                            values={el?.options || undefined}
                                            url={el?.url || undefined}
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