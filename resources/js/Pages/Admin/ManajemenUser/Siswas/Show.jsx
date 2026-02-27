import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Show({ siswa }) {
    return (
        <AppLayout>
            <Head title={`Detail Siswa - ${siswa.name}`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Detail Siswa
                    </h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <Link
                                href={route(
                                    "admin.manajemen-user.siswas.edit",
                                    siswa.id
                                )}
                            >
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link
                                href={route(
                                    "admin.manajemen-user.siswas.index"
                                )}
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
                                    {siswa.name}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <p className="text-sm text-gray-900">
                                    {siswa.email}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <Badge variant="secondary">{siswa.role}</Badge>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Dibuat
                                </label>
                                <p className="text-sm text-gray-900">
                                    {new Date(
                                        siswa.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Profil */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Profil Siswa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    NIS
                                </label>
                                <p className="text-sm text-gray-900">
                                    {siswa.siswa_profile?.nis || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    NISN
                                </label>
                                <p className="text-sm text-gray-900">
                                    {siswa.siswa_profile?.nisn || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Jenis Kelamin
                                </label>
                                <p className="text-sm text-gray-900">
                                    {siswa.siswa_profile?.jenis_kelamin || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Tempat Lahir
                                </label>
                                <p className="text-sm text-gray-900">
                                    {siswa.siswa_profile?.tempat_lahir || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Tanggal Lahir
                                </label>
                                <p className="text-sm text-gray-900">
                                    {siswa.siswa_profile?.tanggal_lahir
                                        ? new Date(
                                              siswa.siswa_profile.tanggal_lahir
                                          ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    No HP
                                </label>
                                <p className="text-sm text-gray-900">
                                    {siswa.siswa_profile?.no_hp || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Angkatan
                                </label>
                                <p className="text-sm text-gray-900">
                                    {siswa.siswa_profile?.angkatan || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <Badge
                                    variant={
                                        siswa.siswa_profile?.status === "aktif"
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {siswa.siswa_profile?.status || "aktif"}
                                </Badge>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Nama Orang Tua
                                </label>
                                <p className="text-sm text-gray-900">
                                    {siswa.siswa_profile?.nama_ortu || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Kontak Orang Tua
                                </label>
                                <p className="text-sm text-gray-900">
                                    {siswa.siswa_profile?.kontak_ortu || "-"}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Kelas
                                </label>
                                <p className="text-sm text-gray-900">
                                    {siswa.siswa_profile?.kelas
                                        ? `${siswa.siswa_profile.kelas.nama} (${siswa.siswa_profile.kelas.tingkat})`
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
