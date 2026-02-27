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

export default function Create({ tugas, siswa }) {
    const { data, setData, post, processing, errors } = useForm({
        tugas_id: "",
        siswa_id: "",
        skor: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("guru.nilai.store"));
    };

    return (
        <AppLayout>
            <Head title="Tambah Nilai" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tambah Nilai
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={route("guru.nilai.index")}>Kembali</Link>
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah Nilai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="tugas_id">Tugas</Label>
                                    <Select
                                        value={data.tugas_id}
                                        onValueChange={(value) =>
                                            setData("tugas_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Tugas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tugas.map((t) => (
                                                <SelectItem
                                                    key={t.id}
                                                    value={t.id.toString()}
                                                >
                                                    {t.judul} - {t.mapel?.nama}{" "}
                                                    ({t.kelas?.nama})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.tugas_id && (
                                        <p className="text-sm text-red-600">
                                            {errors.tugas_id}
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
                                    <Label htmlFor="skor">Skor</Label>
                                    <Input
                                        id="skor"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        placeholder="Masukkan skor (0-100)"
                                        value={data.skor}
                                        onChange={(e) =>
                                            setData("skor", e.target.value)
                                        }
                                    />
                                    {errors.skor && (
                                        <p className="text-sm text-red-600">
                                            {errors.skor}
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
                                    <Link href={route("guru.nilai.index")}>
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
