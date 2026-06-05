import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/DataTable/Index";
import { useServerTable } from "@/shared/hooks/useServerTable";
import { Head, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { getColumns } from "../columns";

const SORT_DEFAULT = { sort_by: "name", sort_dir: "asc" };

export default function UsersIndex({ users, filters }) {
    const {
        props: { auth },
    } = usePage();
    const authUserId = auth?.user?.id;

    const { loading, searchInput, setSearchInput, visit } = useServerTable({
        routeName: "admin.users.index",
        filters,
        searchDebounceMs: 400,
        preserveQueryKeys: ["role"],
    });
    const startIndex =
        ((users?.current_page ?? 1) - 1) * (users?.per_page ?? 10);

    const columns = useMemo(
        () =>
            getColumns({
                startIndex,
                authUserId,
                onDetail: (row) =>
                    router.visit(
                        route("admin.users.show", { user: row.id }),
                    ),
                onEdit: (row) =>
                    router.visit(
                        route("admin.users.edit", { user: row.id }),
                    ),
            }),
        [startIndex, authUserId],
    );

    const roleValue = filters?.role ?? "all";

    return (
        <AppLayout
            title="Manajemen User"
            subtitle="Daftar akun pengguna sistem e-arsip desa."
        >
            <Head title="Manajemen User" />

            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-end"
                >
                    <Button
                        size="lg"
                        onClick={() =>
                            router.visit(route("admin.users.create"))
                        }
                    >
                        Tambah Pengguna
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <DataTable
                        columns={columns}
                        pagination={users}
                        filters={filters}
                        visit={visit}
                        searchInput={searchInput}
                        onSearchInputChange={setSearchInput}
                        loading={loading}
                        searchPlaceholder="Cari nama, username, atau email…"
                        emptyMessage="Coba ubah kata kunci pencarian atau filter peran."
                        serverSortClearDefaults={SORT_DEFAULT}
                        toolbarFilters={
                            <Select
                                value={roleValue}
                                onValueChange={(v) =>
                                    visit({
                                        page: 1,
                                        role: v === "all" ? "" : v,
                                        search: filters?.search,
                                        sort_by: filters?.sort_by,
                                        sort_dir: filters?.sort_dir,
                                        per_page: filters?.per_page,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full sm:w-52 h-11 rounded-xl">
                                    <SelectValue placeholder="Filter peran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua peran
                                    </SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="sekdes">
                                        Sekretaris Desa
                                    </SelectItem>
                                    <SelectItem value="kades">
                                        Kepala Desa
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        }
                    />
                </motion.div>
            </div>
        </AppLayout>
    );
}
