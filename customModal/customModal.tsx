'use client'

// next
import { useRouter, useParams } from 'next/navigation'

// icons
import { SquarePlus, SquarePen } from "lucide-react"

// shad
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface LayoutProps {
    children: React.ReactNode;
    name?: string;
    customName?: string;
    description?: string;
    icon?: React.ReactNode;
    small?: boolean;
    id?: string;
    open?: boolean;
    close?: () => void;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function CustomModal({ children, name, customName, description, icon, id, open, close, small = false }: LayoutProps) {

    // router e params
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <Dialog
                open={typeof open !== "undefined" ? open : true}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        if (close) close()
                        else router.back()
                    }
                }}
            >
                <DialogContent
                    className={`[&_.absolute.right-4.top-4]:hidden ${!small && "min-w-[900px]"}`}
                    onInteractOutside={(event) => event.preventDefault()}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            {icon ? icon : (params.id || id) ? <SquarePen className="size-6" /> : <SquarePlus className="size-6" />}
                            {customName ? customName : `${params.id || id ? 'Modifica' : 'Aggiungi'} ${name}`}
                        </DialogTitle>
                        <DialogDescription>
                            {description ? description : params.id || id ? "Modifica i dati per aggiornare questo elemento" : "Compila il form per aggiungere il nuovo elemento"}
                        </DialogDescription>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        </>
    )
}