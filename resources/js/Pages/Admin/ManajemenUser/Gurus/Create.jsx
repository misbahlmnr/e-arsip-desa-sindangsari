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
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Textarea } from "@/Components/ui/textarea";

export default function Create({ mapels }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        mapel_ids: [],
        nip: "",
        jenis_kelamin: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        alamat: "",
        no_hp: "",
        status_kepegawaian: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.manajemen-user.gurus.store"));
    };

    const handleMapelChange = (mapelId, checked) => {
        if (checked) {
            setData("mapel_ids", [...data.mapel_ids, mapelId]);
        } else {
            setData(
                "mapel_ids",
                data.mapel_ids.filter((id) => id !== mapelId)
            );
        }
    };

    return (
        <AppLayout>
            <Head title="Tambah Guru" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tambah Guru
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={route("admin.manajemen-user.gurus.index")}>
                            Kembali
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Data Akun Guru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* === DATA AKUN === */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="Masukkan email"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Masukkan password"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Konfirmasi Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Konfirmasi password"
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-600">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label>Mata Pelajaran (Opsional)</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {mapels.map((mapel) => (
                                            <div
                                                key={mapel.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`mapel-${mapel.id}`}
                                                    checked={data.mapel_ids.includes(
                                                        mapel.id
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleMapelChange(
                                                            mapel.id,
                                                            checked
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`mapel-${mapel.id}`}
                                                    className="text-sm font-normal"
                                                >
                                                    {mapel.nama}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.mapel_ids && (
                                        <p className="text-sm text-red-600">
                                            {errors.mapel_ids}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <hr className="my-6" />

                            {/* === PROFIL GURU === */}
                            <CardTitle>Data Profil Guru</CardTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nip">NIP</Label>
                                    <Input
                                        id="nip"
                                        value={data.nip}
                                        onChange={(e) =>
                                            setData("nip", e.target.value)
                                        }
                                        placeholder="Masukkan NIP"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jenis_kelamin">
                                        Jenis Kelamin
                                    </Label>
                                    <Select
                                        value={data.jenis_kelamin || "none"}
                                        onValueChange={(value) =>
                                            setData(
                                                "jenis_kelamin",
                                                value === "none" ? "" : value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Pilih jenis kelamin
                                            </SelectItem>
                                            <SelectItem value="Laki-laki">
                                                Laki-laki
                                            </SelectItem>
                                            <SelectItem value="Perempuan">
                                                Perempuan
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tempat_lahir">
                                        Tempat Lahir
                                    </Label>
                                    <Input
                                        id="tempat_lahir"
                                        value={data.tempat_lahir}
                                        onChange={(e) =>
                                            setData(
                                                "tempat_lahir",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Masukkan tempat lahir"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_lahir">
                                        Tanggal Lahir
                                    </Label>
                                    <Input
                                        id="tanggal_lahir"
                                        type="date"
                                        value={data.tanggal_lahir}
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_lahir",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Textarea
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) =>
                                            setData("alamat", e.target.value)
                                        }
                                        placeholder="Masukkan alamat lengkap"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="no_hp">No HP</Label>
                                    <Input
                                        id="no_hp"
                                        value={data.no_hp}
                                        onChange={(e) =>
                                            setData("no_hp", e.target.value)
                                        }
                                        placeholder="Masukkan nomor HP"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status_kepegawaian">
                                        Status Kepegawaian
                                    </Label>
                                    <Select
                                        value={
                                            data.status_kepegawaian || "none"
                                        }
                                        onValueChange={(value) =>
                                            setData(
                                                "status_kepegawaian",
                                                value === "none" ? "" : value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status kepegawaian" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Pilih status kepegawaian
                                            </SelectItem>
                                            <SelectItem value="pns">
                                                PNS
                                            </SelectItem>
                                            <SelectItem value="honorer">
                                                Honorer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6">
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
