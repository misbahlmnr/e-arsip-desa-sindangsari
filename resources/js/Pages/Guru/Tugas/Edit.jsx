import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
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

export default function EditTugas({ tugas, mapels, kelas }) {
    const [data, setData] = useState({
        judul: tugas.judul || "",
        tipe: tugas.tipe || "",
        mapel_id: tugas.mapel_id?.toString() || "",
        kelas_id: tugas.kelas_id?.toString() || "",
        deadline: tugas.deadline
            ? new Date(tugas.deadline).toISOString().slice(0, 16)
            : "",
        file: null,
        link_soal: tugas.link_soal || "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        router.post(
            route("guru.tugas.update", tugas.id),
            {
                _method: "put",
                forceFormData: true,
                ...data,
            },
            {
                onSuccess: () => {
                    console.info("sukses");
                },
                onError: (err) => {
                    if (err) setErrors(err);
                },
                onFinish: () => {
                    setLoading(false);
                },
            }
        );
    };

    console.log("loading", loading);

    return (
        <AppLayout>
            <Head title="Edit Tugas" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Edit Tugas
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={route("guru.tugas.index")}>Kembali</Link>
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Tugas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Judul */}
                                <div className="md:col-span-2">
                                    <Label htmlFor="judul">Judul</Label>
                                    <Input
                                        id="judul"
                                        type="text"
                                        value={data.judul}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                judul: e.target.value,
                                            })
                                        }
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
                                            setData({ ...data, tipe: value })
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
                                            setData({
                                                ...data,
                                                mapel_id: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Mata Pelajaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mapels.map((m) => (
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
                                            setData({
                                                ...data,
                                                kelas_id: value,
                                            })
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
                                            setData({
                                                ...data,
                                                deadline: e.target.value,
                                            })
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
                                            setData({
                                                ...data,
                                                file: e.target.files[0],
                                            })
                                        }
                                    />
                                    {tugas.file_path && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            File saat ini:{" "}
                                            <span className="font-medium">
                                                {tugas.file_path
                                                    .split("/")
                                                    .pop()}
                                            </span>
                                        </p>
                                    )}
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
                                            setData({
                                                ...data,
                                                link_soal: e.target.value,
                                            })
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
                            <div className="flex justify-end space-x-4 mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
