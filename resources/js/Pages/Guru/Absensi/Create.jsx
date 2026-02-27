import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export default function Create({ jadwal, siswa }) {
    // Gunakan useForm
    const { data, setData, post, processing, errors } = useForm({
        jadwal_id: "",
        siswa_id: "",
        status: "",
        tanggal: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("guru.absensi.store"));
    };

    return (
        <AppLayout>
            <Head title="Tambah Absensi" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tambah Absensi
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={route("guru.absensi.index")}>Kembali</Link>
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah Absensi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="jadwal_id">Jadwal</Label>
                                    <Select
                                        value={data.jadwal_id}
                                        onValueChange={(value) =>
                                            setData("jadwal_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Jadwal" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jadwal.map((j) => (
                                                <SelectItem
                                                    key={j.id}
                                                    value={j.id.toString()}
                                                >
                                                    {j.mapel?.nama} -{" "}
                                                    {j.kelas?.nama} ({j.hari})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.jadwal_id && (
                                        <p className="text-sm text-red-600">
                                            {errors.jadwal_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="siswa_id">Siswa</Label>
                                    <Select
                                        value={data.siswa_id}
                                        onValueChange={(value) =>
                                            setData("siswa_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Siswa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {siswa.map((s) => (
                                                <SelectItem
                                                    key={s.id}
                                                    value={s.id.toString()}
                                                >
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.siswa_id && (
                                        <p className="text-sm text-red-600">
                                            {errors.siswa_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData("status", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hadir">
                                                Hadir
                                            </SelectItem>
                                            <SelectItem value="izin">
                                                Izin
                                            </SelectItem>
                                            <SelectItem value="sakit">
                                                Sakit
                                            </SelectItem>
                                            <SelectItem value="alpa">
                                                Alpa
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-600">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal">Tanggal</Label>
                                    <Input
                                        id="tanggal"
                                        type="date"
                                        value={data.tanggal}
                                        onChange={(e) =>
                                            setData("tanggal", e.target.value)
                                        }
                                    />
                                    {errors.tanggal && (
                                        <p className="text-sm text-red-600">
                                            {errors.tanggal}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {errors.error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">
                                        {errors.error}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route("guru.absensi.index")}>
                                        Batal
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
