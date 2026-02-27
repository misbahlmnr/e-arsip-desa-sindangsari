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

export default function Edit({ jadwal, kelas, mapels, gurus }) {
    const { data, setData, put, processing, errors } = useForm({
        kelas_id: jadwal.kelas_id?.toString() || "",
        mapel_id: jadwal.mapel_id?.toString() || "",
        guru_id: jadwal.guru_id?.toString() || "",
        hari: jadwal.hari || "",
        jam_mulai: jadwal.jam_mulai || "",
        jam_selesai: jadwal.jam_selesai || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.jadwal.update", jadwal.id));
    };

    const hariOptions = [
        { value: "Senin", label: "Senin" },
        { value: "Selasa", label: "Selasa" },
        { value: "Rabu", label: "Rabu" },
        { value: "Kamis", label: "Kamis" },
        { value: "Jumat", label: "Jumat" },
        { value: "Sabtu", label: "Sabtu" },
        { value: "Minggu", label: "Minggu" },
    ];

    return (
        <AppLayout>
            <Head title="Edit Jadwal" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Edit Jadwal
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={route("admin.jadwal.index")}>Kembali</Link>
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Jadwal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                {/* Guru */}
                                <div className="space-y-2">
                                    <Label htmlFor="guru_id">Guru</Label>
                                    <Select
                                        value={data.guru_id}
                                        onValueChange={(value) =>
                                            setData("guru_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Guru" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gurus?.map((g) => (
                                                <SelectItem
                                                    key={g.id}
                                                    value={g.id.toString()}
                                                >
                                                    {g.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.guru_id && (
                                        <p className="text-sm text-red-600">
                                            {errors.guru_id}
                                        </p>
                                    )}
                                </div>

                                {/* Hari */}
                                <div className="space-y-2">
                                    <Label htmlFor="hari">Hari</Label>
                                    <Select
                                        value={data.hari}
                                        onValueChange={(value) =>
                                            setData("hari", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Hari" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hariOptions.map((h) => (
                                                <SelectItem
                                                    key={h.value}
                                                    value={h.value}
                                                >
                                                    {h.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.hari && (
                                        <p className="text-sm text-red-600">
                                            {errors.hari}
                                        </p>
                                    )}
                                </div>

                                {/* Jam Mulai */}
                                <div className="space-y-2">
                                    <Label htmlFor="jam_mulai">Jam Mulai</Label>
                                    <Input
                                        id="jam_mulai"
                                        type="time"
                                        value={data.jam_mulai}
                                        onChange={(e) =>
                                            setData("jam_mulai", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.jam_mulai && (
                                        <p className="text-sm text-red-600">
                                            {errors.jam_mulai}
                                        </p>
                                    )}
                                </div>

                                {/* Jam Selesai */}
                                <div className="space-y-2">
                                    <Label htmlFor="jam_selesai">
                                        Jam Selesai
                                    </Label>
                                    <Input
                                        id="jam_selesai"
                                        type="time"
                                        value={data.jam_selesai}
                                        onChange={(e) =>
                                            setData(
                                                "jam_selesai",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {errors.jam_selesai && (
                                        <p className="text-sm text-red-600">
                                            {errors.jam_selesai}
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
                                    {processing
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
