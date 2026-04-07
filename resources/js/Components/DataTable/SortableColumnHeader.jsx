import { Button } from "@/Components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export function SortableColumnHeader({ column, title }) {
    const sorted = column.getIsSorted();
    return (
        <Button
            type="button"
            variant="ghost"
            className="-ml-3 h-8 px-2 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting()}
        >
            {title}
            {sorted === "desc" ? (
                <ArrowDown className="ml-1 h-4 w-4" />
            ) : sorted === "asc" ? (
                <ArrowUp className="ml-1 h-4 w-4" />
            ) : (
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
            )}
        </Button>
    );
}
