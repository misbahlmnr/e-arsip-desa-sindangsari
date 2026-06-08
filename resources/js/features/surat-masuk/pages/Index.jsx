import AppLayout from "@/layouts/AppLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable/Index";
import { useServerTable } from "@/shared/hooks/useServerTable";
import { getColumns } from "../columns";

export default function SuratMasuk({ letters, filters }) {
    const canManageSurat = usePage().props.auth.canManageSurat;
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
                canManage: canManageSurat,
                onDetail: (row) =>
                    router.visit(
                        route("admin.surat-masuk.show", {
                            surat_masuk: row.id,
                        }),
                    ),
                onEdit: (row) =>
                    router.visit(
                        route("admin.surat-masuk.edit", {
                            surat_masuk: row.id,
                        }),
                    ),
            }),
        [startIndex, canManageSurat],
    );

    return (
        <AppLayout
            title="Surat Masuk"
            subtitle="Daftar seluruh surat yang diterima oleh kantor desa."
        >
            <Head title="Surat Masuk" />

            <div className="space-y-8">
                {canManageSurat && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-end"
                    >
                        <Button
                            size="lg"
                            onClick={() =>
                                router.visit(route("admin.surat-masuk.create"))
                            }
                        >
                            Tambah Surat
                        </Button>
                    </motion.div>
                )}

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
                        searchPlaceholder="Cari nomor surat…"
                        emptyMessage="Coba ubah kata kunci pencarian."
                    />
                </motion.div>
            </div>
        </AppLayout>
    );
}
