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
import { Trophy, BookOpen, CheckCircle, Clock, FileText } from "lucide-react";

export default function Index({ nilai, mapels, filters = {} }) {
    const [mapelId, setMapelId] = useState(filters.mapel_id || "all");
    const [tipe, setTipe] = useState(filters.tipe || "all");
    const [status, setStatus] = useState(filters.status || "all");
    const [judul, setJudul] = useState(filters.judul || "");

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (mapelId && mapelId !== "all") params.mapel_id = mapelId;
        if (tipe && tipe !== "all") params.tipe = tipe;
        if (status && status !== "all") params.status = status;
        if (judul) params.judul = judul;
        router.get(route("siswa.nilai.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setMapelId("all");
        setTipe("all");
        setStatus("all");
        setJudul("");
        router.get(
            route("siswa.nilai.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    const getStatusBadge = (skor) => {
        if (skor > 0) {
            return (
                <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Dinilai
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Belum Dinilai
                </Badge>
            );
        }
    };

    const getTipeBadge = (tipe) => {
        const colors = {
            kuis: "bg-blue-100 text-blue-800",
            ujian: "bg-red-100 text-red-800",
            tugas: "bg-purple-100 text-purple-800",
        };
        return (
            <Badge className={colors[tipe] || "bg-gray-100 text-gray-800"}>
                {tipe.charAt(0).toUpperCase() + tipe.slice(1)}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Nilai Saya" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Nilai Saya
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Lihat nilai tugas dari guru Anda
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6 flex items-center">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Total Nilai
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {nilai.total || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Sudah Dinilai
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {nilai.data?.filter((item) => item.skor > 0)
                                        .length || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex items-center">
                            <Clock className="w-8 h-8 text-yellow-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Belum Dinilai
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {nilai.data?.filter(
                                        (item) => item.skor === 0
                                    ).length || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Nilai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleFilterSubmit}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Mata Pelajaran */}
                                <div className="space-y-2">
                                    <Label htmlFor="mapel">
                                        Mata Pelajaran
                                    </Label>
                                    <Select
                                        value={mapelId}
                                        onValueChange={setMapelId}
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

                                {/* Tipe */}
                                <div className="space-y-2">
                                    <Label htmlFor="tipe">Tipe Tugas</Label>
                                    <Select
                                        value={tipe}
                                        onValueChange={setTipe}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua
                                            </SelectItem>
                                            <SelectItem value="kuis">
                                                Kuis
                                            </SelectItem>
                                            <SelectItem value="ujian">
                                                Ujian
                                            </SelectItem>
                                            <SelectItem value="tugas">
                                                Tugas
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={status}
                                        onValueChange={setStatus}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua
                                            </SelectItem>
                                            <SelectItem value="dinilai">
                                                Sudah Dinilai
                                            </SelectItem>
                                            <SelectItem value="belum_dinilai">
                                                Belum Dinilai
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Judul */}
                                <div className="space-y-2">
                                    <Label htmlFor="judul">Judul Tugas</Label>
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
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Nilai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {nilai.data?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Judul Tugas
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Mata Pelajaran
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Guru
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Tipe
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Skor
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Status
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nilai.data.map((nilaiItem) => (
                                            <tr
                                                key={nilaiItem.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 font-medium">
                                                    {nilaiItem.tugas?.judul}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {
                                                        nilaiItem.tugas?.mapel
                                                            ?.nama
                                                    }
                                                </td>
                                                <td className="py-3 px-4">
                                                    {
                                                        nilaiItem.tugas?.guru
                                                            ?.name
                                                    }
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getTipeBadge(
                                                        nilaiItem.tugas?.tipe
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {nilaiItem.skor > 0 ? (
                                                        <span className="font-semibold text-green-600">
                                                            {nilaiItem.skor}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(
                                                        nilaiItem.skor
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={route(
                                                                "siswa.tugas.show",
                                                                nilaiItem.tugas
                                                                    ?.id
                                                            )}
                                                        >
                                                            <FileText className="w-4 h-4 mr-2" />{" "}
                                                            Lihat Tugas
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {nilai.links && nilai.links.length > 0 && (
                                    <div className="mt-6 flex justify-center">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    {nilai.prev_page_url ? (
                                                        <PaginationPrevious
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    nilai.prev_page_url
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

                                                {nilai.links
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

                                                <PaginationItem>
                                                    {nilai.next_page_url ? (
                                                        <PaginationNext asChild>
                                                            <Link
                                                                href={
                                                                    nilai.next_page_url
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
                                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Belum ada nilai
                                </h3>
                                <p className="text-gray-500">
                                    Nilai dari tugas akan muncul di sini setelah
                                    dinilai guru.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
