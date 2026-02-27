import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Index({ laporan }) {
    return (
        <AppLayout>
            <Head title="Laporan Adaptive Learning" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Laporan Adaptive Learning
                    </h1>
                    <Button
                        onClick={() =>
                            window.open(
                                route("admin.laporan.adaptive-rules.export"),
                                "_blank"
                            )
                        }
                    >
                        Export PDF
                    </Button>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Siswa yang Perlu Rekomendasi Tambahan
                        </CardTitle>
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
                                                Skor Aktual
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Min Score
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Kategori Rekomendasi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {laporan.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4">
                                                    {item.siswa?.name}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {item.kelas?.nama ||
                                                        item.siswa
                                                            ?.siswa_profile
                                                            ?.kelas?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {item.mapel?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {item.skor_aktual}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {item.min_score}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {item.kategori_rekomendasi}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                Tidak ada siswa yang perlu rekomendasi.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
