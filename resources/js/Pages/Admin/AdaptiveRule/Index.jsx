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

export default function Index({ adaptiveRules }) {
    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus adaptive rule ini?")) {
            router.delete(route("admin.adaptive-rule.destroy", id));
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Adaptive Rules" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Adaptive Rules
                    </h1>
                    <Button asChild>
                        <Link href={route("admin.adaptive-rule.create")}>
                            Tambah Adaptive Rule
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Adaptive Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {adaptiveRules.data?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Mata Pelajaran
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Min Score
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Kategori Rekomendasi
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adaptiveRules.data.map((rule) => (
                                            <tr
                                                key={rule.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4">
                                                    {rule.mapel?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {rule.min_score}
                                                </td>
                                                <td className="py-3 px-4 capitalize">
                                                    {rule.kategori_rekomendasi}
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
                                                                    "admin.adaptive-rule.edit",
                                                                    rule.id
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
                                                                    rule.id
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

                                {/* ✅ Pagination Section (same as guru) */}
                                {adaptiveRules.links &&
                                    adaptiveRules.links.length > 0 && (
                                        <div className="mt-6 flex justify-center">
                                            <Pagination>
                                                <PaginationContent>
                                                    {/* Previous */}
                                                    <PaginationItem>
                                                        {adaptiveRules.prev_page_url ? (
                                                            <PaginationPrevious
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        adaptiveRules.prev_page_url
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
                                                    {adaptiveRules.links
                                                        .filter(
                                                            (link) =>
                                                                !link.label.includes(
                                                                    "Previous"
                                                                ) &&
                                                                !link.label.includes(
                                                                    "Next"
                                                                )
                                                        )
                                                        .map((link, index) => (
                                                            <PaginationItem
                                                                key={index}
                                                            >
                                                                {link.label ===
                                                                "..." ? (
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
                                                                            {
                                                                                link.label
                                                                            }
                                                                        </Link>
                                                                    </PaginationLink>
                                                                )}
                                                            </PaginationItem>
                                                        ))}

                                                    {/* Next */}
                                                    <PaginationItem>
                                                        {adaptiveRules.next_page_url ? (
                                                            <PaginationNext
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        adaptiveRules.next_page_url
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
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                Belum ada data adaptive rules.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
