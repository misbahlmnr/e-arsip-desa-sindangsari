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
    Calendar,
    BookOpen,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
} from "lucide-react";

export default function Index({ absensi, mapels, filters = {} }) {
    const [mapelId, setMapelId] = useState(filters.mapel_id || "all");
    const [status, setStatus] = useState(filters.status || "all");
    const [tanggal, setTanggal] = useState(filters.tanggal || "");

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (mapelId && mapelId !== "all") params.mapel_id = mapelId;
        if (status && status !== "all") params.status = status;
        if (tanggal) params.tanggal = tanggal;
        router.get(route("siswa.absensi.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setMapelId("all");
        setStatus("all");
        setTanggal("");
        router.get(
            route("siswa.absensi.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            hadir: {
                color: "bg-green-100 text-green-800",
                icon: CheckCircle,
                label: "Hadir",
            },
            tidak_hadir: {
                color: "bg-red-100 text-red-800",
                icon: XCircle,
                label: "Tidak Hadir",
            },
            izin: {
                color: "bg-yellow-100 text-yellow-800",
                icon: Clock,
                label: "Izin",
            },
            sakit: {
                color: "bg-blue-100 text-blue-800",
                icon: Clock,
                label: "Sakit",
            },
        };

        const config = statusConfig[status] || {
            color: "bg-gray-100 text-gray-800",
            icon: Clock,
            label: status,
        };

        const Icon = config.icon;

        return (
            <Badge className={config.color}>
                <Icon className="w-3 h-3 mr-1" />
                {config.label}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Absensi Saya" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Calendar className="w-8 h-8 text-blue-500" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Absensi Saya
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Lihat riwayat absensi Anda
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6 flex items-center">
                            <Calendar className="w-8 h-8 text-blue-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Total Absensi
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {absensi.total || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Hadir
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {absensi.data?.filter(
                                        (item) => item.status === "hadir"
                                    ).length || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex items-center">
                            <XCircle className="w-8 h-8 text-red-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Tidak Hadir
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {absensi.data?.filter(
                                        (item) => item.status === "tidak_hadir"
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
                                    Izin/Sakit
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {absensi.data?.filter(
                                        (item) =>
                                            item.status === "izin" ||
                                            item.status === "sakit"
                                    ).length || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Absensi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleFilterSubmit}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                            <SelectItem value="hadir">
                                                Hadir
                                            </SelectItem>
                                            <SelectItem value="tidak_hadir">
                                                Tidak Hadir
                                            </SelectItem>
                                            <SelectItem value="izin">
                                                Izin
                                            </SelectItem>
                                            <SelectItem value="sakit">
                                                Sakit
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Tanggal */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal">Tanggal</Label>
                                    <Input
                                        id="tanggal"
                                        type="date"
                                        value={tanggal}
                                        onChange={(e) =>
                                            setTanggal(e.target.value)
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
                        <CardTitle>Daftar Absensi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {absensi.data?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Mata Pelajaran
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Guru
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Hari
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Jam
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Tanggal
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {absensi.data.map((absensiItem) => (
                                            <tr
                                                key={absensiItem.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 font-medium">
                                                    {
                                                        absensiItem.jadwal
                                                            ?.mapel?.nama
                                                    }
                                                </td>
                                                <td className="py-3 px-4">
                                                    {
                                                        absensiItem.jadwal?.guru
                                                            ?.name
                                                    }
                                                </td>
                                                <td className="py-3 px-4">
                                                    {absensiItem.jadwal?.hari}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {
                                                        absensiItem.jadwal
                                                            ?.jam_mulai
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        absensiItem.jadwal
                                                            ?.jam_selesai
                                                    }
                                                </td>
                                                <td className="py-3 px-4">
                                                    {new Date(
                                                        absensiItem.tanggal
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(
                                                        absensiItem.status
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {absensi.links && absensi.links.length > 0 && (
                                    <div className="mt-6 flex justify-center">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    {absensi.prev_page_url ? (
                                                        <PaginationPrevious
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    absensi.prev_page_url
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

                                                {absensi.links
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
                                                    {absensi.next_page_url ? (
                                                        <PaginationNext asChild>
                                                            <Link
                                                                href={
                                                                    absensi.next_page_url
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
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Belum ada absensi
                                </h3>
                                <p className="text-gray-500">
                                    Riwayat absensi akan muncul di sini.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
