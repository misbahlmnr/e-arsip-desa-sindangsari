import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Show({ jadwal }) {
    return (
        <AppLayout>
            <Head title={`Detail Jadwal - ${jadwal.hari}`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Detail Jadwal
                    </h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <Link href={route("admin.jadwal.edit", jadwal.id)}>
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route("admin.jadwal.index")}>
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Data Jadwal */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Jadwal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Hari
                                </label>
                                <p className="text-sm text-gray-900">
                                    {jadwal.hari}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Jam Mulai
                                </label>
                                <p className="text-sm text-gray-900">
                                    {jadwal.jam_mulai}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Jam Selesai
                                </label>
                                <p className="text-sm text-gray-900">
                                    {jadwal.jam_selesai}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Kelas
                                </label>
                                <p className="text-sm text-gray-900">
                                    {jadwal.kelas?.nama || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Mata Pelajaran
                                </label>
                                <p className="text-sm text-gray-900">
                                    {jadwal.mapel?.nama || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Guru
                                </label>
                                <p className="text-sm text-gray-900">
                                    {jadwal.guru?.name || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Dibuat
                                </label>
                                <p className="text-sm text-gray-900">
                                    {new Date(
                                        jadwal.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Diperbarui
                                </label>
                                <p className="text-sm text-gray-900">
                                    {new Date(
                                        jadwal.updated_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
