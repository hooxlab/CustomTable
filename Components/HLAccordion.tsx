import { useMemo } from "react"

// shad
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


// axios
import { apiClient } from "@/utils/Interceptor"

// query
import { useQuery } from '@tanstack/react-query'
import { Filter } from "lucide-react";
import HTable from "../Table/HTable";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export interface HLAccordionProps {

    // general
    title: string;
    name: string;

    // class and disabled
    className?: string;

    // icon
    icon?: React.ReactNode;

    // content
    content: React.ReactNode;
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function HLAccordion({
    title,
    className,
    name,
    icon,
    content
}: HLAccordionProps) {

   
    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        code
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

    return (
        <Accordion type="single" className={`border-0 ${className}`} collapsible>
            <AccordionItem value={name} className="border-0">
                <AccordionTrigger className="p-2 rounded-t-md h-[32px] bg-background data-[state=closed]:rounded-md hover:no-underline">
                    <span className="text-primary flex gap-2 items-center">
                        {icon && icon}
                        <div>{title}</div>
                    </span>
                </AccordionTrigger>
                <AccordionContent className="bg-white px-2 rounded-b-md">
                    {content}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}