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
import {
    ClipboardList,
    BookOpen,
    Clock,
    CheckCircle,
    AlertCircle,
    FileText,
} from "lucide-react";

export default function Index({ tugas, mapels, filters = {} }) {
    const [mapelId, setMapelId] = useState(filters.mapel_id || "");
    const [tipe, setTipe] = useState(filters.tipe || "");
    const [status, setStatus] = useState(filters.status || "");
    const [judul, setJudul] = useState(filters.judul || "");

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (mapelId) params.mapel_id = mapelId;
        if (tipe) params.tipe = tipe;
        if (status) params.status = status;
        if (judul) params.judul = judul;
        router.get(route("siswa.tugas.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setMapelId("");
        setTipe("");
        setStatus("");
        setJudul("");
        router.get(
            route("siswa.tugas.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    const getStatusBadge = (tugasItem) => {
        const now = new Date();
        const deadline = new Date(tugasItem.deadline);
        const hasSubmitted = tugasItem.jawaban && tugasItem.jawaban.length > 0;

        if (hasSubmitted) {
            return (
                <Badge className="bg-green-100 text-green-800">
                    Sudah Dikerjakan
                </Badge>
            );
        } else if (deadline < now) {
            return <Badge variant="destructive">Terlambat</Badge>;
        } else {
            return (
                <Badge className="bg-yellow-100 text-yellow-800">
                    Belum Dikerjakan
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
            <Head title="Daftar Tugas" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <ClipboardList className="w-8 h-8 text-blue-500" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Daftar Tugas
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Kelola dan kumpulkan tugas dari guru Anda
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6 flex items-center">
                            <ClipboardList className="w-8 h-8 text-blue-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Total Tugas
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {tugas.total || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Sudah Dikerjakan
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {tugas.data?.filter(
                                        (item) =>
                                            item.jawaban &&
                                            item.jawaban.length > 0
                                    ).length || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex items-center">
                            <Clock className="w-8 h-8 text-yellow-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Belum Dikerjakan
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {tugas.data?.filter(
                                        (item) =>
                                            !item.jawaban ||
                                            item.jawaban.length === 0
                                    ).length || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex items-center">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Terlambat
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {tugas.data?.filter((item) => {
                                        const deadline = new Date(
                                            item.deadline
                                        );
                                        const now = new Date();
                                        const hasSubmitted =
                                            item.jawaban &&
                                            item.jawaban.length > 0;
                                        return deadline < now && !hasSubmitted;
                                    }).length || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Tugas</CardTitle>
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

                                {/* Tipe */}
                                <div className="space-y-2">
                                    <Label htmlFor="tipe">Tipe Tugas</Label>
                                    <Select
                                        value={tipe || "all"}
                                        onValueChange={(val) =>
                                            setTipe(val === "all" ? "" : val)
                                        }
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
                                            <SelectItem value="belum_dikerjakan">
                                                Belum Dikerjakan
                                            </SelectItem>
                                            <SelectItem value="sudah_dikerjakan">
                                                Sudah Dikerjakan
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
                                    Hapus Filter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Tugas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tugas.data?.length > 0 ? (
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
                                                Deadline
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
                                        {tugas.data.map((tugasItem) => (
                                            <tr
                                                key={tugasItem.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 font-medium">
                                                    {tugasItem.judul}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {tugasItem.mapel?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {tugasItem.guru?.name}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getTipeBadge(
                                                        tugasItem.tipe
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-sm">
                                                    {new Date(
                                                        tugasItem.deadline
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(tugasItem)}
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
                                                                tugasItem.id
                                                            )}
                                                        >
                                                            <FileText className="w-4 h-4 mr-2" />{" "}
                                                            Lihat Detail
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {tugas.links && tugas.links.length > 0 && (
                                    <div className="mt-6 flex justify-center">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    {tugas.prev_page_url ? (
                                                        <PaginationPrevious
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    tugas.prev_page_url
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

                                                {tugas.links
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
                                                    {tugas.next_page_url ? (
                                                        <PaginationNext asChild>
                                                            <Link
                                                                href={
                                                                    tugas.next_page_url
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
                                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Belum ada tugas
                                </h3>
                                <p className="text-gray-500">
                                    Tugas dari guru akan muncul di sini.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
