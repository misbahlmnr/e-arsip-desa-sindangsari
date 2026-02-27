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

export default function Create({ gurus }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: "",
        tingkat: "",
        wali_kelas_id: "none",
    });

    const submit = (e) => {
        e.preventDefault();
        const payload = {
            ...data,
            wali_kelas_id:
                data.wali_kelas_id === "none" ? null : data.wali_kelas_id,
        };
        post(route("admin.kelas.store"), payload);
    };

    return (
        <AppLayout>
            <Head title="Tambah Kelas" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tambah Kelas
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={route("admin.kelas.index")}>Kembali</Link>
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah Kelas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama Kelas */}
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Kelas</Label>
                                    <Input
                                        id="nama"
                                        type="text"
                                        value={data.nama}
                                        onChange={(e) =>
                                            setData("nama", e.target.value)
                                        }
                                        placeholder="Masukan nama kelas"
                                        required
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-red-600">
                                            {errors.nama}
                                        </p>
                                    )}
                                </div>

                                {/* Tingkat */}
                                <div className="space-y-2">
                                    <Label htmlFor="tingkat">Tingkat</Label>
                                    <Input
                                        id="tingkat"
                                        type="number"
                                        min="1"
                                        max="12"
                                        value={data.tingkat}
                                        onChange={(e) =>
                                            setData("tingkat", e.target.value)
                                        }
                                        placeholder="Masukan tingkat kelas"
                                        required
                                    />
                                    {errors.tingkat && (
                                        <p className="text-sm text-red-600">
                                            {errors.tingkat}
                                        </p>
                                    )}
                                </div>

                                {/* Wali Kelas */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="wali_kelas_id">
                                        Wali Kelas
                                    </Label>
                                    <Select
                                        value={data.wali_kelas_id}
                                        onValueChange={(value) =>
                                            setData("wali_kelas_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih wali kelas (opsional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Tidak ada
                                            </SelectItem>
                                            {gurus?.length > 0 ? (
                                                gurus.map((guru) => (
                                                    <SelectItem
                                                        key={guru.id}
                                                        value={guru.id.toString()}
                                                    >
                                                        {guru.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem
                                                    value="no-guru"
                                                    disabled
                                                >
                                                    Tidak ada data guru
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.wali_kelas_id && (
                                        <p className="text-sm text-red-600">
                                            {errors.wali_kelas_id}
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
