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

export default function Edit({ siswa, kelas }) {
    const { data, setData, put, processing, errors } = useForm({
        name: siswa.name || "",
        email: siswa.email || "",
        password: "",
        password_confirmation: "",
        nis: siswa.siswa_profile ? siswa.siswa_profile.nis : "",
        nisn: siswa.siswa_profile ? siswa.siswa_profile.nisn : "",
        jenis_kelamin: siswa.siswa_profile
            ? siswa.siswa_profile.jenis_kelamin
            : "",
        tempat_lahir: siswa.siswa_profile
            ? siswa.siswa_profile.tempat_lahir
            : "",
        tanggal_lahir: siswa.siswa_profile
            ? siswa.siswa_profile.tanggal_lahir
            : "",
        no_hp: siswa.siswa_profile ? siswa.siswa_profile.no_hp : "",
        angkatan: siswa.siswa_profile ? siswa.siswa_profile.angkatan : "",
        status: siswa.siswa_profile ? siswa.siswa_profile.status : "aktif",
        nama_ortu: siswa.siswa_profile ? siswa.siswa_profile.nama_ortu : "",
        kontak_ortu: siswa.siswa_profile ? siswa.siswa_profile.kontak_ortu : "",
        kelas_id:
            siswa.siswa_profile && siswa.siswa_profile.kelas
                ? siswa.siswa_profile.kelas.id.toString()
                : "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.manajemen-user.siswas.update", siswa.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Siswa" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Edit Siswa
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={route("admin.manajemen-user.siswas.index")}>
                            Kembali
                        </Link>
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Akun Siswa</CardTitle>
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
                                    <Label htmlFor="password">
                                        Password Baru (Opsional)
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Kosongkan jika tidak ingin mengubah"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Konfirmasi Password Baru
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
                                        placeholder="Konfirmasi password baru"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-600">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <hr className="my-6" />

                            {/* === PROFIL SISWA === */}
                            <CardTitle>Data Profil Siswa</CardTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nis">NIS</Label>
                                    <Input
                                        id="nis"
                                        value={data.nis}
                                        onChange={(e) =>
                                            setData("nis", e.target.value)
                                        }
                                        placeholder="Masukkan NIS"
                                        required
                                    />
                                    {errors.nis && (
                                        <p className="text-sm text-red-600">
                                            {errors.nis}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nisn">NISN</Label>
                                    <Input
                                        id="nisn"
                                        value={data.nisn}
                                        onChange={(e) =>
                                            setData("nisn", e.target.value)
                                        }
                                        placeholder="Masukkan NISN"
                                        required
                                    />
                                    {errors.nisn && (
                                        <p className="text-sm text-red-600">
                                            {errors.nisn}
                                        </p>
                                    )}
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
                                    <Label htmlFor="angkatan">Angkatan</Label>
                                    <Input
                                        id="angkatan"
                                        value={data.angkatan}
                                        onChange={(e) =>
                                            setData("angkatan", e.target.value)
                                        }
                                        placeholder="Masukkan angkatan"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status || "aktif"}
                                        onValueChange={(value) =>
                                            setData("status", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aktif">
                                                Aktif
                                            </SelectItem>
                                            <SelectItem value="lulus">
                                                Lulus
                                            </SelectItem>
                                            <SelectItem value="pindah">
                                                Pindah
                                            </SelectItem>
                                            <SelectItem value="tidak_aktif">
                                                Tidak Aktif
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_ortu">
                                        Nama Orang Tua
                                    </Label>
                                    <Input
                                        id="nama_ortu"
                                        value={data.nama_ortu}
                                        onChange={(e) =>
                                            setData("nama_ortu", e.target.value)
                                        }
                                        placeholder="Masukkan nama orang tua"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kontak_ortu">
                                        Kontak Orang Tua
                                    </Label>
                                    <Input
                                        id="kontak_ortu"
                                        value={data.kontak_ortu}
                                        onChange={(e) =>
                                            setData(
                                                "kontak_ortu",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Masukkan kontak orang tua"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="kelas_id">Kelas</Label>
                                    <Select
                                        value={
                                            data.kelas_id?.toString() || "none"
                                        }
                                        onValueChange={(value) =>
                                            setData(
                                                "kelas_id",
                                                value === "none" ? "" : value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Tidak ada kelas
                                            </SelectItem>
                                            {kelas.map((k) => (
                                                <SelectItem
                                                    key={k.id}
                                                    value={k.id.toString()}
                                                >
                                                    {k.nama} (Tingkat{" "}
                                                    {k.tingkat})
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
