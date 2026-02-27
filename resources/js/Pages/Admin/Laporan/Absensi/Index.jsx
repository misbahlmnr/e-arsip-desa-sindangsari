import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
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

export default function Index({ laporan, kelas, filters }) {
    const handleFilter = (key, value) => {
        const finalValue = value === "all" ? null : value;
        router.get(
            route("admin.laporan.absensi"),
            { ...filters, [key]: finalValue },
            { preserveState: true }
        );
    };

    const bulanOptions = [
        { value: "all", label: "Semua Bulan" },
        ...Array.from({ length: 12 }, (_, i) => ({
            value: `${new Date().getFullYear()}-${String(i + 1).padStart(
                2,
                "0"
            )}`,
            label: new Date(2000, i, 1).toLocaleString("id", { month: "long" }),
        })),
    ];

    const displayValue = (val) =>
        val === null || val === undefined || val === "" ? "-" : val;

    return (
        <AppLayout>
            <Head title="Laporan Absensi" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Laporan Absensi
                    </h1>
                    <Button
                        onClick={() =>
                            window.open(
                                route("admin.laporan.absensi.export", filters),
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            {/* Filter Bulan */}
                            <div>
                                <label className="text-sm font-medium">
                                    Bulan
                                </label>
                                <Select
                                    value={filters.bulan || "all"}
                                    onValueChange={(value) =>
                                        handleFilter("bulan", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bulanOptions.map((b) => (
                                            <SelectItem
                                                key={b.value}
                                                value={b.value}
                                            >
                                                {b.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Rekap Absensi</CardTitle>
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
                                                Total
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Hadir
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Izin
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Sakit
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Alpa
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
                                                    {displayValue(item.total)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {displayValue(item.hadir)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {displayValue(item.izin)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {displayValue(item.sakit)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {displayValue(item.alpa)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                Tidak ada data absensi.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
