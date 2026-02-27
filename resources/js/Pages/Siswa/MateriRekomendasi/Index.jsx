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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, BookOpen, GraduationCap, Lightbulb } from "lucide-react";

export default function Index({ materiRekomendasi, mapels, filters = {} }) {
    const [status, setStatus] = useState(filters.status || "");
    const [mapelId, setMapelId] = useState(filters.mapel_id || "");
    const [judul, setJudul] = useState(filters.judul || "");

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (status) params.status = status;
        if (mapelId) params.mapel_id = mapelId;
        if (judul) params.judul = judul;
        router.get(route("siswa.materi-rekomendasi.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setStatus("");
        setMapelId("");
        setJudul("");
        router.get(
            route("siswa.materi-rekomendasi.index"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleMarkCompleted = (id) => {
        if (
            confirm(
                "Apakah Anda yakin ingin menandai materi ini sebagai selesai?"
            )
        ) {
            router.post(
                route("siswa.materi-rekomendasi.mark-completed", id),
                {},
                {
                    preserveState: true,
                }
            );
        }
    };

    return (
        <AppLayout>
            <Head title="Materi Rekomendasi" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Lightbulb className="w-8 h-8 text-yellow-500" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Materi Rekomendasi
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Materi pembelajaran yang direkomendasikan khusus
                                untuk Anda
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <BookOpen className="w-8 h-8 text-blue-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Rekomendasi
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {materiRekomendasi.total || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Sudah Selesai
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {materiRekomendasi.data?.filter(
                                            (item) => item.status === "selesai"
                                        ).length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <GraduationCap className="w-8 h-8 text-purple-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Dalam Proses
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {materiRekomendasi.data?.filter(
                                            (item) => item.status === "aktif"
                                        ).length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Materi Rekomendasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleFilterSubmit}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={status || "all"}
                                        onValueChange={(val) =>
                                            setStatus(val === "all" ? "" : val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua
                                            </SelectItem>
                                            <SelectItem value="aktif">
                                                Aktif
                                            </SelectItem>
                                            <SelectItem value="selesai">
                                                Selesai
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mapel">
                                        Mata Pelajaran
                                    </Label>
                                    <Select
                                        value={mapelId || "all"}
                                        onValueChange={(val) =>
                                            setMapelId(val === "all" ? "" : val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Mata Pelajaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua
                                            </SelectItem>
                                            {mapels.map((m) => (
                                                <SelectItem
                                                    key={m.id}
                                                    value={m.id.toString()}
                                                >
                                                    {m.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="judul">Judul Materi</Label>
                                    <Input
                                        id="judul"
                                        type="text"
                                        placeholder="Cari berdasarkan judul"
                                        value={judul}
                                        onChange={(e) =>
                                            setJudul(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Button type="submit">Filter</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClearFilters}
                                >
                                    Hapus Filter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Materi Rekomendasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {materiRekomendasi.data?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Judul Materi
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Mata Pelajaran
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Guru
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Tingkat Kesulitan
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Status
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Alasan Rekomendasi
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {materiRekomendasi.data.map(
                                            (rekomendasi) => (
                                                <tr
                                                    key={rekomendasi.id}
                                                    className="border-b hover:bg-gray-50"
                                                >
                                                    <td className="py-3 px-4 font-medium">
                                                        {
                                                            rekomendasi.materi
                                                                ?.judul
                                                        }
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {
                                                            rekomendasi.materi
                                                                ?.mapel?.nama
                                                        }
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {
                                                            rekomendasi.materi
                                                                ?.guru?.name
                                                        }
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                rekomendasi
                                                                    .materi
                                                                    ?.tingkat_kesulitan ===
                                                                "mudah"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : rekomendasi
                                                                          .materi
                                                                          ?.tingkat_kesulitan ===
                                                                      "sedang"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {rekomendasi.materi?.tingkat_kesulitan
                                                                ?.charAt(0)
                                                                .toUpperCase() +
                                                                rekomendasi.materi?.tingkat_kesulitan?.slice(
                                                                    1
                                                                )}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge
                                                            variant={
                                                                rekomendasi.status ===
                                                                "selesai"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {rekomendasi.status ===
                                                            "selesai"
                                                                ? "Selesai"
                                                                : "Aktif"}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4 max-w-xs">
                                                        <div
                                                            className="truncate"
                                                            title={
                                                                rekomendasi.alasan
                                                            }
                                                        >
                                                            {rekomendasi.alasan}
                                                        </div>
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
                                                                        "siswa.materi.show",
                                                                        rekomendasi
                                                                            .materi
                                                                            ?.id
                                                                    )}
                                                                >
                                                                    Lihat Detail
                                                                </Link>
                                                            </Button>
                                                            {rekomendasi.status ===
                                                                "aktif" && (
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleMarkCompleted(
                                                                            rekomendasi.id
                                                                        )
                                                                    }
                                                                >
                                                                    Tandai
                                                                    Selesai
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {materiRekomendasi.links?.length > 0 && (
                                    <div className="mt-6 flex justify-center">
                                        <Pagination>
                                            <PaginationContent>
                                                {/* Previous */}
                                                <PaginationItem>
                                                    {materiRekomendasi.prev_page_url ? (
                                                        <PaginationPrevious
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    materiRekomendasi.prev_page_url
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

                                                {/* Pages */}
                                                {materiRekomendasi.links
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
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: link.label,
                                                                        }}
                                                                    />
                                                                </PaginationLink>
                                                            )}
                                                        </PaginationItem>
                                                    ))}

                                                {/* Next */}
                                                <PaginationItem>
                                                    {materiRekomendasi.next_page_url ? (
                                                        <PaginationNext asChild>
                                                            <Link
                                                                href={
                                                                    materiRekomendasi.next_page_url
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
                            <div className="text-center py-12">
                                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Belum ada materi rekomendasi
                                </h3>
                                <p className="text-gray-500">
                                    Sistem akan merekomendasikan materi
                                    berdasarkan performa Anda.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
