import { useState } from "react"

// components
import CustomLoader from "@/components/custom/customLoader"
import CustomSelect from "@/components/custom/customSelect/CustomSelect"
import CustomSingleSelect from "@/components/custom/customSelect/customSingleSelect"
import { customToastSuccess, customToastDanger } from "@/components/custom/customToast"

// zod
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// react-form
import { useForm } from "react-hook-form"

// axios
import { apiClient } from "@/utils/interseptor"

// query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// shad
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SheetClose, SheetFooter } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// icons
import { Plus, Save, X } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export interface FilterFormProps {
    name: string;
    field_name: string;
    typology: string;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// schema
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const filterSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Inserisci un valore" })
        .max(255, { message: 'Valore troppo lungo (massimo 255 caratteri)' }),

    field_name: z
        .string()
        .min(1, { message: "Inserisci un valore" })
        .max(255, { message: 'Valore troppo lungo (massimo 255 caratteri)' }),

    typology: z
        .string()
        .email({ message: "Formato email non corretto" })
        .min(1, { message: "Inserisci la tua email" })
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function CustomTableFilterSettings() {

    // query init
    const queryClient = useQueryClient()

    // modal
    const [modal, setModal] = useState<{ open: boolean; id: number | string }>({ open: false, id: "" })

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // form
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const form = useForm<FilterFormProps>({
        resolver: zodResolver(filterSchema),
        defaultValues: { name: "", field_name: "", typology: "" },
        mode: "all"
    })

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // update
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const updateData = async (values: FilterFormProps) => {
        const res = await apiClient.put(`api/core/filter/update/`, values)
        return res.data
    }

    const mutation = useMutation({
        mutationFn: updateData,
        onSuccess: (data) => {
            // form.reset({ first_name: data.first_name, last_name: data.last_name, email: data.email })
            // queryClient.setQueryData(["profile"], data)
            customToastSuccess("Profilo aggiornato con successo!")
        },
        onError: () => { customToastDanger() }
    })

    const onSubmit = (values: FilterFormProps) => { mutation.mutate(values) }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // code
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    let isLoading = false

    if (isLoading) return <CustomLoader />

    return (
        <>
            <section className="grid grid-cols-3 gap-4 *:text-xs bg-primary text-primary-foreground mb-4 rounded-md py-2">
                <div className="pl-3">Nome</div>
                <div className="pl-3">Campo</div>
                <div>Tipologia</div>
            </section>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4">

                    {/* name */}
                    <div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Nome"
                                            className="!text-xs h-8"
                                            name={field.name}
                                            value={field.value}
                                            onChange={(e) => { field.onChange(e.target.value); form.trigger("name") }}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-4"></div>

                    <div className="col-span-4"></div>
                </form>
            </Form>

            {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                actions
            ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <Separator className="my-4" />

            <SheetFooter className="grid grid-cols-2 gap-2">
                <div>
                    <SheetClose asChild>
                        <Button size="sm" variant="destructive">
                            <X /> Annulla
                        </Button>
                    </SheetClose>
                </div>
                <section className="flex gap-2 justify-end">
                    <SheetClose asChild>
                        <Button size="sm" variant="secondary">
                            <Plus /> Aggiungi filtro
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button size="sm">
                            <Save /> Salva filtri
                        </Button>
                    </SheetClose>
                </section>
            </SheetFooter>
        </>
    )
}