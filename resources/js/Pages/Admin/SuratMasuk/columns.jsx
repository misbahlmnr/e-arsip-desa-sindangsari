import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

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

export const columns = [
    {
        accessorKey: "no",
        header: "No.",
        cell: ({ row }) => {
            return <span>{row.index + 1}</span>;
        },
    },
    {
        accessorKey: "nomor_registrasi",
        header: "No. Reg",
        cell: ({ row }) => {
            return (
                <span className="text-xs">{row.original.nomor_registrasi}</span>
            );
        },
    },
    {
        accessorKey: "no_surat",
        header: "No. Surat",
        cell: ({ row }) => {
            return <span className="text-xs">{row.original.no_surat}</span>;
        },
    },
    {
        accessorKey: "tanggal_terima",
        header: "Tgl Terima",
    },
    {
        accessorKey: "pengirim",
        header: "Pengirim",
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
        header: "Perihal",
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
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusConfig = STATUS_CONFIG[status];
            return (
                <span
                    className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        statusConfig.className,
                    )}
                >
                    {statusConfig.label}
                </span>
            );
        },
    },
    {
        accessorKey: "tujuan",
        header: "Tujuan",
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const surat = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                            Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
