import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/lib/utils";

const STATUS_STYLES = {
    belum_diproses: "bg-yellow-100 text-yellow-800",
    sedang_diproses: "bg-warning-soft text-warning border-warning/20",
    selesai: "bg-success-soft text-success border-success/20",
    draft: "bg-muted text-muted-foreground border-border",
    terkirim: "bg-success-soft text-success border-success/20",
};

const DISPO_STYLES = {
    belum: "bg-muted text-muted-foreground border-border",
    sudah: "bg-success-soft text-success border-success/20",
};

const ROLE_STYLES = {
    admin: "bg-primary/10 text-primary border-primary/20",
    sekdes: "bg-info-soft text-info border-info/20",
    kades: "bg-warning-soft text-warning border-warning/20",
};

export function RoleBadge({ value, label }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "font-semibold rounded-full px-2.5 py-0.5 border",
                ROLE_STYLES[value] ??
                    "bg-muted text-muted-foreground border-border",
            )}
        >
            {label}
        </Badge>
    );
}

export function StatusBadge({ value, label }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "font-semibold rounded-full px-2.5 py-0.5",
                STATUS_STYLES[value],
            )}
        >
            {label}
        </Badge>
    );
}

export function DisposisiBadge({ value, label }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "font-medium rounded-full px-2.5 py-0.5",
                DISPO_STYLES[value],
            )}
        >
            {label}
        </Badge>
    );
}
