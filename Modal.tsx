'use client'

// icons
import { Settings2 } from "lucide-react"

// shad
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface ModalProps {

    // codice
    children: React.ReactNode;

    // header
    icon?: React.ReactNode;
    title: string;
    description?: string;

    // size
    size?: string;

    // open / close modal
    open: boolean;
    close?: () => void;

    // router
    navigate?: any;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Modal({
    children,

    icon,
    title,
    description,

    size = "md",

    open,
    close,
    navigate
}: ModalProps) {
    return (
        <>
            <Dialog
                open={open}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        if (close) close()
                        else navigate()
                    }
                }}
            >
                <DialogContent
                    className={`[&_.absolute.right-4.top-4]:hidden ${size == "md" && "min-w-[900px]"}`}
                    onInteractOutside={(event) => event.preventDefault()}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            {icon || <Settings2 className='size-6' />}
                            {title || "Aggiungi o aggiorna elemento"}
                        </DialogTitle>
                        <DialogDescription>
                            {description || "Compila il form per aggiungere o aggiornarne un elemento"}
                        </DialogDescription>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        </>
    )
}