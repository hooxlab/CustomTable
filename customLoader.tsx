// icons
import { Loader2 } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function CustomLoader({ size = "md" }) {
    return (
        <div className={`flex items-center gap-2 text-primary ${size == 'sm' && 'text-xs'}`}>
            <Loader2 className="size-4 animate-spin" />
            Caricamento...
        </div>
    )
}