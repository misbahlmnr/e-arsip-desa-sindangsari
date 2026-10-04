import AppLayout from "@/layouts/AppLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Archive } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable/Index";
import { useServerTable } from "@/shared/hooks/useServerTable";
import { getColumns } from "../columns";

export default function SuratKeluar({ letters, filters }) {
    const canManageSurat = usePage().props.auth.canManageSurat;
    const { loading, searchInput, setSearchInput, visit, openFromList } =
        useServerTable({
        routeName: "admin.surat-keluar.index",
        filters,
        searchDebounceMs: 400,
        preserveQueryKeys: [
            "tahun",
            "bulan",
            "tanggal",
            "perihal",
            "tujuan",
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
            route("admin.surat-keluar.archive-selected"),
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
                        route("admin.surat-keluar.show", {
                            surat_keluar: row.id,
                        }),
                    ),
                onEdit: (row) =>
                    openFromList(
                        route("admin.surat-keluar.edit", {
                            surat_keluar: row.id,
                        }),
                    ),
            }),
        [startIndex, canManageSurat, openFromList, selectedIds, pageIds],
    );

    return (
        <AppLayout
            title="Surat Keluar"
            subtitle="Daftar seluruh surat yang dikirim oleh kantor desa."
        >
            <Head title="Surat Keluar" />

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
                                openFromList(route("admin.surat-keluar.create"))
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
                        searchPlaceholder="Cari nomor agenda, nomor surat, perihal, atau tujuan..."
                        emptyMessage="Coba ubah kata kunci pencarian."
                    />
                </motion.div>
            </div>
        </AppLayout>
    );
}
