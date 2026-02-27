import AppLayout from "@/Layouts/AppLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

export default function Index({ siswas, kelas, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || "",
        kelas_id: filters.kelas_id || undefined, // fix: tidak boleh string kosong
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route("admin.manajemen-user.siswas.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({ search: "", kelas_id: undefined });
        router.get(route("admin.manajemen-user.siswas.index"));
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
            router.delete(route("admin.manajemen-user.siswas.destroy", id));
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Siswa" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Siswa
                    </h1>
                    <Button
                        onClick={() =>
                            router.visit(
                                route("admin.manajemen-user.siswas.create")
                            )
                        }
                    >
                        Tambah Siswa
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Siswa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleFilter} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="search">Cari Nama</Label>
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Masukkan nama siswa..."
                                        value={data.search}
                                        onChange={(e) =>
                                            setData("search", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kelas_id">
                                        Filter Kelas
                                    </Label>
                                    <Select
                                        value={
                                            data.kelas_id?.toString() || "all"
                                        }
                                        onValueChange={(value) =>
                                            setData(
                                                "kelas_id",
                                                value === "all"
                                                    ? undefined
                                                    : value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Kelas
                                            </SelectItem>
                                            {kelas.map((k) => (
                                                <SelectItem
                                                    key={k.id}
                                                    value={k.id.toString()}
                                                >
                                                    {k.nama} (Tingkat{" "}
                                                    {k.tingkat})
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
                                        onClick={handleReset}
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
                        <CardTitle>Daftar Siswa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {siswas.data?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Nama
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Email
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Kelas
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Dibuat
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {siswas.data.map((siswa) => (
                                            <tr
                                                key={siswa.id}
                                                className="border-b hover:bg-gray-50 transition"
                                            >
                                                <td className="py-3 px-4">
                                                    {siswa.name}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {siswa.email}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {siswa.siswa_profile?.kelas
                                                        ? `${siswa.siswa_profile.kelas.nama} (${siswa.siswa_profile.kelas.tingkat})`
                                                        : "-"}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {new Date(
                                                        siswa.created_at
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "admin.manajemen-user.siswas.show",
                                                                        siswa.id
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Lihat
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "admin.manajemen-user.siswas.edit",
                                                                        siswa.id
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    siswa.id
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
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                Tidak ada data siswa.
                            </div>
                        )}

                        {/* Pagination (selalu tampil meskipun hanya 1 halaman) */}
                        <div className="mt-6">
                            <Pagination>
                                <PaginationContent>
                                    {/* Tombol Previous */}
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={siswas.prev_page_url || "#"}
                                            aria-disabled={
                                                siswas.current_page === 1
                                            }
                                            className={
                                                siswas.current_page === 1
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>

                                    {/* Nomor halaman */}
                                    {siswas.links.map((link, index) => {
                                        if (
                                            link.label === "&laquo; Previous" ||
                                            link.label === "Next &raquo;"
                                        ) {
                                            return null;
                                        }

                                        if (link.label === "...") {
                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }

                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    href={link.url || "#"}
                                                    isActive={link.active}
                                                >
                                                    {link.label}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    {/* Tombol Next */}
                                    <PaginationItem>
                                        <PaginationNext
                                            href={siswas.next_page_url || "#"}
                                            aria-disabled={
                                                siswas.current_page ===
                                                siswas.last_page
                                            }
                                            className={
                                                siswas.current_page ===
                                                siswas.last_page
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
