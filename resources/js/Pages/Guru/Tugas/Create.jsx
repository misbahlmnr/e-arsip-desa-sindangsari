import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
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

export default function Create({ mapels, kelas }) {
    const { data, setData, post, processing, errors } = useForm({
        judul: "",
        tipe: "",
        mapel_id: "",
        kelas_id: "",
        deadline: "",
        file: null,
        link_soal: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("guru.tugas.store"));
    };

    return (
        <AppLayout>
            <Head title="Tambah Tugas" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tambah Tugas
                    </h1>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah Tugas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Judul */}
                                <div className="md:col-span-2">
                                    <Label htmlFor="judul">Judul</Label>
                                    <Input
                                        id="judul"
                                        type="text"
                                        value={data.judul}
                                        onChange={(e) =>
                                            setData("judul", e.target.value)
                                        }
                                        placeholder="Judul Tugas"
                                        required
                                    />
                                    {errors.judul && (
                                        <p className="text-red-500 text-sm">
                                            {errors.judul}
                                        </p>
                                    )}
                                </div>

                                {/* Tipe */}
                                <div>
                                    <Label htmlFor="tipe">Tipe</Label>
                                    <Select
                                        value={data.tipe}
                                        onValueChange={(value) =>
                                            setData("tipe", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kuis">
                                                Kuis
                                            </SelectItem>
                                            <SelectItem value="ujian">
                                                Ujian
                                            </SelectItem>
                                            <SelectItem value="tugas">
                                                Tugas
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.tipe && (
                                        <p className="text-red-500 text-sm">
                                            {errors.tipe}
                                        </p>
                                    )}
                                </div>

                                {/* Mata Pelajaran */}
                                <div>
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
                                            {mapels.map((mapel) => (
                                                <SelectItem
                                                    key={mapel.id}
                                                    value={mapel.id.toString()}
                                                >
                                                    {mapel.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.mapel_id && (
                                        <p className="text-red-500 text-sm">
                                            {errors.mapel_id}
                                        </p>
                                    )}
                                </div>

                                {/* Kelas */}
                                <div>
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
                                            {kelas.map((k) => (
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
                                        <p className="text-red-500 text-sm">
                                            {errors.kelas_id}
                                        </p>
                                    )}
                                </div>

                                {/* Deadline */}
                                <div>
                                    <Label htmlFor="deadline">Deadline</Label>
                                    <Input
                                        id="deadline"
                                        type="datetime-local"
                                        value={data.deadline}
                                        onChange={(e) =>
                                            setData("deadline", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.deadline && (
                                        <p className="text-red-500 text-sm">
                                            {errors.deadline}
                                        </p>
                                    )}
                                </div>

                                {/* File Soal */}
                                <div className="md:col-span-2">
                                    <Label htmlFor="file">
                                        File Soal (opsional)
                                    </Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        onChange={(e) =>
                                            setData("file", e.target.files[0])
                                        }
                                    />
                                    {errors.file && (
                                        <p className="text-red-500 text-sm">
                                            {errors.file}
                                        </p>
                                    )}
                                </div>

                                {/* Link Soal */}
                                <div className="md:col-span-2">
                                    <Label htmlFor="link_soal">
                                        Link Soal (opsional)
                                    </Label>
                                    <Input
                                        id="link_soal"
                                        type="url"
                                        value={data.link_soal}
                                        onChange={(e) =>
                                            setData("link_soal", e.target.value)
                                        }
                                        placeholder="https://example.com/soal"
                                    />
                                    {errors.link_soal && (
                                        <p className="text-red-500 text-sm">
                                            {errors.link_soal}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Tombol aksi */}
                            <div className="flex justify-end space-x-2 mt-4">
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
