import { Button } from "@/components/ui/button";
import {
    AttentionPanel,
    DataTable,
    StatCard,
    StatusGroup,
    TrendChart,
} from "@/features/dashboard/components/widgets";
import AppLayout from "@/layouts/AppLayout";
import { SURAT_MASUK_ALUR_LABELS } from "@/shared/constants/badgeLabels";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Archive,
    BarChart3,
    Clock,
    FileInput,
    Send,
} from "lucide-react";

function mapDisposisiRows(items) {
    return (items ?? []).map((row) => ({
        id: row.id,
        no_surat: row.surat_masuk?.no_surat ?? "—",
        pengirim: row.surat_masuk?.pengirim ?? "—",
        perihal: row.surat_masuk?.perihal ?? "—",
        kepada: row.kepada,
        tanggal: row.tanggal,
        status: row.surat_status ?? row.status,
    }));
}

function mapPendingSuratRows(items) {
    return (items ?? []).map((row) => ({
        id: row.id,
        no_surat: row.no_surat ?? "—",
        perihal: row.perihal ?? "—",
        tanggal: row.tanggal,
        status: row.status,
    }));
}

export default function KadesDashboard({
    summary,
    attention,
    monthly_trend,
    recent_disposisi,
    pending_disposisi,
}) {
    const { auth } = usePage().props;

    const greet = (() => {
        const h = new Date().getHours();
        if (h < 11) return "Selamat pagi";
        if (h < 15) return "Selamat siang";
        if (h < 19) return "Selamat sore";
        return "Selamat malam";
    })();

    const statCards = [
        {
            label: "Disposisi Masuk",
            value: summary?.disposisi ?? 0,
            hint: `${summary?.disposisi_bulan_ini ?? 0} bulan ini`,
            icon: Send,
            tone: "primary",
            href: route("admin.disposisi.index"),
        },
        {
            label: "Menunggu Verifikasi",
            value: summary?.disposisi_menunggu ?? 0,
            hint: "Surat penting perlu diverifikasi",
            icon: Clock,
            tone: "warning",
            href: route("admin.surat-masuk.index", {
                kades_aksi: "menunggu_verifikasi",
            }),
        },
        {
            label: "Siap Disposisi",
            value: summary?.disposisi_diproses ?? 0,
            hint: "Sudah diverifikasi, menunggu disposisi",
            icon: Send,
            tone: "info",
            href: route("admin.surat-masuk.index", {
                kades_aksi: "siap_disposisi",
            }),
        },
        {
            label: "Arsip",
            value: summary?.arsip ?? 0,
            hint: `${summary?.surat_masuk ?? 0} surat masuk aktif`,
            icon: Archive,
            tone: "success",
            href: route("admin.arsip-surat.index"),
        },
    ];

    return (
        <AppLayout
            title="Beranda"
            subtitle={`${greet}, ${auth.user.name}. Tinjau disposisi dan berikan arahan surat.`}
        >
            <Head title="Beranda Kepala Desa" />

            <div className="space-y-8">
                <motion.section
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-wrap gap-3">
                        <Button asChild className="rounded-xl">
                            <Link href={route("admin.disposisi.index")}>
                                <Send className="size-4" />
                                Lihat Disposisi
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-xl">
                            <Link href={route("admin.surat-masuk.index")}>
                                <FileInput className="size-4" />
                                Surat Masuk
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-xl">
                            <Link href={route("admin.arsip-surat.index")}>
                                <Archive className="size-4" />
                                Arsip Surat
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-xl">
                            <Link href={route("admin.laporan.index")}>
                                <BarChart3 className="size-4" />
                                Laporan
                            </Link>
                        </Button>
                    </div>
                </motion.section>

                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {statCards.map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <StatCard {...card} />
                            </motion.div>
                        ))}
                    </div>
                </section>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <AttentionPanel items={attention} />
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                        <TrendChart
                            title="Tren Disposisi (6 Bulan)"
                            subtitle="Disposisi masuk ke Kepala Desa per bulan"
                            data={monthly_trend}
                            bars={[
                                {
                                    key: "total",
                                    name: "Disposisi",
                                    color: "hsl(188, 45%, 38%)",
                                },
                            ]}
                        />
                    </div>
                    <div className="surface-card p-6 md:p-7">
                        <h2 className="text-base font-bold tracking-tight">
                            Status Disposisi
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                            Disposisi yang ditujukan kepada Anda
                        </p>
                        <StatusGroup
                            title="Ringkasan"
                            items={[
                                {
                                    label: "Menunggu",
                                    value: summary?.disposisi_menunggu,
                                },
                                {
                                    label: "Diproses",
                                    value: summary?.disposisi_diproses,
                                },
                                {
                                    label: "Selesai",
                                    value: summary?.disposisi_selesai,
                                },
                            ]}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <DataTable
                        title="Disposisi Terbaru"
                        subtitle="5 disposisi terakhir dari Sekretaris Desa"
                        viewAllRoute="admin.disposisi.index"
                        emptyIcon={Send}
                        emptyTitle="Belum ada disposisi masuk"
                        emptyHint="Disposisi dari Sekretaris Desa akan tampil di sini."
                        columns={[
                            { key: "no_surat", label: "No. Surat" },
                            { key: "pengirim", label: "Pengirim" },
                            { key: "tanggal", label: "Tanggal" },
                            { key: "status", label: "Status" },
                        ]}
                        rows={mapDisposisiRows(recent_disposisi)}
                        detailRoute={(row) =>
                            route("admin.disposisi.show", {
                                disposisi: row.id,
                            })
                        }
                        statusLabels={SURAT_MASUK_ALUR_LABELS}
                        dateKey="tanggal"
                    />
                    <DataTable
                        title="Menunggu Arahan Anda"
                        subtitle="Surat penting yang perlu diverifikasi atau didisposisikan"
                        viewAllRoute="admin.surat-masuk.index"
                        viewAllParams={{
                            tingkat: "penting",
                            status: "terverifikasi",
                        }}
                        emptyIcon={Clock}
                        emptyTitle="Tidak ada surat menunggu"
                        emptyHint="Semua surat penting sudah Anda tangani."
                        columns={[
                            { key: "no_surat", label: "No. Surat" },
                            { key: "perihal", label: "Perihal" },
                            { key: "tanggal", label: "Tanggal" },
                        ]}
                        rows={mapPendingSuratRows(pending_disposisi)}
                        detailRoute={(row) =>
                            route("admin.surat-masuk.show", {
                                surat_masuk: row.id,
                            })
                        }
                        dateKey="tanggal"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
