import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/layouts/AppLayout";
import { cn } from "@/shared/lib/utils";
import { Head, Link, useForm } from "@inertiajs/react";
import { Save } from "lucide-react";

const ROLE_OPTIONS = [
    { value: "admin", label: "Admin" },
    { value: "sekdes", label: "Sekretaris Desa" },
    { value: "kades", label: "Kepala Desa" },
];

export default function UsersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "sekdes",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.users.store"));
    };

    return (
        <AppLayout
            title="Tambah Pengguna"
            subtitle="Buat akun baru untuk mengakses sistem sesuai perannya."
        >
            <Head title="Tambah Pengguna" />

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                noValidate
            >
                <div className="lg:col-span-2 surface-card p-6 md:p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                            label="Nama lengkap"
                            required
                            error={errors.name}
                        >
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Nama untuk ditampilkan"
                                className="h-11 rounded-xl"
                                autoComplete="name"
                            />
                        </FormField>
                        <FormField
                            label="Username"
                            required
                            error={errors.username}
                        >
                            <Input
                                value={data.username}
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                                placeholder="huruf-angka_dash"
                                className="h-11 rounded-xl font-mono"
                                autoComplete="username"
                            />
                        </FormField>
                        <FormField
                            label="Email"
                            required
                            error={errors.email}
                            className="md:col-span-2"
                        >
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="nama@domain.com"
                                className="h-11 rounded-xl"
                                autoComplete="email"
                            />
                        </FormField>
                        <FormField
                            label="Kata sandi"
                            required
                            error={errors.password}
                        >
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                placeholder="Minimal 8 karakter"
                                className="h-11 rounded-xl"
                                autoComplete="new-password"
                            />
                        </FormField>
                        <FormField
                            label="Ulangi kata sandi"
                            required
                            error={errors.password_confirmation}
                        >
                            <Input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                placeholder="Sama seperti di atas"
                                className="h-11 rounded-xl"
                                autoComplete="new-password"
                            />
                        </FormField>
                        <FormField
                            label="Peran"
                            required
                            error={errors.role}
                            className="md:col-span-2"
                        >
                            <Select
                                value={data.role}
                                onValueChange={(v) => setData("role", v)}
                            >
                                <SelectTrigger className="h-11 rounded-xl w-full md:max-w-md">
                                    <SelectValue placeholder="Pilih peran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLE_OPTIONS.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <Button asChild variant="ghost" className="rounded-xl">
                            <Link href={route("admin.users.index")}>
                                Batal
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl h-11 px-6 font-semibold"
                        >
                            <Save className="size-4 mr-1.5" />
                            {processing ? "Menyimpan…" : "Simpan Pengguna"}
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-1 surface-card p-6 md:p-8 space-y-4">
                    <h3 className="font-bold text-base">Petunjuk</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Pilih peran yang sesuai: <strong>Admin</strong> mengelola
                        master data dan pengguna;{" "}
                        <strong>Sekretaris Desa</strong> dan{" "}
                        <strong>Kepala Desa</strong> untuk alur kerja surat
                        sesuai kebijakan desa Anda.
                    </p>
                </div>
            </form>
        </AppLayout>
    );
}

function FormField({ label, required, hint, error, children, className }) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <Label className="flex items-center gap-1.5">
                {label}
                {required && <span className="text-destructive">*</span>}
                {hint ? (
                    <span className="text-xs text-muted-foreground font-normal">
                        ({hint})
                    </span>
                ) : null}
            </Label>
            {children}
            {error ? (
                <p className="text-xs text-destructive font-medium">{error}</p>
            ) : null}
        </div>
    );
}
