import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { motion } from "framer-motion";

export default function Index({ kelas }) {
    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
            router.delete(route("admin.kelas.destroy", id));
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Kelas" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Kelas
                    </h1>
                    <Button asChild>
                        <Link href={route("admin.kelas.create")}>
                            Tambah Kelas
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Kelas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {kelas.data?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Nama Kelas
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Tingkat
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Wali Kelas
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Dibuat
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kelas.data.map((k) => (
                                            <tr
                                                key={k.id}
                                                className="border-b hover:bg-gray-50 transition"
                                            >
                                                <td className="py-3 px-4">
                                                    {k.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {k.tingkat}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {k.wali_kelas?.name || "-"}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {new Date(
                                                        k.created_at
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "admin.kelas.edit",
                                                                    k.id
                                                                )}
                                                            >
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    k.id
                                                                )
                                                            }
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                Tidak ada data kelas.
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-6">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={kelas.prev_page_url || "#"}
                                            aria-disabled={
                                                kelas.current_page === 1
                                            }
                                            className={
                                                kelas.current_page === 1
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>

                                    {kelas.links.map((link, index) => {
                                        if (
                                            link.label === "&laquo; Previous" ||
                                            link.label === "Next &raquo;"
                                        ) {
                                            return null;
                                        }

                                        if (link.label === "...") {
                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }

                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    href={link.url || "#"}
                                                    isActive={link.active}
                                                >
                                                    {link.label}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            href={kelas.next_page_url || "#"}
                                            aria-disabled={
                                                kelas.current_page ===
                                                kelas.last_page
                                            }
                                            className={
                                                kelas.current_page ===
                                                kelas.last_page
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
