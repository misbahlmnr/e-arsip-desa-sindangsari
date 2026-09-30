import { DataTable } from "@/components/DataTable/Index";
import AppLayout from "@/layouts/AppLayout";
import { useServerTable } from "@/shared/hooks/useServerTable";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { getColumns } from "../columns";

export default function DisposisiIndex({ disposisi, filters }) {
    const { loading, searchInput, setSearchInput, visit, openFromList } =
        useServerTable({
        routeName: "admin.disposisi.index",
        filters,
        searchDebounceMs: 400,
    });
    const startIndex =
        ((disposisi?.current_page ?? 1) - 1) * (disposisi?.per_page ?? 10);

    const columns = useMemo(
        () =>
            getColumns({
                startIndex,
                onDetail: (row) =>
                    openFromList(
                        route("admin.disposisi.show", {
                            disposisi: row.id,
                        }),
                    ),
            }),
        [startIndex, openFromList],
    );

    return (
        <AppLayout
            title="Disposisi"
            subtitle="Instruksi surat yang sudah didisposisikan dan belum diarsipkan."
        >
            <Head title="Disposisi" />

            <div className="space-y-6">
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
                    />
                </motion.div>
            </div>
        </AppLayout>
    );
}
