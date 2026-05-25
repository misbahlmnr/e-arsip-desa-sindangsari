import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/DataTable/Index";
import AppLayout from "@/layouts/AppLayout";
import { useServerTable } from "@/shared/hooks/useServerTable";
import { Head, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { getColumns } from "../columns";

const STATUS_FILTER_OPTIONS = [
    { value: "all", label: "Semua status" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diproses", label: "Diproses" },
    { value: "selesai", label: "Selesai" },
];

export default function DisposisiIndex({ disposisi, filters }) {
    const { loading, searchInput, setSearchInput, visit } = useServerTable({
        routeName: "admin.disposisi.index",
        filters,
        searchDebounceMs: 400,
        preserveQueryKeys: ["status"],
    });
    const startIndex =
        ((disposisi?.current_page ?? 1) - 1) * (disposisi?.per_page ?? 10);

    const columns = useMemo(
        () =>
            getColumns({
                startIndex,
                onDetail: (row) =>
                    router.visit(
                        route("admin.disposisi.show", {
                            disposisi: row.id,
                        }),
                    ),
            }),
        [startIndex],
    );

    const statusValue = filters?.status || "all";

    return (
        <AppLayout
            title="Disposisi"
            subtitle="Kelola instruksi dan arahan antar pejabat desa."
        >
            <Head title="Disposisi" />

            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <Select
                        value={statusValue}
                        onValueChange={(v) =>
                            visit({
                                page: 1,
                                status: v === "all" ? "" : v,
                                search: filters?.search,
                                sort_by: filters?.sort_by,
                                sort_dir: filters?.sort_dir,
                                per_page: filters?.per_page,
                            })
                        }
                    >
                        <SelectTrigger className="w-full sm:w-52 h-11 rounded-xl">
                            <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_FILTER_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        size="lg"
                        className="shrink-0"
                        onClick={() =>
                            router.visit(route("admin.disposisi.create"))
                        }
                    >
                        Buat Disposisi
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <DataTable
                        columns={columns}
                        pagination={disposisi}
                        filters={filters}
                        visit={visit}
                        searchInput={searchInput}
                        onSearchInputChange={setSearchInput}
                        loading={loading}
                        searchPlaceholder="Cari nomor surat, pengirim, penerima, atau catatan…"
                        emptyMessage="Belum ada disposisi. Buat disposisi baru untuk memulai."
                    />
                </motion.div>
            </div>
        </AppLayout>
    );
}
