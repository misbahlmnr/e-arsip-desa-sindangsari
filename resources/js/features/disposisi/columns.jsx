import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
    badgeLabel,
    SURAT_MASUK_STATUS_LABELS,
} from "@/shared/constants/badgeLabels";
import { formatTanggalKalenderWib } from "@/shared/lib/utils";
import { Eye } from "lucide-react";

/**
 * @param {{
 *   startIndex?: number;
 *   onDetail?: (row: object) => void;
 * }} opts
 */
export function getColumns({ startIndex = 0, onDetail } = {}) {
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
            accessorKey: "no_surat",
            header: "Nomor Surat",
            cell: ({ row }) => (
                <button
                    type="button"
                    className="font-mono text-sm font-semibold text-primary hover:underline"
                    onClick={() => onDetail?.(row.original)}
                >
                    {row.original.no_surat ?? "—"}
                </button>
            ),
        },
        {
            accessorKey: "dari_jabatan",
            header: "Dari",
            cell: ({ row }) => (
                <span className="text-sm font-medium">
                    {row.original.dari_jabatan}
                </span>
            ),
        },
        {
            accessorKey: "kepada",
            header: "Kepada",
            cell: ({ row }) => (
                <span className="text-sm">{row.original.kepada}</span>
            ),
        },
        {
            accessorKey: "catatan",
            header: "Catatan",
            cell: ({ row }) => (
                <span
                    className="text-sm max-w-[240px] truncate inline-block text-muted-foreground"
                    title={row.original.catatan}
                >
                    {row.original.catatan}
                </span>
            ),
        },
        {
            accessorKey: "tanggal",
            header: "Tanggal",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                    {row.original.tanggal
                        ? formatTanggalKalenderWib(row.original.tanggal)
                        : "—"}
                </span>
            ),
        },
        {
            accessorKey: "surat_status",
            header: "Status Surat",
            cell: ({ row }) => (
                <StatusBadge
                    value={row.original.surat_status}
                    label={badgeLabel(
                        SURAT_MASUK_STATUS_LABELS,
                        row.original.surat_status,
                    )}
                />
            ),
        },
        {
            id: "actions",
            enableSorting: false,
            header: <div className="text-center">Aksi</div>,
            cell: ({ row }) => (
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
                </div>
            ),
        },
    ];
}
