import { useState } from "react"

// date picker
import { format } from "date-fns"

// icons
import { CalendarIcon } from "lucide-react"

// css dinamico
import { cn } from "@/lib/utils"

// shad
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

type dateRangeProps = {
    from?: Date;
    to?: Date;
}

export interface CustomRangeDatePickerProps {
    date?: dateRangeProps;
    onChange: (range: dateRangeProps | undefined) => void;
    onClose?: (open: boolean) => void;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function CustomRangeDatePicker({ date, onChange, onClose }: CustomRangeDatePickerProps) {

    // open / close
    const [isOpen, setIsOpen] = useState(false)

    const close = (isOpen: boolean) => {
        if (onClose) onClose(isOpen)
        setIsOpen(!isOpen)
    }

    const change = (range: dateRangeProps | undefined) => {
        if (onChange) onChange(range)
        if (range?.from && range.to) setIsOpen(false)
    }

    return (
        <div className="grid gap-2">
            <Popover open={isOpen} onOpenChange={() => close(isOpen)}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? `${format(date.from, 'dd/MM/yyyy')} - ${format(date.to, 'dd/MM/yyyy')}` : format(date.from, 'dd/MM/yyyy')
                        ) : <span>Seleziona le date</span>
                        }
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus mode="range" defaultMonth={date?.from}
                        selected={date?.from ? { from: date.from, to: date.to } : undefined}
                        onSelect={(range) => change(range)} numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
