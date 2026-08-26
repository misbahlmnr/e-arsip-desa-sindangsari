import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable/Index";
import AppLayout from "@/layouts/AppLayout";
import { useServerTable } from "@/shared/hooks/useServerTable";
import { Head, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { getColumns } from "../columns";

const STATUS_FILTER_OPTIONS = [
    { value: "all", label: "Semua status surat" },
    { value: "didisposisikan", label: "Didisposisikan" },
    { value: "terverifikasi", label: "Terverifikasi" },
];

export default function DisposisiIndex({ disposisi, filters }) {
    const { loading, searchInput, setSearchInput, visit } = useServerTable({
        routeName: "admin.disposisi.index",
        filters,
        searchDebounceMs: 400,
        preserveQueryKeys: ["surat_status"],
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

    const statusValue = filters?.surat_status || "all";

    return (
        <AppLayout
            title="Disposisi"
            subtitle="Instruksi surat yang sudah didisposisikan dan belum diarsipkan."
        >
            <Head title="Disposisi" />

            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-end"
                >
                    <Button
                        size="lg"
                        onClick={() =>
                            router.visit(route("admin.disposisi.create"))
                        }
                    >
                        <Plus className="size-4" />
                        Buat Disposisi
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
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
                        emptyMessage="Belum ada disposisi aktif. Buat disposisi dari surat masuk, atau cek arsip untuk riwayat lama."
                        serverSortClearDefaults={{
                            sort_by: "tanggal",
                            sort_dir: "desc",
                        }}
                        toolbarFilters={
                            <Select
                                value={statusValue}
                                onValueChange={(v) =>
                                    visit({
                                        page: 1,
                                        surat_status: v === "all" ? "" : v,
                                        search: filters?.search,
                                        sort_by: filters?.sort_by,
                                        sort_dir: filters?.sort_dir,
                                        per_page: filters?.per_page,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full sm:w-52 h-11">
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_FILTER_OPTIONS.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        }
                    />
                </motion.div>
            </div>
        </AppLayout>
    );
}
