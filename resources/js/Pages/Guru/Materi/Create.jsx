import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export default function Create({ mapels, kelas }) {
    const { data, setData, post, processing, errors } = useForm({
        mapel_id: "",
        kelas_id: "",
        judul: "",
        deskripsi: "",
        tingkat_kesulitan: "",
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("guru.materi.store"));
    };

    const tingkatOptions = [
        { value: "mudah", label: "Mudah" },
        { value: "sedang", label: "Sedang" },
        { value: "sulit", label: "Sulit" },
    ];

    return (
        <AppLayout>
            <Head title="Tambah Materi" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tambah Materi
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={route("guru.materi.index")}>Kembali</Link>
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah Materi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Judul */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="judul">Judul</Label>
                                    <Input
                                        id="judul"
                                        type="text"
                                        value={data.judul}
                                        onChange={(e) =>
                                            setData("judul", e.target.value)
                                        }
                                        placeholder="Judul Materi"
                                        required
                                    />
                                    {errors.judul && (
                                        <p className="text-sm text-red-600">
                                            {errors.judul}
                                        </p>
                                    )}
                                </div>

                                {/* Deskripsi */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="deskripsi">Deskripsi</Label>
                                    <Textarea
                                        id="deskripsi"
                                        value={data.deskripsi}
                                        onChange={(e) =>
                                            setData("deskripsi", e.target.value)
                                        }
                                        placeholder="Deskripsi Materi"
                                        rows={4}
                                    />
                                    {errors.deskripsi && (
                                        <p className="text-sm text-red-600">
                                            {errors.deskripsi}
                                        </p>
                                    )}
                                </div>

                                {/* Mata Pelajaran */}
                                <div className="space-y-2">
                                    <Label htmlFor="mapel_id">
                                        Mata Pelajaran
                                    </Label>
                                    <Select
                                        value={data.mapel_id}
                                        onValueChange={(value) =>
                                            setData("mapel_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Mata Pelajaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mapels?.map((m) => (
                                                <SelectItem
                                                    key={m.id}
                                                    value={m.id.toString()}
                                                >
                                                    {m.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.mapel_id && (
                                        <p className="text-sm text-red-600">
                                            {errors.mapel_id}
                                        </p>
                                    )}
                                </div>

                                {/* Kelas */}
                                <div className="space-y-2">
                                    <Label htmlFor="kelas_id">Kelas</Label>
                                    <Select
                                        value={data.kelas_id}
                                        onValueChange={(value) =>
                                            setData("kelas_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kelas?.map((k) => (
                                                <SelectItem
                                                    key={k.id}
                                                    value={k.id.toString()}
                                                >
                                                    {k.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kelas_id && (
                                        <p className="text-sm text-red-600">
                                            {errors.kelas_id}
                                        </p>
                                    )}
                                </div>

                                {/* Tingkat Kesulitan */}
                                <div className="space-y-2">
                                    <Label htmlFor="tingkat_kesulitan">
                                        Tingkat Kesulitan
                                    </Label>
                                    <Select
                                        value={data.tingkat_kesulitan}
                                        onValueChange={(value) =>
                                            setData("tingkat_kesulitan", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Tingkat Kesulitan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tingkatOptions.map((t) => (
                                                <SelectItem
                                                    key={t.value}
                                                    value={t.value}
                                                >
                                                    {t.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.tingkat_kesulitan && (
                                        <p className="text-sm text-red-600">
                                            {errors.tingkat_kesulitan}
                                        </p>
                                    )}
                                </div>

                                {/* File */}
                                <div className="space-y-2">
                                    <Label htmlFor="file">
                                        File Materi (Opsional)
                                    </Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        onChange={(e) =>
                                            setData("file", e.target.files[0])
                                        }
                                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    />
                                    {errors.file && (
                                        <p className="text-sm text-red-600">
                                            {errors.file}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Batal
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
