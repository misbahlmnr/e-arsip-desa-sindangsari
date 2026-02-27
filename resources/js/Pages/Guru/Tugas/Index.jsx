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

export default function Index({ tugas, mapels, kelas, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [mapelId, setMapelId] = useState(filters.mapel_id || "all");
    const [kelasId, setKelasId] = useState(filters.kelas_id || "all");
    const [tipe, setTipe] = useState(filters.tipe || "all");

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
            router.delete(route("guru.tugas.destroy", id));
        }
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (search) params.search = search;
        if (mapelId && mapelId !== "all") params.mapel_id = mapelId;
        if (kelasId && kelasId !== "all") params.kelas_id = kelasId;
        if (tipe && tipe !== "all") params.tipe = tipe;

        router.get(route("guru.tugas.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSearch("");
        setMapelId("all");
        setKelasId("all");
        setTipe("all");
        router.get(
            route("guru.tugas.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    return (
        <AppLayout>
            <Head title="Manajemen Tugas" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Tugas
                    </h1>
                    <Button asChild>
                        <Link href={route("guru.tugas.create")}>
                            Tambah Tugas
                        </Link>
                    </Button>
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
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="search">Cari Judul</Label>
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Masukkan judul tugas"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </div>

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
                                            {!isEmpty(mapels) &&
                                                mapels.map((mapel) => (
                                                    <SelectItem
                                                        key={mapel.id}
                                                        value={mapel.id.toString()}
                                                    >
                                                        {mapel.nama}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kelas">Kelas</Label>
                                    <Select
                                        value={kelasId}
                                        onValueChange={setKelasId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua
                                            </SelectItem>
                                            {!isEmpty(kelas) &&
                                                kelas.map((k) => (
                                                    <SelectItem
                                                        key={k.id}
                                                        value={k.id.toString()}
                                                    >
                                                        {k.nama}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipe">Tipe</Label>
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
                        <CardTitle>Daftar Tugas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!isEmpty(tugas) && tugas.data?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Judul
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Mata Pelajaran
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Kelas
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Tipe
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Deadline
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tugas.data.map((tgs) => (
                                            <tr
                                                key={tgs.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4">
                                                    {tgs.judul}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {tgs.mapel?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {tgs.kelas?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {tgs.tipe}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {new Date(
                                                        tgs.deadline
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
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
                                                                    "guru.tugas.show",
                                                                    tgs.id
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
                                                                    "guru.tugas.edit",
                                                                    tgs.id
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
                                                                    tgs.id
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
                            <p className="text-center text-gray-500 py-8">
                                Belum ada data tugas.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
