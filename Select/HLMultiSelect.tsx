import { useMemo } from "react"

// shad
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger
} from "@/components/ui/multiselector.tsx"


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

export interface HLMultiSelectProps {

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
    selected: string[];
    onChange: (value: string[]) => void;

    // form
    onBlur?: () => void;

    // api or fixed data
    url?: string;
    values?: dataProps[]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function HLMultiSelect({
    placeholder = "Seleziona elementi",
    className,
    general,
    selected,
    onChange,
    values,
    url,
    disabled = false
}: HLMultiSelectProps) {

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
        console.log(data?.results);
        const opz = data ? data.results.map((el: { [key: string]: any }) => (
            { select_value: String(el[general.value || "select_value"]), select_title: el[general.title || "select_title"] }
        )) : []
        return opz
    }, [data])

    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        code
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

    return (
        <MultiSelector
            values={selected}
            onValuesChange={onChange}
            loop
        >
            <MultiSelectorTrigger className={`text-xs h-8 w-full rounded-sm ${className}`}>
                <MultiSelectorInput placeholder={placeholder} />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
                <MultiSelectorList>
                    {isLoading && (
                        <div className="p-2">
                            <Loader size="sm" />
                        </div>
                    )}
                    {!isLoading && options?.map((option) => (
                        <MultiSelectorItem key={String(option.select_value)} value={option.select_value}>
                            {option.select_title}
                        </MultiSelectorItem>
                    ))}
                </MultiSelectorList>
            </MultiSelectorContent>
        </MultiSelector>
    )
}