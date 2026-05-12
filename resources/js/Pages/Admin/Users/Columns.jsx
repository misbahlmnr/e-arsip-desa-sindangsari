import { RoleBadge } from "@/Components/StatusBadge";
import { Button } from "@/Components/ui/button";
import { formatTanggalKalenderWib } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { Eye, Pencil, Trash2 } from "lucide-react";

/**
 * @param {{
 *   startIndex?: number;
 *   onDetail?: (row: object) => void;
 *   onEdit?: (row: object) => void;
 *   authUserId?: number;
 * }} opts
 */
export function getColumns({
    startIndex = 0,
    onDetail,
    onEdit,
    authUserId,
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
            accessorKey: "name",
            header: "Nama",
            cell: ({ row }) => (
                <button
                    type="button"
                    className="text-sm font-semibold text-primary hover:underline text-left"
                    onClick={() => onDetail?.(row.original)}
                >
                    {row.original.name}
                </button>
            ),
        },
        {
            accessorKey: "username",
            header: "Username",
            cell: ({ row }) => (
                <span className="font-mono text-sm text-muted-foreground">
                    {row.original.username}
                </span>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <span
                    title={row.original.email}
                    className="truncate text-sm font-medium inline-block max-w-[220px]"
                >
                    {row.original.email}
                </span>
            ),
        },
        {
            accessorKey: "role",
            header: "Peran",
            cell: ({ row }) => <RoleBadge role={row.original.role} />,
        },
        {
            accessorKey: "created_at",
            header: "Terdaftar",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                    {row.original.created_at
                        ? formatTanggalKalenderWib(row.original.created_at)
                        : "—"}
                </span>
            ),
        },
        {
            id: "actions",
            enableSorting: false,
            header: <div className="text-center">Aksi</div>,
            cell: ({ row }) => {
                const isSelf = authUserId === row.original.id;

                const handleDelete = () => {
                    const ok = confirm(
                        "Apakah Anda yakin ingin menghapus pengguna ini?",
                    );
                    if (!ok) return;
                    router.delete(
                        route("admin.users.destroy", {
                            user: row.original.id,
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
                            className="size-9 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                            aria-label="Hapus"
                            disabled={isSelf}
                            title={
                                isSelf
                                    ? "Tidak dapat menghapus akun sendiri"
                                    : undefined
                            }
                            onClick={handleDelete}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];
}
