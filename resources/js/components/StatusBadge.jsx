import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/lib/utils";

const STATUS_STYLES = {
    draft: "bg-muted text-muted-foreground border-border",
    terverifikasi: "bg-info-soft text-info border-info/20",
    didisposisikan: "bg-success-soft text-success border-success/20",
    diarsipkan: "bg-success-soft text-success border-success/20",
    terkirim: "bg-success-soft text-success border-success/20",
    biasa: "bg-muted text-muted-foreground border-border",
    penting: "bg-destructive/10 text-destructive border-destructive/20",
    menunggu_review_sekdes: "bg-muted text-muted-foreground border-border",
    direview_sekdes: "bg-info-soft text-info border-info/20",
    menunggu_verifikasi_kades:
        "bg-warning-soft text-warning border-warning/20",
    siap_disposisi_kades: "bg-info-soft text-info border-info/20",
    menunggu_verifikasi: "bg-warning-soft text-warning border-warning/20",
    siap_disposisi: "bg-info-soft text-info border-info/20",
};

/** Semua style badge disposisi: flag (belum/sudah) + status alur */
const DISPOSISI_STYLES = {
    belum: "bg-muted text-muted-foreground border-border",
    sudah: "bg-success-soft text-success border-success/20",
    menunggu: "bg-orange-100 text-orange-800 border-orange-200",
    diproses: "bg-warning-soft text-warning border-warning/20",
    selesai: "bg-success-soft text-success border-success/20",
};

const ROLE_STYLES = {
    admin: "bg-primary/10 text-primary border-primary/20",
    sekdes: "bg-info-soft text-info border-info/20",
    kades: "bg-warning-soft text-warning border-warning/20",
};

const FALLBACK_STYLE = "bg-muted text-muted-foreground border-border";

function OutlineBadge({ value, label, styleMap, className }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "font-medium rounded-full px-2.5 py-0.5",
                styleMap[value] ?? FALLBACK_STYLE,
                className,
            )}
        >
            {label}
        </Badge>
    );
}

export function RoleBadge({ value, label }) {
    return (
        <OutlineBadge
            value={value}
            label={label}
            styleMap={ROLE_STYLES}
            className="font-semibold border"
        />
    );
}

export function StatusBadge({ value, label }) {
    return (
        <OutlineBadge
            value={value}
            label={label}
            styleMap={STATUS_STYLES}
            className="font-semibold"
        />
    );
}

export function DisposisiBadge({ value, label }) {
    return (
        <OutlineBadge value={value} label={label} styleMap={DISPOSISI_STYLES} />
    );
}
