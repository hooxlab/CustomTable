import { useMemo } from "react"

// shad
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// axios
import { apiClient } from "@/utils/interseptor"

// query
import { useQuery } from '@tanstack/react-query'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export interface dataProps {
    select_value: string;
    select_title: string;
}

export interface CustomSingleSelectProps {
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

export default function CustomSingleSelect({ selected, onChange, values, url }: CustomSingleSelectProps) {

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

    const options = useMemo<dataProps[]>(() => {
        if (!url && values) return values
        return data
    }, [data])

    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        code
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

    return (
        <Select
            value={selected.name}
            onValueChange={() => onChange}
        >
            <SelectTrigger className="text-xs w-full">
                <SelectValue placeholder="Seleziona elementi" />
            </SelectTrigger>
            <SelectContent>
                {options?.map((option) => (
                    <SelectItem key={option.select_value} value={option.select_value}>
                        {option.select_title}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}