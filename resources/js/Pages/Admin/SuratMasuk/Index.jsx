import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "@/Components/ui/button";
import FormModalSuratMasuk from "./FormModalSuratMasuk";
import { getColumns } from "./columns";
import { SuratMasukTable } from "./SuratMasukTable";
import { useServerTable } from "@/hooks/useServerTable";

export default function SuratMasuk({ letters, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { loading, searchInput, setSearchInput, visit } = useServerTable({
        routeName: "admin.surat-masuk.index",
        filters,
        searchDebounceMs: 400,
    });

    const columns = useMemo(
        () =>
            getColumns({
                startIndex:
                    ((letters?.current_page ?? 1) - 1) *
                    (letters?.per_page ?? 10),
            }),
        [letters?.current_page, letters?.per_page],
    );

    return (
        <AppLayout>
            <Head title="Surat Masuk" />

            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Surat Masuk
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelola dan pantau semua surat masuk dengan mudah
                        </p>
                    </div>

                    <Button onClick={() => setIsModalOpen(true)}>
                        Tambah Surat
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <SuratMasukTable
                        letters={letters}
                        filters={filters}
                        columns={columns}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        loading={loading}
                        visit={visit}
                    />
                </motion.div>
            </div>

            <FormModalSuratMasuk
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </AppLayout>
    );
}
