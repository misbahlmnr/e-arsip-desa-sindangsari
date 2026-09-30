import { Button } from "@/components/ui/button";
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
            id: "actions",
            enableSorting: false,
            header: <div className="text-center">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-9"
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
