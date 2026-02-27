import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Show({ guru }) {
    console.log(guru);
    return (
        <AppLayout>
            <Head title={`Detail Guru - ${guru.name}`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Detail Guru
                    </h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <Link
                                href={route(
                                    "admin.manajemen-user.gurus.edit",
                                    guru.id
                                )}
                            >
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link
                                href={route("admin.manajemen-user.gurus.index")}
                            >
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Data Akun */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Akun</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Nama Lengkap
                                </label>
                                <p className="text-sm text-gray-900">
                                    {guru.name}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <p className="text-sm text-gray-900">
                                    {guru.email}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <Badge variant="secondary">{guru.role}</Badge>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Dibuat
                                </label>
                                <p className="text-sm text-gray-900">
                                    {new Date(
                                        guru.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Profil */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Profil Guru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    NIP
                                </label>
                                <p className="text-sm text-gray-900">
                                    {guru.guru_profile?.nip || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Jenis Kelamin
                                </label>
                                <p className="text-sm text-gray-900">
                                    {guru.guru_profile?.jenis_kelamin || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Tempat Lahir
                                </label>
                                <p className="text-sm text-gray-900">
                                    {guru.guru_profile?.tempat_lahir || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Tanggal Lahir
                                </label>
                                <p className="text-sm text-gray-900">
                                    {guru.guru_profile?.tanggal_lahir
                                        ? new Date(
                                              guru.guru_profile.tanggal_lahir
                                          ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Alamat
                                </label>
                                <p className="text-sm text-gray-900">
                                    {guru.guru_profile?.alamat || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    No HP
                                </label>
                                <p className="text-sm text-gray-900">
                                    {guru.guru_profile?.no_hp || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Status Kepegawaian
                                </label>
                                <p className="text-sm text-gray-900">
                                    {guru.guru_profile?.status_kepegawaian ||
                                        "-"}
                                </p>
                            </div>

                            {/* Mata Pelajaran Banyak */}
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Mata Pelajaran
                                </label>
                                {guru.mapels && guru.mapels.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {guru.mapels.map((m) => (
                                            <Badge
                                                key={m.id}
                                                variant="outline"
                                                className="text-sm"
                                            >
                                                {m.nama}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-900">-</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
