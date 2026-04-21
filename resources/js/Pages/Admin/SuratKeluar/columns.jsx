import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { formatTanggalKalenderWib } from "@/lib/utils";
import { MoreHorizontal, FileText } from "lucide-react";
import { SortableColumnHeader } from "@/Components/DataTable/SortableColumnHeader";
import { router } from "@inertiajs/react";

/**
 * @param {{
 *   startIndex?: number;
 *   onDetail?: (row: object) => void;
 *   onEdit?: (row: object) => void;
 * }} opts
 */
export function getColumns({ startIndex = 0, onDetail, onEdit } = {}) {
    return [
        {
            id: "row_number",
            accessorKey: "no",
            enableSorting: false,
            header: "No.",
            cell: ({ row }) => <span>{startIndex + row.index + 1}</span>,
        },
        {
            accessorKey: "no_surat",
            header: ({ column }) => (
                <SortableColumnHeader column={column} title="No. Surat" />
            ),
            cell: ({ row }) => (
                <span className="text-xs">{row.original.no_surat}</span>
            ),
        },
        {
            accessorKey: "tanggal_kirim",
            header: ({ column }) => (
                <SortableColumnHeader column={column} title="Tgl Kirim" />
            ),
            cell: ({ row }) => (
                <span className="text-xs whitespace-nowrap">
                    {formatTanggalKalenderWib(row.original.tanggal_kirim)}
                </span>
            ),
        },
        {
            accessorKey: "tujuan",
            header: ({ column }) => (
                <SortableColumnHeader column={column} title="Tujuan" />
            ),
            cell: ({ row }) => {
                const tujuan = row.original.tujuan;
                return (
                    <span
                        title={tujuan}
                        className="max-w-20 truncate inline-block"
                    >
                        {tujuan}
                    </span>
                );
            },
        },
        {
            accessorKey: "perihal",
            header: ({ column }) => (
                <SortableColumnHeader column={column} title="Perihal" />
            ),
            cell: ({ row }) => {
                const perihal = row.original.perihal;
                return (
                    <span
                        title={perihal}
                        className="max-w-20 truncate inline-block"
                    >
                        {perihal}
                    </span>
                );
            },
        },
        {
            accessorKey: "file",
            enableSorting: false,
            header: "File",
            cell: ({ row }) => {
                const file = row.original.file;
                if (!file) {
                    return <span className="text-xs text-gray-400">-</span>;
                }
                return (
                    <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        <FileText className="h-3.5 w-3.5" />
                        Lihat File
                    </a>
                );
            },
        },
        {
            id: "actions",
            enableSorting: false,
            header: "Aksi",
            cell: ({ row }) => {
                const handleDelete = (letter) => {
                    if (!letter?.id) {
                        return;
                    }
                    router.delete(
                        route("admin.surat-keluar.destroy", {
                            surat_keluar: letter.id,
                        }),
                    );
                };

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => onDetail?.(row.original)}
                            >
                                Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onEdit?.(row.original)}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-500"
                                onClick={() =>
                                    confirm(
                                        "Apakah Anda yakin ingin menghapus surat ini?",
                                    )
                                        ? handleDelete(row.original)
                                        : null
                                }
                            >
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
