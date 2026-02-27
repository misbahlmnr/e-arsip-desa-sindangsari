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

export default function Index({ materis, mapels, filters = {} }) {
    const [mapelId, setMapelId] = useState(filters.mapel_id || "0");
    const [judul, setJudul] = useState(filters.judul || "");

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (mapelId && mapelId !== "0") params.mapel_id = mapelId;
        if (judul) params.judul = judul;
        router.get(route("siswa.materi.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setMapelId("0");
        setJudul("");
        router.get(
            route("siswa.materi.index"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AppLayout>
            <Head title="Materi Pembelajaran" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Materi Pembelajaran
                    </h1>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Materi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleFilterSubmit}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            <SelectItem value="0">
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
                        <CardTitle>Daftar Materi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {materis.data?.length > 0 ? (
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
                                                Guru
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Tingkat Kesulitan
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {materis.data.map((materi) => (
                                            <tr
                                                key={materi.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4">
                                                    {materi.judul}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {materi.mapel?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {materi.guru?.name}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            materi.tingkat_kesulitan ===
                                                            "mudah"
                                                                ? "bg-green-100 text-green-800"
                                                                : materi.tingkat_kesulitan ===
                                                                  "sedang"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {materi.tingkat_kesulitan
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            materi.tingkat_kesulitan.slice(
                                                                1
                                                            )}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={route(
                                                                "siswa.materi.show",
                                                                materi.id
                                                            )}
                                                        >
                                                            Lihat Detail
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {materis.links && materis.links.length > 0 && (
                                    <div className="mt-6 flex justify-center">
                                        <Pagination>
                                            <PaginationContent>
                                                {/* Previous */}
                                                <PaginationItem>
                                                    {materis.prev_page_url ? (
                                                        <PaginationPrevious
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    materis.prev_page_url
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
                                                {materis.links
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
                                                    {materis.next_page_url ? (
                                                        <PaginationNext asChild>
                                                            <Link
                                                                href={
                                                                    materis.next_page_url
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
                                Belum ada data materi.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
