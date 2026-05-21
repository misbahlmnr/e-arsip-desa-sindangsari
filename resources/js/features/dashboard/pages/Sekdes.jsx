import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/AppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Archive, ArrowRight, FileInput, FileOutput } from "lucide-react";

export default function Dashboard() {
    const { auth } = usePage().props;
    const recent = [];

    const greet = (() => {
        const h = new Date().getHours();
        if (h < 11) return "Selamat pagi";
        if (h < 15) return "Selamat siang";
        if (h < 19) return "Selamat sore";
        return "Selamat malam";
    })();

    return (
        <AppLayout
            title="Beranda"
            subtitle={`${greet}, ${auth.user.name}. Kelola surat masuk dan disposisi dari sini.`}
        >
            <Head title="Beranda Sekretaris Desa" />

            <section aria-labelledby="akses-cepat" className="mb-6">
                <h3 id="akses-cepat" className="sr-only">
                    Akses cepat
                </h3>
                <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" className="rounded-xl">
                        <Link href={route("admin.surat-masuk.index")}>
                            <FileInput className="size-4 mr-1.5" />
                            Surat Masuk
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-xl">
                        <Link href={route("admin.arsip-surat.index")}>
                            <Archive className="size-4 mr-1.5" />
                            Arsip Surat
                        </Link>
                    </Button>
                </div>
            </section>

            <section aria-labelledby="ringkasan" className="space-y-6">
                <h3 id="ringkasan" className="sr-only">
                    Ringkasan
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        label="Surat Masuk"
                        value={0}
                        hint="Surat yang perlu diproses"
                        icon={FileInput}
                        tone="primary"
                    />
                    <StatCard
                        label="Disposisi"
                        value={0}
                        hint="Menunggu disposisi ke Kepala Desa"
                        icon={FileOutput}
                        tone="warning"
                    />
                    <StatCard
                        label="Arsip"
                        value={0}
                        hint="Surat yang telah diselesaikan"
                        icon={Archive}
                        tone="success"
                    />
                </div>
            </section>

            <section aria-labelledby="aktivitas" className="mt-8">
                <div className="surface-card overflow-hidden">
                    <div className="flex items-center justify-between gap-4 px-6 md:px-8 py-5 border-b border-border">
                        <div>
                            <h3
                                id="aktivitas"
                                className="text-base font-bold tracking-tight"
                            >
                                Surat Masuk Terbaru
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Daftar surat terakhir yang diterima
                            </p>
                        </div>
                    </div>

                    {recent.length === 0 ? (
                        <div className="px-8 py-16 text-center">
                            <div className="mx-auto size-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                                <FileInput className="size-6 text-muted-foreground" />
                            </div>
                            <p className="font-semibold">Belum ada surat masuk</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Surat masuk baru akan tampil di sini.
                            </p>
                        </div>
                    ) : (
                        <div className="px-6 md:px-8 py-4">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="rounded-lg h-10 text-sm"
                            >
                                <Link href="#">
                                    Lihat semua{" "}
                                    <ArrowRight className="size-4 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </AppLayout>
    );
}

const StatCard = ({ label, value, hint, icon: Icon, tone }) => {
    const toneClasses = {
        primary: "bg-primary-soft text-primary",
        warning: "bg-warning-soft text-warning",
        success: "bg-success-soft text-success",
    }[tone];

    return (
        <div className="surface-card surface-card-hover p-7">
            <div className="flex items-start justify-between gap-4">
                <div
                    className={`size-12 rounded-xl ${toneClasses} flex items-center justify-center`}
                >
                    <Icon className="size-5" strokeWidth={2.2} />
                </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-5">
                {label}
            </p>
            <div className="flex items-baseline gap-3 mt-1.5">
                <span className="text-4xl font-extrabold tracking-tight tabular-nums text-foreground">
                    {value}
                </span>
            </div>
            {hint && (
                <p className="text-sm text-muted-foreground mt-2">{hint}</p>
            )}
        </div>
    );
};
