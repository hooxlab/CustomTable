/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react"

// axios
import { apiClient } from "@/utils/interseptor"

// shad
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// components
import CustomModal from "@/components/custom/customModal/customModal"
import CustomTable from "@/components/custom/customTable/CustomTable"

// icons
import { Trash, Filter } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface customModalTableFilterProps {

    // table
    nameSelected?: string;
    primaryKey?: string;

    // table
    tableName: string;
    urlColumn: string;

    // filter
    selected: string[];
    toggleSelection: (element: string) => void;
    clearSelections?: () => void;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function CustomModalTableFilter({
    nameSelected,
    primaryKey,

    tableName,
    urlColumn,

    selected,
    toggleSelection,
    clearSelections
}: customModalTableFilterProps) {

    // modal
    const [modal, setModal] = useState(false)

    // elements names
    const [elementSelected, setElementSelected] = useState<string[]>([])

    // truncate text
    const truncateText = (text: string, maxLength: number): string => {
        if (text.length > maxLength) return text.slice(0, maxLength) + '...'
        return text
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // get
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // useEffect(() => {
    //     if (urlSelected && selected.length > 0 && elementSelected.length <= 0 && nameSelected) {
    //         apiClient
    //             .get(`${urlSelected}?filter_pk=${selected.join(',')}`)
    //             .then(response => {
    //                 setElementSelected([...response?.data?.results.map((el: any) => el[nameSelected])])
    //             })
    //             .catch(error => console.log(error))
    //     }
    // }, [selected, urlSelected, elementSelected, nameSelected])

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // code
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="grow p-2 border rounded-md flex items-center gap-1">
                    {selected.length > 0 ? (
                        <>
                            {elementSelected.map((el, index) => (index < 2 && <Badge key={index} variant="outline" className="font-normal">{truncateText(el, 12)}</Badge>))}

                            {/* filter more than 2 */}
                            {selected.length > 2 && <Badge variant="outline" className="font-normal">+ {selected.length - 2}</Badge>}
                        </>
                    ) : <p className="text-xs">Nessun elemento selezionato</p>}
                </div>

                {clearSelections && selected.length > 0 && (
                    <Button size="icon" variant="destructive" onClick={() => { setElementSelected([]); clearSelections() }}>
                        <Trash className="size-4" />
                    </Button>
                )}
            </div>
            <Button variant="outline" className="w-full" onClick={() => setModal(true)}>Seleziona elementi dalla tabella</Button>

            <CustomModal
                open={modal}
                customName="Filtra per tabella"
                description="Selezione i vari elementi con cui filtrare la tabella"
                icon={<Filter className="size-6" />}
                close={() => setModal(false)}
            >
                <Separator />
                <div className="flex items-center gap-2">
                    <div className="grow flex items-center gap-1">
                        {selected.length > 0 ? (
                            <>
                                {elementSelected.map((el, index) => (
                                    index < 6 && <Badge key={index} variant="outline" className="font-normal">{el}</Badge>
                                ))}

                                {/* filter more than 6 */}
                                {selected.length > 6 && <Badge variant="outline" className="font-normal">+ {selected.length - 6}</Badge>}
                            </>
                        ) : <p className="text-xs">Nessun elemento selezionato</p>}
                    </div>
                    {clearSelections && selected.length > 0 && (
                        <Button size="icon" variant="destructive" onClick={() => { setElementSelected([]); clearSelections() }}>
                            < Trash />
                        </Button>
                    )}
                </div>
                <Separator />
                <section className="overflow-hidden p-[2px]">
                    <CustomTable
                        tableName={tableName}
                        isFilter={true}
                        columns={[]}
                    />
                </section>
                <Separator />
                <div className="text-right">
                    <Button type="button" variant="default" onClick={() => setModal(false)}>Conferma selezione</Button>
                </div>
            </CustomModal>
        </div >
    )
}