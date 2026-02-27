import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function Show({ materi }) {
    const downloadFile = () => {
        if (materi.file_path) {
            window.open(`/storage/${materi.file_path}`, "_blank");
        }
    };

    return (
        <AppLayout>
            <Head title={`Detail Materi - ${materi.judul || "-"}`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Detail Materi
                    </h1>
                    <div className="flex space-x-2">
                        {materi?.id && (
                            <Button variant="outline" asChild>
                                <Link
                                    href={route("guru.materi.edit", materi.id)}
                                >
                                    Edit
                                </Link>
                            </Button>
                        )}
                        <Button variant="outline" asChild>
                            <Link href={route("guru.materi.index")}>
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Data Materi */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Materi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Judul
                                </Label>
                                <p className="text-sm text-gray-900">
                                    {materi.judul || "-"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Mata Pelajaran
                                </Label>
                                <p className="text-sm text-gray-900">
                                    {materi.mapel?.nama || "-"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Kelas
                                </Label>
                                <p className="text-sm text-gray-900">
                                    {materi.kelas?.nama || "-"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Tingkat Kesulitan
                                </Label>
                                <p className="text-sm text-gray-900">
                                    {materi.tingkat_kesulitan || "-"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Guru
                                </Label>
                                <p className="text-sm text-gray-900">
                                    {materi.guru?.name || "-"}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Deskripsi
                                </Label>
                                <p className="text-sm text-gray-900 mt-1">
                                    {materi.deskripsi || "-"}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    File Materi
                                </Label>
                                <p className="text-sm text-gray-900 mt-1">
                                    {materi.file_path ? (
                                        <Button
                                            onClick={downloadFile}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Download File
                                        </Button>
                                    ) : (
                                        "-"
                                    )}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Dibuat
                                </Label>
                                <p className="text-sm text-gray-900">
                                    {materi.created_at
                                        ? new Date(
                                              materi.created_at
                                          ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Diperbarui
                                </Label>
                                <p className="text-sm text-gray-900">
                                    {materi.updated_at
                                        ? new Date(
                                              materi.updated_at
                                          ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>
                        </div>

                        {/* Tombol Hapus */}
                        <div className="pt-4 border-t mt-4">
                            <Button variant="destructive" asChild>
                                <Link
                                    href={route(
                                        "guru.materi.destroy",
                                        materi.id
                                    )}
                                    method="delete"
                                    onClick={(e) => {
                                        if (
                                            !confirm(
                                                "Apakah Anda yakin ingin menghapus materi ini?"
                                            )
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    Hapus
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
