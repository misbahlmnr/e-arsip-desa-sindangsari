import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export default function Index({ laporan, kelas, mapels, filters }) {
    const handleFilter = (key, value) => {
        const finalValue = value === "all" ? null : value;
        router.get(
            route("admin.laporan.nilai"),
            { ...filters, [key]: finalValue },
            { preserveState: true }
        );
    };

    // Helper untuk handle data kosong
    const displayValue = (val) =>
        val === null || val === undefined || val === "" ? "-" : val;

    return (
        <AppLayout>
            <Head title="Laporan Nilai Siswa" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Laporan Nilai Siswa
                    </h1>
                    <Button
                        onClick={() =>
                            window.open(
                                route("admin.laporan.nilai.export", filters),
                                "_blank"
                            )
                        }
                    >
                        Export PDF
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Filter Kelas */}
                            <div>
                                <label className="text-sm font-medium">
                                    Kelas
                                </label>
                                <Select
                                    value={
                                        filters.kelas_id?.toString() || "all"
                                    }
                                    onValueChange={(value) =>
                                        handleFilter("kelas_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Kelas
                                        </SelectItem>
                                        {kelas?.map((k) => (
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

                            {/* Filter Mapel */}
                            <div>
                                <label className="text-sm font-medium">
                                    Mata Pelajaran
                                </label>
                                <Select
                                    value={
                                        filters.mapel_id?.toString() || "all"
                                    }
                                    onValueChange={(value) =>
                                        handleFilter("mapel_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Mata Pelajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Mapel
                                        </SelectItem>
                                        {mapels?.map((m) => (
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

                            {/* Filter Semester */}
                            <div>
                                <label className="text-sm font-medium">
                                    Semester
                                </label>
                                <Select
                                    value={filters.semester || "all"}
                                    onValueChange={(value) =>
                                        handleFilter("semester", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Semester
                                        </SelectItem>
                                        <SelectItem value="1">
                                            Semester 1
                                        </SelectItem>
                                        <SelectItem value="2">
                                            Semester 2
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Nilai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {laporan?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Nama Siswa
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Kelas
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Mata Pelajaran
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Rata-rata Nilai
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {laporan.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="py-3 px-4">
                                                    {displayValue(
                                                        item.siswa?.name
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {displayValue(
                                                        item.siswa
                                                            ?.siswa_profile
                                                            ?.kelas?.nama
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {displayValue(
                                                        item.mapel?.nama
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {displayValue(
                                                        item.average_skor
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                Tidak ada data nilai.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
