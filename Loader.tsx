// icons
import { Loader2 } from "lucide-react"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function Loader({ size = "md", color = "primary" }) {
    return (
        <div className={`flex items-center gap-2 ${color == 'primary' ? "text-primary" : "text-white"} ${size == 'sm' && 'text-xs'}`}>
            <Loader2 className="size-4 animate-spin" />
            Caricamento...
        </div>
    )
}