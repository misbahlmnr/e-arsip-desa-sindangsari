import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Show({ materi }) {
    const fileExists = materi.file_path && materi.file_path.trim() !== "";

    return (
        <AppLayout>
            <Head title={`Materi: ${materi.judul}`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {materi.judul}
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={route("siswa.materi.index")}>Kembali</Link>
                    </Button>
                </div>

                {/* Materi Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Deskripsi Materi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {materi.deskripsi?.trim() ||
                                        "Deskripsi materi belum tersedia."}
                                </p>
                            </CardContent>
                        </Card>

                        {/* File Materi */}
                        <Card>
                            <CardHeader>
                                <CardTitle>File Materi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {fileExists ? (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                File tersedia untuk diunduh.
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Klik tombol unduh untuk
                                                mengakses file.
                                            </p>
                                        </div>
                                        <Button asChild>
                                            <a
                                                href={`/storage/${materi.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm"
                                            >
                                                Unduh File
                                            </a>
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        File materi tidak tersedia.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Materi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <span className="block text-sm font-medium text-gray-700">
                                        Mata Pelajaran
                                    </span>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {materi.mapel?.nama || "-"}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-sm font-medium text-gray-700">
                                        Guru Pengajar
                                    </span>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {materi.guru?.name || "-"}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-sm font-medium text-gray-700">
                                        Tingkat Kesulitan
                                    </span>
                                    <p className="mt-1">
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
                                                ? materi.tingkat_kesulitan
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  materi.tingkat_kesulitan.slice(
                                                      1
                                                  )
                                                : "-"}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-sm font-medium text-gray-700">
                                        Dibuat Pada
                                    </span>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {materi.created_at
                                            ? new Date(
                                                  materi.created_at
                                              ).toLocaleDateString("id-ID")
                                            : "-"}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-sm font-medium text-gray-700">
                                        Diupdate Pada
                                    </span>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {materi.updated_at
                                            ? new Date(
                                                  materi.updated_at
                                              ).toLocaleDateString("id-ID")
                                            : "-"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
