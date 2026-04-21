import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { cn, formatTanggalKalenderWib } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { SortableColumnHeader } from "@/Components/DataTable/SortableColumnHeader";
import { router } from "@inertiajs/react";

const STATUS_CONFIG = {
    belum_diproses: {
        label: "Belum Diproses",
        className: "bg-yellow-100 text-yellow-800",
    },
    sedang_diproses: {
        label: "Sedang Diproses",
        className: "bg-blue-100 text-blue-800",
    },
    selesai: {
        label: "Selesai",
        className: "bg-green-100 text-green-800",
    },
};

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
            accessorKey: "nomor_registrasi",
            header: ({ column }) => (
                <SortableColumnHeader column={column} title="No. Reg" />
            ),
            cell: ({ row }) => (
                <span className="text-xs">{row.original.nomor_registrasi}</span>
            ),
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
            accessorKey: "tanggal_terima",
            header: ({ column }) => (
                <SortableColumnHeader column={column} title="Tgl Terima" />
            ),
            cell: ({ row }) => (
                <span className="text-xs whitespace-nowrap">
                    {formatTanggalKalenderWib(row.original.tanggal_terima)}
                </span>
            ),
        },
        {
            accessorKey: "pengirim",
            header: ({ column }) => (
                <SortableColumnHeader column={column} title="Pengirim" />
            ),
            cell: ({ row }) => {
                const pengirim = row.original.pengirim;
                return (
                    <span
                        title={pengirim}
                        className="max-w-20 truncate inline-block"
                    >
                        {pengirim}
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
            accessorKey: "status",
            header: ({ column }) => (
                <SortableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const status = row.original.status;
                const statusConfig = STATUS_CONFIG[status];
                return (
                    <span
                        className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            statusConfig?.className ||
                                "bg-gray-100 text-gray-800",
                        )}
                    >
                        {statusConfig?.label ?? status}
                    </span>
                );
            },
        },
        {
            accessorKey: "tujuan",
            header: ({ column }) => (
                <SortableColumnHeader column={column} title="Tujuan" />
            ),
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
                        route("admin.surat-masuk.destroy", {
                            surat_masuk: letter.id,
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
