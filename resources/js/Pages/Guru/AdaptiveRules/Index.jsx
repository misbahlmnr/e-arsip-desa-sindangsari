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

export default function Index({ adaptiveRules, mapels, filters = {} }) {
    // Gunakan "all" sebagai default value untuk opsi "Semua"
    const [mapelId, setMapelId] = useState(filters.mapel_id || "all");
    const [kategoriRekomendasi, setKategoriRekomendasi] = useState(
        filters.kategori_rekomendasi || ""
    );
    const [minScore, setMinScore] = useState(filters.min_score || "");

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus adaptive rule ini?")) {
            router.delete(route("guru.adaptive-rules.destroy", id));
        }
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (mapelId && mapelId !== "all") params.mapel_id = mapelId;
        if (kategoriRekomendasi)
            params.kategori_rekomendasi = kategoriRekomendasi;
        if (minScore) params.min_score = minScore;

        router.get(route("guru.adaptive-rules.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setMapelId("all");
        setKategoriRekomendasi("");
        setMinScore("");
        router.get(
            route("guru.adaptive-rules.index"),
            {},
            { preserveState: true, replace: true }
        );
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
                        <Link href={route("guru.adaptive-rules.create")}>
                            Tambah Adaptive Rule
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Adaptive Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleFilterSubmit}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                                <div className="space-y-2">
                                    <Label htmlFor="kategori_rekomendasi">
                                        Kategori Rekomendasi
                                    </Label>
                                    <Input
                                        id="kategori_rekomendasi"
                                        type="text"
                                        placeholder="Masukkan kategori rekomendasi"
                                        value={kategoriRekomendasi}
                                        onChange={(e) =>
                                            setKategoriRekomendasi(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="min_score">
                                        Min Score (≥)
                                    </Label>
                                    <Input
                                        id="min_score"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        placeholder="Masukkan min score"
                                        value={minScore}
                                        onChange={(e) =>
                                            setMinScore(e.target.value)
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
                                                <td className="py-3 px-4">
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
                                                                    "guru.adaptive-rules.show",
                                                                    rule.id
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
                                                                    "guru.adaptive-rules.edit",
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

                                {/* Pagination */}
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

                                                    {/* Pages */}
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
