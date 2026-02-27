import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Index({ jadwalHariIni, hariIni }) {
    return (
        <AppLayout>
            <Head title="Jadwal Hari Ini" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">
                        Jadwal Hari Ini ({hariIni})
                    </h1>
                </div>

                {/* Jadwal Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Jadwal Hari Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {jadwalHariIni.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4">
                                                Jam Mulai
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Jam Selesai
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Mata Pelajaran
                                            </th>
                                            <th className="text-left py-3 px-4">
                                                Guru
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jadwalHariIni.map((jadwal) => (
                                            <tr
                                                key={jadwal.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4">
                                                    {jadwal.jam_mulai}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {jadwal.jam_selesai}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {jadwal.mapel?.nama}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {jadwal.guru?.name}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        Tidak ada jadwal
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Hari ini tidak ada jadwal pelajaran.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
