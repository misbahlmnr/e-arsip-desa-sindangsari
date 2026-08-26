import Checkbox from "@/components/Checkbox";
import InputError from "@/components/InputError";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head, Link, useForm } from "@inertiajs/react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const [showPw, setShowPw] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen w-full grid lg:grid-cols-2 bg-card">
                <aside className="hidden lg:flex flex-col justify-between bg-gradient-primary text-white p-12 relative overflow-hidden">
                    <div
                        className="absolute top-0 right-0 w-72 h-full bg-white/5"
                        aria-hidden
                    />
                    <div
                        className="absolute bottom-0 left-0 w-full h-1.5 flex"
                        aria-hidden
                    >
                        <span className="flex-[3] bg-sidebar-primary" />
                        <span className="flex-1 bg-warning" />
                        <span className="w-10 bg-destructive" />
                    </div>

                    <div className="relative flex items-center gap-3">
                        <BrandLogo className="size-16 shrink-0" />
                        <div>
                            <h1 className="text-lg font-semibold tracking-tight leading-none">
                                Desa Sindangsari
                            </h1>
                            <p className="text-[11px] uppercase tracking-[0.16em] opacity-70 mt-1.5">
                                Sistem Arsip Surat
                            </p>
                        </div>
                    </div>

                    <div className="relative max-w-md">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-sidebar-primary font-semibold mb-3">
                            E-Arsip Desa
                        </p>
                        <h2 className="text-3xl font-semibold leading-tight tracking-tight">
                            Kelola surat desa dengan rapi dan terstruktur.
                        </h2>
                        <p className="mt-4 text-sm opacity-80 leading-relaxed">
                            Pencatatan surat masuk, surat keluar, disposisi, dan
                            arsip dalam satu sistem. Dirancang untuk administrasi
                            kantor desa.
                        </p>
                    </div>

                    <div className="relative text-xs opacity-60">
                        © {new Date().getFullYear()} Kantor Desa Sindangsari —
                        Kec. Cimerak, Kab. Pangandaran
                    </div>
                </aside>

                <main className="flex items-center justify-center p-6 md:p-10 bg-background">
                    <div className="w-full max-w-md bg-card border border-border p-8">
                        <div className="mb-8 lg:hidden flex items-center gap-3">
                            <BrandLogo className="size-12 shrink-0" />
                            <div>
                                <h1 className="text-base font-semibold tracking-tight leading-none">
                                    Desa Sindangsari
                                </h1>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Sistem Arsip Surat
                                </p>
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold tracking-tight text-foreground">
                            Masuk ke sistem
                        </h2>
                        <p className="text-muted-foreground mt-1.5 text-sm">
                            Gunakan akun petugas untuk mengakses e-arsip desa.
                        </p>

                        {status && (
                            <div className="mt-4 p-3 bg-success-soft border border-success/20">
                                <p className="text-sm font-medium text-success">
                                    {status}
                                </p>
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <div className="space-y-2">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-foreground"
                                >
                                    Username
                                </label>
                                <Input
                                    id="username"
                                    type="text"
                                    name="username"
                                    autoComplete="username"
                                    placeholder="Masukkan username Anda"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                    disabled={processing}
                                />
                                <InputError
                                    message={errors.username}
                                    className="mt-1"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-foreground"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPw ? "text" : "password"}
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="Masukkan password Anda"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        disabled={processing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw((s) => !s)}
                                        aria-label={
                                            showPw
                                                ? "Sembunyikan password"
                                                : "Tampilkan password"
                                        }
                                        className="absolute inset-y-0 right-0 px-4 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPw ? (
                                            <EyeOff className="size-5" />
                                        ) : (
                                            <Eye className="size-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-1"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium text-foreground cursor-pointer select-none"
                                    >
                                        Ingat saya di perangkat ini
                                    </label>
                                </div>

                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-sm text-primary hover:text-primary-hover transition-colors"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>

                            {(errors.username || errors.password) && (
                                <div
                                    role="alert"
                                    className="flex items-start gap-2.5 bg-destructive-soft border border-destructive/20 px-4 py-3 text-sm text-destructive"
                                >
                                    <AlertCircle className="size-4 mt-0.5 shrink-0" />
                                    <span>
                                        Username atau password salah. Silakan
                                        coba lagi.
                                    </span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 flex items-center justify-center gap-2 text-sm font-semibold"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Memproses…
                                    </>
                                ) : (
                                    "Masuk"
                                )}
                            </Button>
                        </form>

                        <p className="text-xs text-muted-foreground text-center mt-6">
                            Sistem ini dilindungi dan hanya dapat diakses oleh
                            petugas berwenang.
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
