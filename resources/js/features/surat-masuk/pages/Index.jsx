import { AgendaSearchFields } from "@/components/AgendaSearchFields";
import AppLayout from "@/layouts/AppLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable/Index";
import { useServerTable } from "@/shared/hooks/useServerTable";
import { getColumns } from "../columns";

export default function SuratMasuk({ letters, filters }) {
    const canManageSurat = usePage().props.auth.canManageSurat;
    const [selectedIds, setSelectedIds] = useState([]);
    const { loading, searchInput, setSearchInput, visit } = useServerTable({
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
            "perihal",
            "pengirim",
        ],
    });
    const startIndex =
        ((letters?.current_page ?? 1) - 1) * (letters?.per_page ?? 10);

    const columns = useMemo(
        () =>
            getColumns({
                startIndex,
                canManage: canManageSurat,
                selection: canManageSurat
                    ? {
                          ids: selectedIds,
                          allChecked:
                              (letters?.data ?? []).length > 0 &&
                              (letters?.data ?? []).every((row) =>
                                  selectedIds.includes(row.id),
                              ),
                          onToggleAll: () => {
                              const pageIds = (letters?.data ?? []).map(
                                  (row) => row.id,
                              );
                              const allOn = pageIds.every((id) =>
                                  selectedIds.includes(id),
                              );
                              setSelectedIds(allOn ? [] : pageIds);
                          },
                          onToggle: (id) =>
                              setSelectedIds((current) =>
                                  current.includes(id)
                                      ? current.filter((item) => item !== id)
                                      : [...current, id],
                              ),
                      }
                    : null,
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
        [startIndex, canManageSurat, selectedIds, letters?.data],
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
                        searchPlaceholder="Cari nomor agenda, nomor surat, perihal, atau pengirim…"
                        emptyMessage="Coba ubah kata kunci pencarian."
                        toolbarActions={
                            canManageSurat && selectedIds.length > 0 ? (
                                <Button
                                    className="rounded-xl"
                                    onClick={() =>
                                        router.patch(
                                            route(
                                                "admin.surat-masuk.archive-selected",
                                            ),
                                            { ids: selectedIds },
                                            {
                                                preserveScroll: true,
                                                onSuccess: () =>
                                                    setSelectedIds([]),
                                            },
                                        )
                                    }
                                >
                                    Arsipkan terpilih ({selectedIds.length})
                                </Button>
                            ) : null
                        }
                        belowToolbar={
                            <AgendaSearchFields
                                filters={filters}
                                visit={visit}
                                partyKey="pengirim"
                                partyLabel="Pengirim"
                            />
                        }
                    />
                </motion.div>
            </div>
        </AppLayout>
    );
}
