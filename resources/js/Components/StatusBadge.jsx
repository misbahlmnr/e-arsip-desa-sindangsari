import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
    Baru: "bg-info-soft text-info border-info/20",
    Diproses: "bg-warning-soft text-warning border-warning/20",
    Selesai: "bg-success-soft text-success border-success/20",
    draft: "bg-muted text-muted-foreground border-border",
    terkirim: "bg-success-soft text-success border-success/20",
};

const DISPO_STYLES = {
    Belum: "bg-muted text-muted-foreground border-border",
    Sudah: "bg-success-soft text-success border-success/20",
};

const ROLE_LABEL = {
    admin: "Admin",
    sekdes: "Sekretaris Desa",
    kades: "Kepala Desa",
};

const ROLE_STYLES = {
    Admin: "bg-primary/10 text-primary border-primary/20",
    "Sekretaris Desa": "bg-info-soft text-info border-info/20",
    "Kepala Desa": "bg-warning-soft text-warning border-warning/20",
};

export function RoleBadge({ role }) {
    const label = ROLE_LABEL[role] ?? role;
    return (
        <Badge
            variant="outline"
            className={cn(
                "font-semibold rounded-full px-2.5 py-0.5 border",
                ROLE_STYLES[label] ??
                    "bg-muted text-muted-foreground border-border",
            )}
        >
            {label}
        </Badge>
    );
}

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
