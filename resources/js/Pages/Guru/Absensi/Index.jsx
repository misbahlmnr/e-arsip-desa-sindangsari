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
import { useState } from "react";
import { motion } from "framer-motion";
import { isEmpty } from "@/Utils/helpers";

export default function Index({ absensi, jadwal, siswa, filters = {} }) {
    const [jadwalId, setJadwalId] = useState(filters.jadwal_id);
    const [siswaId, setSiswaId] = useState(filters.siswa_id);
    const [status, setStatus] = useState(filters.status);
    const [tanggal, setTanggal] = useState(filters.tanggal);

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus absensi ini?")) {
            router.delete(route("guru.absensi.destroy", id));
        }
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (jadwalId) params.jadwal_id = jadwalId;
        if (siswaId) params.siswa_id = siswaId;
        if (status) params.status = status;
        if (tanggal) params.tanggal = tanggal;
        router.get(route("guru.absensi.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setJadwalId(undefined);
        setSiswaId(undefined);
        setStatus(undefined);
        setTanggal("");
        router.get(
            route("guru.absensi.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            hadir: "bg-green-100 text-green-800",
            izin: "bg-yellow-100 text-yellow-800",
            sakit: "bg-blue-100 text-blue-800",
            alpa: "bg-red-100 text-red-800",
        };
        return statusClasses[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <AppLayout>
            <Head title="Manajemen Absensi" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Absensi
                    </h1>
                    <Button asChild>
                        <Link href={route("guru.absensi.create")}>
                            Tambah Absensi
                        </Link>
                    </Button>
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
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Jadwal */}
                                <div className="space-y-2">
                                    <Label htmlFor="jadwal">Jadwal</Label>
                                    <Select
                                        value={jadwalId}
                                        onValueChange={setJadwalId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Jadwal" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={undefined}>
                                                Semua
                                            </SelectItem>
                                            {!isEmpty(jadwal) &&
                                                jadwal.map((j) => (
                                                    <SelectItem
                                                        key={j.id}
                                                        value={j.id.toString()}
                                                    >
                                                        {j.mapel?.nama} -{" "}
                                                        {j.kelas?.nama} (
                                                        {j.hari})
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Siswa */}
                                <div className="space-y-2">
                                    <Label htmlFor="siswa">Siswa</Label>
                                    <Select
                                        value={siswaId}
                                        onValueChange={setSiswaId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Siswa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={undefined}>
                                                Semua
                                            </SelectItem>
                                            {!isEmpty(siswa) &&
                                                siswa.map((s) => (
                                                    <SelectItem
                                                        key={s.id}
                                                        value={s.id.toString()}
                                                    >
                                                        {s.name}
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
                                            <SelectItem value={undefined}>
                                                Semua
                                            </SelectItem>
                                            <SelectItem value="hadir">
                                                Hadir
                                            </SelectItem>
                                            <SelectItem value="izin">
                                                Izin
                                            </SelectItem>
                                            <SelectItem value="sakit">
                                                Sakit
                                            </SelectItem>
                                            <SelectItem value="alpa">
                                                Alpa
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
                                    Reset
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
                        {!isEmpty(absensi) && absensi.data?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Siswa
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Mata Pelajaran
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Kelas
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Tanggal
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
                                        {absensi.data.map((a) => (
                                            <tr
                                                key={a.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4">
                                                    {a.siswa?.name}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {a.jadwal?.mapel?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {a.jadwal?.kelas?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {new Date(
                                                        a.tanggal
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                                            a.status
                                                        )}`}
                                                    >
                                                        {a.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            a.status.slice(1)}
                                                    </span>
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
                                                                    "guru.absensi.show",
                                                                    a.id
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
                                                                    "guru.absensi.edit",
                                                                    a.id
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
                                                                    a.id
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

                                {/* Pagination */}
                                {absensi.links?.length > 0 && (
                                    <div className="mt-6 flex justify-center">
                                        <Pagination>
                                            <PaginationContent>
                                                {/* Previous */}
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

                                                {/* Pages */}
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

                                                {/* Next */}
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
                            <p className="text-center text-gray-500 py-8">
                                Belum ada data absensi.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
