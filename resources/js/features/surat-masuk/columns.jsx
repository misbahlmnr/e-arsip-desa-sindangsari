import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import {
    badgeLabel,
    resolveSuratMasukAlurStatus,
    SURAT_MASUK_ALUR_LABELS,
} from "@/shared/constants/badgeLabels";
import { formatTanggalKalenderWib } from "@/shared/lib/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";

/**
 * @param {{
 *   startIndex?: number;
 *   onDetail?: (row: object) => void;
 *   onEdit?: (row: object) => void;
 *   canManage?: boolean;
 * }} opts
 */
export function getColumns({
    startIndex = 0,
    onDetail,
    onEdit,
    canManage = true,
} = {}) {
    return [
        {
            id: "row_number",
            accessorKey: "no",
            enableSorting: false,
            header: "No",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground tabular-nums">
                    {startIndex + row.index + 1}
                </span>
            ),
        },
        {
            accessorKey: "nomor_agenda",
            header: "Nomor Agenda",
            cell: ({ row }) => (
                <div>
                    <button
                        type="button"
                        className="font-mono text-sm font-semibold text-primary hover:underline"
                        onClick={() => onDetail?.(row.original)}
                    >
                        {row.original.nomor_agenda ?? "—"}
                    </button>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">
                        {row.original.no_surat}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "tanggal_terima",
            header: "Tgl Diterima",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                    {formatTanggalKalenderWib(row.original.tanggal_terima)}
                </span>
            ),
        },
        {
            accessorKey: "pengirim",
            header: "Pengirim",
            cell: ({ row }) => (
                <span className="text-sm font-medium">
                    {row.original.pengirim}
                </span>
            ),
        },
        {
            accessorKey: "perihal",
            header: "Perihal",
            cell: ({ row }) => (
                <span
                    className="text-sm max-w-[280px] truncate inline-block"
                    title={row.original.perihal}
                >
                    {row.original.perihal}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const alur = resolveSuratMasukAlurStatus(row.original);
                return (
                    <StatusBadge
                        value={alur}
                        label={badgeLabel(SURAT_MASUK_ALUR_LABELS, alur)}
                    />
                );
            },
        },
        {
            id: "actions",
            enableSorting: false,
            header: <div className="text-center">Aksi</div>,
            cell: ({ row }) => {
                const handleDelete = () => {
                    const ok = confirm(
                        "Apakah Anda yakin ingin menghapus surat ini?",
                    );
                    if (!ok) return;
                    router.delete(
                        route("admin.surat-masuk.destroy", {
                            surat_masuk: row.original.id,
                        }),
                    );
                };

                return (
                    <div className="flex items-center justify-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 rounded-lg"
                            aria-label="Lihat detail"
                            onClick={() => onDetail?.(row.original)}
                        >
                            <Eye className="size-4" />
                        </Button>
                        {canManage && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-9 rounded-lg"
                                    aria-label="Edit"
                                    onClick={() => onEdit?.(row.original)}
                                >
                                    <Pencil className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-9 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                                    aria-label="Hapus"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];
}
