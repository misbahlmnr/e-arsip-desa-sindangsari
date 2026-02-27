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

export default function Create({ mapels }) {
    const { data, setData, post, processing, errors } = useForm({
        mapel_id: "",
        min_score: "",
        kategori_rekomendasi: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.adaptive-rule.store"));
    };

    return (
        <AppLayout>
            <Head title="Tambah Adaptive Rule" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tambah Adaptive Rule
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={route("admin.adaptive-rule.index")}>
                            Kembali
                        </Link>
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah Adaptive Rule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                {/* Min Score */}
                                <div className="space-y-2">
                                    <Label htmlFor="min_score">Min Score</Label>
                                    <Input
                                        id="min_score"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.min_score}
                                        onChange={(e) =>
                                            setData("min_score", e.target.value)
                                        }
                                        placeholder="0.00"
                                        required
                                    />
                                    {errors.min_score && (
                                        <p className="text-sm text-red-600">
                                            {errors.min_score}
                                        </p>
                                    )}
                                </div>

                                {/* Kategori Rekomendasi */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="kategori_rekomendasi">
                                        Kategori Rekomendasi
                                    </Label>
                                    <Input
                                        id="kategori_rekomendasi"
                                        type="text"
                                        value={data.kategori_rekomendasi}
                                        onChange={(e) =>
                                            setData(
                                                "kategori_rekomendasi",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Kategori Rekomendasi"
                                        required
                                    />
                                    {errors.kategori_rekomendasi && (
                                        <p className="text-sm text-red-600">
                                            {errors.kategori_rekomendasi}
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
