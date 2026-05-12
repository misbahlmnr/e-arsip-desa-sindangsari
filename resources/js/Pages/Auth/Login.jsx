import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Head, Link, useForm } from "@inertiajs/react";
import { AlertCircle, Eye, EyeOff, FileText, Loader2 } from "lucide-react";
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

            <div className="min-h-screen w-full grid lg:grid-cols-2 bg-white">
                {/* Left: brand panel */}
                <aside className="hidden lg:flex flex-col justify-between bg-gradient-primary text-white p-12 relative overflow-hidden">
                    <div
                        className="absolute -top-32 -right-32 size-96 rounded-full bg-white/5"
                        aria-hidden
                    />
                    <div
                        className="absolute -bottom-40 -left-20 size-[500px] rounded-full bg-white/5"
                        aria-hidden
                    />

                    <div className="relative flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                            <FileText className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight leading-none">
                                Desa Sindangsari
                            </h1>
                            <p className="text-xs uppercase tracking-widest opacity-75 mt-1.5">
                                Sistem Arsip Surat
                            </p>
                        </div>
                    </div>

                    <div className="relative max-w-md">
                        <h2 className="text-3xl font-bold leading-tight tracking-tight">
                            Kelola surat desa dengan rapi, tanpa ribet.
                        </h2>
                        <p className="mt-4 text-base opacity-85 leading-relaxed">
                            Pencatatan surat masuk, surat keluar, disposisi, dan
                            arsip dalam satu tempat. Dibuat sederhana untuk
                            pegawai kantor desa.
                        </p>
                    </div>

                    <div className="relative text-xs opacity-70">
                        © {new Date().getFullYear()} Kantor Desa Sindangsari —
                        Kec. Cimerak, Kab. Pangandaran
                    </div>
                </aside>

                {/* Right: form */}
                <main className="flex items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-md">
                        {/* Mobile logo */}
                        <div className="mb-8 lg:hidden flex items-center gap-3">
                            <div className="size-11 rounded-xl bg-primary text-white flex items-center justify-center">
                                <FileText className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight leading-none">
                                    Desa Sindangsari
                                </h1>
                                <p className="text-xs text-gray-500 mt-1">
                                    Sistem Arsip Surat
                                </p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Selamat datang kembali
                        </h2>
                        <p className="text-gray-500 mt-1.5 text-sm">
                            Masuk untuk mengakses sistem arsip surat desa.
                        </p>

                        {/* Status message (e.g. after password reset) */}
                        {status && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm font-medium text-green-800">
                                    {status}
                                </p>
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            {/* Username */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700"
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

                            {/* Password */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
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
                                        className="absolute inset-y-0 right-0 px-4 text-gray-400 hover:text-gray-600 transition-colors"
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

                            {/* Remember + Forgot */}
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
                                        className="text-sm font-medium text-gray-700 cursor-pointer select-none"
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

                            {/* General error alert */}
                            {(errors.username || errors.password) && (
                                <div
                                    role="alert"
                                    className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                                >
                                    <AlertCircle className="size-4 mt-0.5 shrink-0" />
                                    <span>
                                        Username atau password salah. Silakan
                                        coba lagi.
                                    </span>
                                </div>
                            )}

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 flex items-center justify-center gap-2 text-base font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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

                        <p className="text-xs text-gray-400 text-center mt-6">
                            Sistem ini dilindungi dan hanya dapat diakses oleh
                            petugas berwenang.
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
