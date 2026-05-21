import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";

import { formatTanggalKalenderWib } from "@/shared/lib/utils";
import { router } from "@inertiajs/react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const STATUS_LABEL_MAP = {
    draft: "Draft",
    terkirim: "Terkirim",
};

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
            header: "No.",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground tabular-nums">
                    {startIndex + row.index + 1}
                </span>
            ),
        },
        {
            accessorKey: "no_surat",
            header: "Nomor Surat",
            cell: ({ row }) => (
                <button
                    type="button"
                    className="font-mono text-sm font-semibold text-primary hover:underline"
                    onClick={() => onDetail?.(row.original)}
                >
                    {row.original.no_surat}
                </button>
            ),
        },
        {
            accessorKey: "tanggal_kirim",
            header: "Tgl Surat",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                    {formatTanggalKalenderWib(row.original.tanggal_kirim)}
                </span>
            ),
        },
        {
            accessorKey: "tujuan",
            header: "Tujuan",
            cell: ({ row }) => (
                <span
                    title={row.original.tujuan}
                    className="truncate text-sm font-medium inline-block"
                >
                    {row.original.tujuan}
                </span>
            ),
        },
        {
            accessorKey: "perihal",
            header: "Perihal",
            cell: ({ row }) => (
                <span
                    title={row.original.perihal}
                    className="truncate text-sm font-medium inline-block"
                >
                    {row.original.perihal}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <StatusBadge
                    status={
                        STATUS_LABEL_MAP[row.original.status] ??
                        row.original.status
                    }
                />
            ),
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
                        route("admin.surat-keluar.destroy", {
                            surat_keluar: row.original.id,
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
