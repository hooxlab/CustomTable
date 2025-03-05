import { useMemo } from "react"

// shad
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// components
import Loader from "@/components/custom/CustomTable/Loader"

// axios
import { apiClient } from "@/utils/Interceptor"

// query
import { useQuery } from '@tanstack/react-query'

// icons
import { Trash } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export interface optionsProps {
    select_value: string;
    select_title: string;
}

export interface MultiSelectProps {

    selected: string[];
    toggleSelection: (element: string) => void;
    clearSelections?: () => void;

    // url = dati da api | values = dati fissi
    url?: string;
    values?: optionsProps[];
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function MultiSelect({ url, values, toggleSelection, clearSelections, selected }: MultiSelectProps) {

    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        get
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

    const getData = async () => {
        if (!url) return []
        const res = await apiClient.get(url)
        return res.data
    }

    const { data, isLoading } = useQuery({
        queryKey: ["multi_select"],
        queryFn: getData,
        enabled: !!url
    })

    const options = useMemo<optionsProps[]>(() => {
        if (!url && values) return values
        return data
    }, [data])

    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        loader
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

    if (isLoading) {
        return <Loader />
    }

    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        code
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="grow p-2 border rounded-md flex items-center gap-1 h-8">
                    {selected.length > 0 && (
                        <>
                            {options
                                .filter((option) => selected.includes(option.select_value))
                                .map((option, index) => (index < 2 && (
                                    <Badge key={option.select_value} variant="outline" className="font-normal">{option.select_title}</Badge>
                                )))
                            }

                            {/* filter more than 2 */}
                            {selected.length > 2 && <Badge variant="secondary" className="font-normal">+ {selected.length - 2}</Badge>}
                        </>
                    )}
                    {selected.length == 0 && <p className="text-xs">Nessun elemento selezionato</p>}
                </div>

                {clearSelections && selected.length > 0 && (
                    <Button onClick={clearSelections} size="sm" className="px-2" variant="destructive">
                        <Trash className="size-4" />
                    </Button>
                )}
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">Seleziona elementi</Button>
                </PopoverTrigger>
                <PopoverContent className="w-[335px] p-0 left-0">
                    <Command>
                        <CommandInput className="text-xs" placeholder="Cerca..." />
                        <CommandList>
                            <CommandEmpty className="text-destructive text-xs py-4 text-center">Nessun elemento trovato.</CommandEmpty>
                            <CommandGroup>
                                {options.map((el) => {
                                    return (
                                        <CommandItem className="text-xs" onSelect={toggleSelection} key={el.select_value} value={el.select_value}>
                                            <Checkbox checked={selected.includes(el.select_value)} />
                                            {el.select_title}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}