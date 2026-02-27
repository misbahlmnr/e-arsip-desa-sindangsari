import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

export default function Create({ gurus }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: "",
        guru_ids: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.mapel.store"));
    };

    const handleGuruChange = (guruId, checked) => {
        if (checked) {
            setData("guru_ids", [...data.guru_ids, guruId]);
        } else {
            setData(
                "guru_ids",
                data.guru_ids.filter((id) => id !== guruId)
            );
        }
    };

    return (
        <AppLayout>
            <Head title="Tambah Mata Pelajaran" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tambah Mata Pelajaran
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={route("admin.mapel.index")}>Kembali</Link>
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah Mata Pelajaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama Mata Pelajaran */}
                                <div className="space-y-2">
                                    <Label htmlFor="nama">
                                        Nama Mata Pelajaran
                                    </Label>
                                    <Input
                                        id="nama"
                                        type="text"
                                        value={data.nama}
                                        onChange={(e) =>
                                            setData("nama", e.target.value)
                                        }
                                        placeholder="Nama Mata Pelajaran"
                                        required
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-red-600">
                                            {errors.nama}
                                        </p>
                                    )}
                                </div>

                                {/* Guru Pengajar */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Guru Pengajar</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {gurus?.length > 0 ? (
                                            gurus.map((guru) => (
                                                <div
                                                    key={guru.id}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox
                                                        id={`guru-${guru.id}`}
                                                        checked={data.guru_ids.includes(
                                                            guru.id.toString()
                                                        )}
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            handleGuruChange(
                                                                guru.id.toString(),
                                                                checked
                                                            )
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={`guru-${guru.id}`}
                                                        className="text-sm font-normal"
                                                    >
                                                        {guru.name}
                                                    </Label>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Tidak ada data guru.
                                            </p>
                                        )}
                                    </div>
                                    {errors.guru_ids && (
                                        <p className="text-sm text-red-600">
                                            {errors.guru_ids}
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
