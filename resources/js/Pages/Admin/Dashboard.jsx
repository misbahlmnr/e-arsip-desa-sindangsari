import { StatusBadge } from "@/Components/StatusBadge";
import { Button } from "@/Components/ui/button";
import AppLayout from "@/Layouts/AppLayout";
import { formatDate } from "@/lib/utils";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Inbox,
    Send,
    Archive,
    FileInput,
    ArrowRight,
    FileOutput,
} from "lucide-react";

export default function Dashboard() {
    const { props } = usePage();
    const data = props;

    const stats = [
        {
            title: "Total Surat Masuk",
            value: data.total_surat_masuk || 0,
            icon: Inbox,
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
        },
        {
            title: "Total Surat Keluar",
            value: data.total_surat_keluar || 0,
            icon: Send,
            bgColor: "bg-green-50",
            textColor: "text-green-600",
        },
        {
            title: "Total Arsip",
            value: data.total_arsip || 0,
            icon: Archive,
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
        },
    ];

    const recent = data.recent_surat_masuk || [];

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
            subtitle={`${greet}, ${data.auth.user.name}. Berikut ringkasan arsip surat hari ini.`}
        >
            <Head title="Dashboard Admin" />

            <section aria-labelledby="ringkasan" className="space-y-6">
                <h3 id="ringkasan" className="sr-only">
                    Ringkasan
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        label="Total Surat Masuk"
                        value={0}
                        hint={`2 surat baru menunggu`}
                        icon={FileInput}
                        tone="primary"
                    />
                    <StatCard
                        label="Total Surat Keluar"
                        value={0}
                        hint="Modul akan segera tersedia"
                        icon={FileOutput}
                        tone="warning"
                    />
                    <StatCard
                        label="Total Arsip Tersimpan"
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
                                5 surat terakhir yang diterima
                            </p>
                        </div>
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="rounded-lg h-10 text-sm"
                        >
                            <Link to="/surat-masuk">
                                Lihat semua{" "}
                                <ArrowRight className="size-4 ml-1" />
                            </Link>
                        </Button>
                    </div>

                    {recent.length === 0 ? (
                        <div className="px-8 py-16 text-center">
                            <div className="mx-auto size-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                                <FileInput className="size-6 text-muted-foreground" />
                            </div>
                            <p className="font-semibold">
                                Belum ada surat masuk
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Tambahkan surat pertama Anda untuk memulai.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-muted/40">
                                        <th className="px-6 md:px-8 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            No. Surat
                                        </th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Pengirim
                                        </th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Perihal
                                        </th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Diterima
                                        </th>
                                        <th className="px-6 md:px-8 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recent.map((s) => (
                                        <tr
                                            key={s.id}
                                            className="hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-6 md:px-8 py-4">
                                                <Link
                                                    to={`/surat-masuk/${s.id}`}
                                                    className="font-mono text-sm font-semibold text-primary hover:underline"
                                                >
                                                    {s.nomorSurat}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground/90">
                                                {s.pengirim}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground/90 max-w-[320px] truncate">
                                                {s.perihal}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground tabular-nums">
                                                {formatDate(s.tanggalDiterima)}
                                            </td>
                                            <td className="px-6 md:px-8 py-4">
                                                <StatusBadge
                                                    status={s.status}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
