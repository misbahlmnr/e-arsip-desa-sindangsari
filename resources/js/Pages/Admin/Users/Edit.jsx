import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import AppLayout from "@/Layouts/AppLayout";
import { cn } from "@/lib/utils";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useMemo, useState } from "react";

const ROLE_OPTIONS = [
    { value: "admin", label: "Admin" },
    { value: "sekdes", label: "Sekretaris Desa" },
    { value: "kades", label: "Kepala Desa" },
];

export default function UsersEdit({ user }) {
    const { props } = usePage();
    const pageErrors = props.errors ?? {};
    const authUserId = props.auth?.user?.id;
    const isSelf = authUserId === user.id;
    const [busy, setBusy] = useState(false);

    const defaults = useMemo(
        () => ({
            name: user.name ?? "",
            username: user.username ?? "",
            email: user.email ?? "",
            password: "",
            password_confirmation: "",
            role: user.role ?? "sekdes",
        }),
        [user],
    );

    const { data, setData } = useForm(defaults);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = route("admin.users.update", { user: user.id });
        const fields = {
            name: data.name,
            username: data.username,
            email: data.email,
            role: data.role,
        };
        const pwd = data.password?.trim();
        if (pwd) {
            fields.password = data.password;
            fields.password_confirmation = data.password_confirmation;
        }

        router.put(url, fields, {
            preserveScroll: true,
            onStart: () => setBusy(true),
            onFinish: () => setBusy(false),
        });
    };

    const errors = pageErrors;

    return (
        <AppLayout
            title="Edit Pengguna"
            subtitle="Perbarui data dan peran pengguna."
        >
            <Head title={`Edit — ${user.name}`} />

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
                                className="h-11 rounded-xl"
                                autoComplete="email"
                            />
                        </FormField>
                        <FormField
                            label="Kata sandi baru"
                            hint="Opsional"
                            error={errors.password}
                        >
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                placeholder="Kosongkan jika tidak diubah"
                                className="h-11 rounded-xl"
                                autoComplete="new-password"
                            />
                        </FormField>
                        <FormField
                            label="Ulangi kata sandi"
                            hint="Opsional"
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
                                disabled={isSelf}
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
                            {isSelf ? (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Peran akun sendiri tidak dapat diubah dari
                                    sini.
                                </p>
                            ) : null}
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
                            disabled={busy}
                            className="rounded-xl h-11 px-6 font-semibold"
                        >
                            <Save className="size-4 mr-1.5" />
                            {busy ? "Menyimpan…" : "Simpan Perubahan"}
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-1 surface-card p-6 md:p-8 space-y-4">
                    <h3 className="font-bold text-base">Informasi</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Pengguna:{" "}
                        <span className="font-mono font-medium text-foreground">
                            {user.username}
                        </span>
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
