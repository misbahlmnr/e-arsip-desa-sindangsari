import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Show({ absensi }) {
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
            <Head title="Detail Absensi" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Detail Absensi
                    </h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <Link href={route("guru.absensi.edit", absensi.id)}>
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route("guru.absensi.index")}>
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Detail Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Absensi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Siswa
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {absensi.siswa?.name}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Mata Pelajaran
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {absensi.jadwal?.mapel?.nama}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Kelas
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {absensi.jadwal?.kelas?.nama}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Hari
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {absensi.jadwal?.hari}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Jam Mulai
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {absensi.jadwal?.jam_mulai}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Jam Selesai
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {absensi.jadwal?.jam_selesai}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tanggal
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {new Date(
                                        absensi.tanggal
                                    ).toLocaleDateString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <p className="mt-1">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                            absensi.status
                                        )}`}
                                    >
                                        {absensi.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            absensi.status.slice(1)}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Dibuat Pada
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {new Date(
                                        absensi.created_at
                                    ).toLocaleDateString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Diupdate Pada
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {new Date(
                                        absensi.updated_at
                                    ).toLocaleDateString("id-ID")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
