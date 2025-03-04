import { useState, useMemo } from "react"

// axios
import { apiClient } from "@/utils/interseptor"

// query
import { useQuery } from '@tanstack/react-query'

// components
import CustomLoader from "@/components/custom/customLoader"

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

export interface CustomSelectProps {
    selected: { id: string; name: string; };
    onChange: (value: string, text: string) => void;

    // form
    onBlur?: () => void;

    // url = dati da api | options = dati fissi
    url?: string;
    values?: dataProps[]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function CustomSelect({ selected, onChange, onBlur, url, values }: CustomSelectProps) {

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
        queryKey: ["multi_select", search],
        queryFn: getData,
        enabled: !!url
    })

    const options = useMemo<dataProps[]>(() => {
        if (!url && values) return values
        return data
    }, [data])

    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        loader
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

    if (isLoading) {
        return <CustomLoader />
    }

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
                <Button variant="outline" size="sm" className="w-full justify-between" role="combobox">
                    {selected.name ? selected.name : "Seleziona elemento"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[335px] left-0 p-0">
                <Command>
                    <CommandInput className="text-xs" placeholder="Cerca..." value={search} onValueChange={setSearch} />
                    <CommandList>
                        <CommandEmpty className="text-destructive text-xs py-4 text-center">Nessun elemento trovato.</CommandEmpty>
                        <CommandGroup>
                            {options.map((el) => {
                                return (
                                    <CommandItem
                                        key={el.select_value} value={el.select_title} className="flex justify-between text-xs"
                                        onSelect={(title) => {
                                            const value = options.find((el) => el.select_title == title)?.select_value || ''
                                            onChange(value, title)
                                            setIsOpen(false)
                                        }}
                                    >
                                        {el.select_title}
                                        {selected.id && selected.id == el.select_value && (<Check className={`size-4`} />)}
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
