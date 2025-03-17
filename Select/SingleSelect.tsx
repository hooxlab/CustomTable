import { useMemo } from "react"

// shad
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// axios
import { apiClient } from "@/utils/Interceptor"

// query
import { useQuery } from '@tanstack/react-query'

// components
import Loader from "@/components/custom/CustomTable/Loader"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export interface dataProps {
    select_value: string;
    select_title: string;
}

export interface SingleSelectProps {

    // general
    placeholder?: string;

    general: {
        name: string;
        value?: string;
        title?: string
    }

    // class and disabled
    className?: string;
    disabled?: boolean;

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

export default function SingleSelect({
    placeholder = "Seleziona elementi",
    className,
    general,
    selected,
    onChange,
    values,
    url,
    disabled = false
}: SingleSelectProps) {

    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        get
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

    const getData = async () => {
        if (!url) return []
        const res = await apiClient.get(url)
        return res.data
    }

    const { data, isLoading } = useQuery({
        queryKey: [general.name],
        queryFn: getData,
        enabled: !!url
    })

    const options = useMemo<dataProps[]>(() => {
        if (!url && values) return values

        const opz = data ? data.results.map((el: { [key: string]: any }) => (
            { select_value: String(el[general.value || "select_value"]), select_title: el[general.title || "select_title"] }
        )) : []
        return opz
    }, [data])

    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        code
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

    return (
        <Select disabled={disabled} value={selected} onValueChange={(value) => onChange(value)}>
            <SelectTrigger className={`text-xs h-8 w-full ${className}`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {isLoading && (
                    <div className="p-2">
                        <Loader size="sm" />
                    </div>
                )}
                {!isLoading && options?.map((option) => (
                    <SelectItem key={String(option.select_value)} value={option.select_value}>
                        {option.select_title}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}