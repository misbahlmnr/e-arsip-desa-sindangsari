import AppLayout from "@/layouts/AppLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Archive } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable/Index";
import { useServerTable } from "@/shared/hooks/useServerTable";
import { getColumns } from "../columns";

export default function SuratMasuk({ letters, filters }) {
    const canManageSurat = usePage().props.auth.canManageSurat;
    const { loading, searchInput, setSearchInput, visit, openFromList } =
        useServerTable({
        routeName: "admin.surat-masuk.index",
        filters,
        searchDebounceMs: 400,
        preserveQueryKeys: [
            "status",
            "tingkat",
            "kades_aksi",
            "disposisi",
            "tahun",
            "bulan",
            "tanggal",
            "perihal",
            "pengirim",
        ],
    });
    const startIndex =
        ((letters?.current_page ?? 1) - 1) * (letters?.per_page ?? 10);
    const pageIds = useMemo(
        () => (letters?.data ?? []).map((row) => row.id),
        [letters?.data],
    );
    const [selectedIds, setSelectedIds] = useState([]);

    const pageKey = pageIds.join(",");

    useEffect(() => {
        setSelectedIds([]);
    }, [pageKey]);

    const toggleRow = (id) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((selectedId) => selectedId !== id)
                : [...current, id],
        );
    };

    const togglePage = () => {
        setSelectedIds((current) => {
            const allSelected = pageIds.every((id) => current.includes(id));

            return allSelected ? [] : pageIds;
        });
    };

    const archiveSelected = () => {
        if (selectedIds.length === 0) {
            return;
        }

        const ok = confirm(
            `Arsipkan ${selectedIds.length} surat yang dipilih?`,
        );
        if (!ok) {
            return;
        }

        router.patch(
            route("admin.surat-masuk.archive-selected"),
            { ids: selectedIds },
            { preserveScroll: true },
        );
    };

    const columns = useMemo(
        () =>
            getColumns({
                startIndex,
                canManage: canManageSurat,
                selectedIds,
                pageIds,
                onToggleRow: toggleRow,
                onTogglePage: togglePage,
                onDetail: (row) =>
                    openFromList(
                        route("admin.surat-masuk.show", {
                            surat_masuk: row.id,
                        }),
                    ),
                onEdit: (row) =>
                    openFromList(
                        route("admin.surat-masuk.edit", {
                            surat_masuk: row.id,
                        }),
                    ),
            }),
        [startIndex, canManageSurat, openFromList, selectedIds, pageIds],
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
                        className="flex items-center justify-end gap-3"
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            disabled={selectedIds.length === 0}
                            onClick={archiveSelected}
                        >
                            <Archive className="size-4 mr-1.5" />
                            Arsipkan yang dipilih
                        </Button>
                        <Button
                            size="lg"
                            onClick={() =>
                                openFromList(route("admin.surat-masuk.create"))
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
                        searchPlaceholder="Cari nomor agenda, nomor surat, perihal, pengirim, atau tujuan..."
                        emptyMessage="Coba ubah kata kunci pencarian."
                    />
                </motion.div>
            </div>
        </AppLayout>
    );
}
