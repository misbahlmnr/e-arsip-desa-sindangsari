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

export default function Index({ gurus }) {
    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus guru ini?")) {
            router.delete(route("admin.manajemen-user.gurus.destroy", id));
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Guru" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Guru
                    </h1>
                    <Button asChild>
                        <Link href={route("admin.manajemen-user.gurus.create")}>
                            Tambah Guru
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Guru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {gurus.data?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Nama
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Email
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Mata Pelajaran
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Dibuat
                                            </th>
                                            <th className="text-left py-3 px-4 text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gurus.data.map((guru) => (
                                            <tr
                                                key={guru.id}
                                                className="border-b hover:bg-gray-50 transition"
                                            >
                                                <td className="py-3 px-4">
                                                    {guru.name}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {guru.email}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {guru.mapels?.length > 0
                                                        ? guru.mapels
                                                              .map(
                                                                  (mapel) =>
                                                                      mapel.nama
                                                              )
                                                              .join(", ")
                                                        : "-"}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {new Date(
                                                        guru.created_at
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex justify-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "admin.manajemen-user.gurus.show",
                                                                    guru.id
                                                                )}
                                                            >
                                                                Lihat
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "admin.manajemen-user.gurus.edit",
                                                                    guru.id
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
                                                                    guru.id
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
                                Tidak ada data guru.
                            </div>
                        )}

                        {/* ✅ Pagination Section */}
                        {gurus.links && gurus.links.length > 0 && (
                            <div className="mt-6 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        {/* Previous */}
                                        <PaginationItem>
                                            {gurus.prev_page_url ? (
                                                <PaginationPrevious asChild>
                                                    <Link
                                                        href={
                                                            gurus.prev_page_url
                                                        }
                                                    >
                                                        Previous
                                                    </Link>
                                                </PaginationPrevious>
                                            ) : (
                                                <PaginationPrevious className="opacity-50 cursor-not-allowed">
                                                    Previous
                                                </PaginationPrevious>
                                            )}
                                        </PaginationItem>

                                        {/* Halaman */}
                                        {gurus.links
                                            .filter(
                                                (link) =>
                                                    !link.label.includes(
                                                        "Previous"
                                                    ) &&
                                                    !link.label.includes("Next")
                                            )
                                            .map((link, index) => (
                                                <PaginationItem key={index}>
                                                    {link.label === "..." ? (
                                                        <PaginationEllipsis />
                                                    ) : (
                                                        <PaginationLink
                                                            asChild
                                                            isActive={
                                                                link.active
                                                            }
                                                        >
                                                            <Link
                                                                href={
                                                                    link.url ||
                                                                    "#"
                                                                }
                                                            >
                                                                {link.label}
                                                            </Link>
                                                        </PaginationLink>
                                                    )}
                                                </PaginationItem>
                                            ))}

                                        {/* Next */}
                                        <PaginationItem>
                                            {gurus.next_page_url ? (
                                                <PaginationNext asChild>
                                                    <Link
                                                        href={
                                                            gurus.next_page_url
                                                        }
                                                    >
                                                        Next
                                                    </Link>
                                                </PaginationNext>
                                            ) : (
                                                <PaginationNext className="opacity-50 cursor-not-allowed">
                                                    Next
                                                </PaginationNext>
                                            )}
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
