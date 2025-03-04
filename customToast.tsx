// shad
import { toast } from "sonner"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// success
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function customToastSuccess(text: string) {
    return (
        toast.success(
            text,
            { className: "!bg-green-600 !text-white !border-green-600" }
        )
    )
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// danger
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function customToastDanger(text?: string) {
    return (
        toast.error(
            text ? text : "Si è verificato un errore. Riprova.",
            { className: "!bg-destructive !text-white !border-destructive" }
        )
    )
}