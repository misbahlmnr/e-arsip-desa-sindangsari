import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "@/Components/ui/button";
import { DataTable } from "@/Components/DataTable/Index";
import FormModalSuratMasuk from "./FormModalSuratMasuk";
import DetailModalSuratMasuk from "./DetailModalSuratMasuk";
import { useServerTable } from "@/Hooks/useServerTable";
import { getColumns } from "./columns";

export default function SuratMasuk({ letters, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLetter, setEditingLetter] = useState(null);
    const [detailLetter, setDetailLetter] = useState(null);

    const closeFormModal = () => {
        setIsModalOpen(false);
        setEditingLetter(null);
    };

    const { loading, searchInput, setSearchInput, visit } = useServerTable({
        routeName: "admin.surat-masuk.index",
        filters,
        searchDebounceMs: 400,
    });
    const startIndex =
        ((letters?.current_page ?? 1) - 1) * (letters?.per_page ?? 10);

    const columns = useMemo(
        () =>
            getColumns({
                startIndex,
                onDetail: (row) => setDetailLetter(row),
                onEdit: (row) => {
                    setEditingLetter(row);
                    setIsModalOpen(true);
                },
            }),
        [startIndex],
    );

    return (
        <AppLayout
            title="Surat Masuk"
            subtitle="Daftar seluruh surat yang diterima oleh kantor desa."
        >
            <Head title="Surat Masuk" />

            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-end"
                >
                    <Button
                        onClick={() => {
                            setEditingLetter(null);
                            setIsModalOpen(true);
                        }}
                    >
                        Tambah Surat
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <DataTable
                        columns={columns}
                        pagination={letters}
                        filters={filters}
                        visit={visit}
                        searchInput={searchInput}
                        onSearchInputChange={setSearchInput}
                        loading={loading}
                        searchPlaceholder="Cari nomor, pengirim, atau perihal..."
                        emptyMessage="Coba ubah kata kunci pencarian."
                    />
                </motion.div>
            </div>

            <FormModalSuratMasuk
                isOpen={isModalOpen}
                onClose={closeFormModal}
                letter={editingLetter}
            />

            <DetailModalSuratMasuk
                letter={detailLetter}
                onClose={() => setDetailLetter(null)}
            />
        </AppLayout>
    );
}
