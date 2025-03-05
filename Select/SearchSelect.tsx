import { useState, useMemo } from "react"

// axios
import { apiClient } from "@/utils/Interceptor"

// query
import { useQuery } from '@tanstack/react-query'

// components
import Loader from "@/components/custom/CustomTable/Loader"

// shad
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// icons
import { Check, ChevronsUpDown } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export interface dataProps {
    select_value: string;
    select_title: string;
}

export interface SearchSelectProps {

    // general
    placeholder?: string;

    general: {
        name: string;
        value?: string;
        title?: string
    }

    // change and seleceted
    selected: string;
    onChange: (value: string) => void;

    // form
    onBlur?: () => void;

    // api or fixed data
    url?: string;
    values?: dataProps[]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function SearchSelect({ placeholder, general, selected, onChange, onBlur, url, values }: SearchSelectProps) {

    // search
    const [search, setSearch] = useState("")

    // open / close select
    const [isOpen, setIsOpen] = useState(false)

    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        get
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

    const getData = async () => {
        if (!url) return []
        const res = await apiClient.get(url)
        return res.data
    }

    const { data, isLoading } = useQuery({
        queryKey: [general.name, search],
        queryFn: getData,
        enabled: !!url
    })

    const options = useMemo<dataProps[]>(() => {
        if (!url && values) return values

        const opz = data ? data.results.map((el: { [key: string]: any }) => (
            { select_value: el[general.value || "select_value"], select_title: el[general.title || "select_title"] }
        )) : []
        return opz
    }, [data])

    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        code
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

    return (
        <Popover
            open={isOpen}
            onOpenChange={(open) => {
                if (!open && onBlur) onBlur()
                setIsOpen(!isOpen)
            }}
        >
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={`w-full justify-between ${selected || 'text-muted-foreground'}`} role="combobox">
                    {selected ? selected : placeholder ? placeholder : "Seleziona elemento"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] left-0 p-0">
                <Command>
                    <CommandInput className="text-xs" placeholder="Cerca..." value={search} onValueChange={setSearch} />
                    <CommandList>
                        <CommandEmpty className="text-xs p-4 text-center">
                            {isLoading && <Loader size="sm" />}
                            {!isLoading && <span className="text-destructive">Nessun elemento trovato.</span>}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((el) => {
                                return (
                                    <CommandItem
                                        key={el.select_value} value={el.select_value} className="flex justify-between text-xs"
                                        onSelect={(value) => { onChange(value); setIsOpen(false) }}
                                    >
                                        {el.select_title}
                                        {selected && selected == el.select_value && (<Check className={`size-4`} />)}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
