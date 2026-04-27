import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
    Baru: "bg-info-soft text-info border-info/20",
    Diproses: "bg-warning-soft text-warning border-warning/20",
    Selesai: "bg-success-soft text-success border-success/20",
};

const DISPO_STYLES = {
    Belum: "bg-muted text-muted-foreground border-border",
    Sudah: "bg-success-soft text-success border-success/20",
};

export function StatusBadge({ status }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "font-semibold rounded-full px-2.5 py-0.5",
                STATUS_STYLES[status],
            )}
        >
            {status}
        </Badge>
    );
}

export function DisposisiBadge({ status }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "font-medium rounded-full px-2.5 py-0.5",
                DISPO_STYLES[status],
            )}
        >
            {status}
        </Badge>
    );
}
