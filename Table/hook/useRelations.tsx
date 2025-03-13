import { useMemo, useCallback } from "react"

// table
import { Row } from "@tanstack/react-table"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// intefrace
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface RelationsProps {

    // globar
    relationships: { [key: string]: { [key: string]: string; } }
    filters: { [key: string]: any };
    tableName: string;

    // checked and set
    active?: boolean;
    filterName?: string;
    primaryKey?: string;

    // set
    setFilters?: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function useRelations<T>({
    relationships,
    tableName,
    filters,

    active,
    primaryKey,
    filterName,

    setFilters
}: RelationsProps) {

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // list filter
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const relationData = useMemo(() => {
        const data: { [key: string]: string | string[] } = {}
        if (relationships?.[tableName]) {
            Object.entries(filters).forEach(([key, value]) => {
                if (relationships[tableName][key]) {
                    data[relationships[tableName][key]] = Array.isArray(value) ? value.map(String) : String(value)
                }
            })
        }
        return data
    }, [relationships, tableName, filters])

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // checked filter
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const checkedFilter = useCallback((row: Row<T>) => {
        console.log(filterName)
        if (active && filterName && primaryKey) {
            if (filters[filterName] && filters[filterName].includes(String((row.original as { [key: string]: any })[primaryKey]))) return true
            return false
        }
        return false
    }, [filters, filterName, active, primaryKey])

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // set filter
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const relationshipsFilter = useCallback((row: Row<T>) => {
        if (active && filterName && primaryKey && setFilters) {
            setFilters((prev) => {
                const element = String((row.original as { [key: string]: any })[primaryKey])
                const currentArray = prev[filterName] || []
                const newArray = currentArray.includes(element) ? currentArray.filter((item: string) => item !== element) : [...currentArray, element]

                if (newArray.length === 0) {
                    const newFilters = { ...prev }
                    delete newFilters[filterName]
                    return newFilters
                } else return { ...prev, [filterName]: newArray }
            })
        }
    }, [filters, filterName, active, primaryKey, setFilters])

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // export
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    return { relationData, checkedFilter, relationshipsFilter }
}