import { useState } from "react"

// date picker
import { format } from "date-fns"

// css dinamico
import { cn } from "@/lib/utils"

// icons
import { CalendarIcon } from "lucide-react"

// shad
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export interface DatePickerProps {
    value?: string;
    disabled?: boolean;
    onChange: (date?: string) => void;
    onBlur?: (date?: string) => void;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function DatePicker({ value, onChange, onBlur, disabled = false }: DatePickerProps) {

    // open / close
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled} variant="outline" size="sm"
                    className={cn("w-full min-w-[240px] pl-3 text-left font-normal bg-card", !value && "text-muted-foreground")}
                >
                    {value ? format(value, 'dd/MM/yyyy') : <span>Seleziona una data</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    onSelect={(date) => {
                        if (date) onChange(format(date, 'yyyy-MM-dd'))
                        setIsOpen(false)
                    }}
                    onDayBlur={() => onBlur && onBlur()}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}