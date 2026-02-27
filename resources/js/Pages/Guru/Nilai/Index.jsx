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

export default function Index({ nilai, tugas, siswa, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [tugasId, setTugasId] = useState(filters.tugas_id || "all");
    const [siswaId, setSiswaId] = useState(filters.siswa_id || "all");

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus nilai ini?")) {
            router.delete(route("guru.nilai.destroy", id));
        }
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (search) params.search = search;
        if (tugasId !== "all") params.tugas_id = tugasId;
        if (siswaId !== "all") params.siswa_id = siswaId;

        router.get(route("guru.nilai.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSearch("");
        setTugasId("all");
        setSiswaId("all");
        router.get(
            route("guru.nilai.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    return (
        <AppLayout>
            <Head title="Manajemen Nilai" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Nilai
                    </h1>
                    <Button asChild>
                        <Link href={route("guru.nilai.create")}>
                            Tambah Nilai
                        </Link>
                    </Button>
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
                                <div className="space-y-2">
                                    <Label htmlFor="search">Cari Siswa</Label>
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Masukkan nama siswa"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tugas">Tugas</Label>
                                    <Select
                                        value={tugasId}
                                        onValueChange={setTugasId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Tugas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua
                                            </SelectItem>
                                            {!isEmpty(tugas) &&
                                                tugas.map((t) => (
                                                    <SelectItem
                                                        key={t.id}
                                                        value={t.id.toString()}
                                                    >
                                                        {t.judul} -{" "}
                                                        {t.mapel?.nama}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

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
                                            <SelectItem value="all">
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

                                <div className="flex items-end space-x-2">
                                    <Button type="submit">Filter</Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClearFilters}
                                    >
                                        Reset
                                    </Button>
                                </div>
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
                        {!isEmpty(nilai) && nilai.data?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Siswa
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Tugas
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Mata Pelajaran
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Kelas
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Skor
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nilai.data.map((n) => (
                                            <tr
                                                key={n.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4">
                                                    {n.siswa?.name}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {n.tugas?.judul}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {n.tugas?.mapel?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {n.tugas?.kelas?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {n.skor}
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
                                                                    "guru.nilai.show",
                                                                    n.id
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
                                                                    "guru.nilai.edit",
                                                                    n.id
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
                                                                    n.id
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
                                {nilai.links && nilai.links.length > 0 && (
                                    <div className="mt-6 flex justify-center">
                                        <Pagination>
                                            <PaginationContent>
                                                {/* Previous */}
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

                                                {/* Pages */}
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

                                                {/* Next */}
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
                            <p className="text-center text-gray-500 py-8">
                                Belum ada data nilai.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
