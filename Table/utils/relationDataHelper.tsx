export function buildRelationData(
    tableName: string,
    filters: { [key: string]: any },
    relationships: { [key: string]: { [key: string]: string } }
): { [key: string]: string | string[] } {
    const relationData: { [key: string]: string | string[] } = {}

    if (relationships?.[tableName]) {
        Object.entries(filters).forEach(([key, value]) => {
            if (relationships[tableName][key]) {
                relationData[relationships[tableName][key]] = Array.isArray(value)
                    ? value.map(String)
                    : String(value)
            }
        })
    }

    return relationData
}