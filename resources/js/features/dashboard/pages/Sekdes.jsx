import { Button } from "@/components/ui/button";
import {
    AttentionPanel,
    DataTable,
    StatCard,
    StatusGroup,
    TrendChart,
} from "@/features/dashboard/components/widgets";
import AppLayout from "@/layouts/AppLayout";
import { SURAT_MASUK_STATUS_LABELS } from "@/shared/constants/badgeLabels";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Archive,
    BarChart3,
    Clock,
    FileInput,
    Plus,
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

export default function SekdesDashboard({
    summary,
    attention,
    monthly_trend,
    recent_surat_masuk,
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
            label: "Surat Masuk",
            value: summary?.surat_masuk ?? 0,
            hint: `${summary?.surat_masuk_bulan_ini ?? 0} bulan ini`,
            icon: FileInput,
            tone: "primary",
            href: route("admin.surat-masuk.index"),
        },
        {
            label: "Tanpa Disposisi",
            value: summary?.surat_masuk_tanpa_disposisi ?? 0,
            hint: "Perlu instruksi disposisi",
            icon: Clock,
            tone: "warning",
            href: route("admin.surat-masuk.index"),
        },
        {
            label: "Disposisi",
            value: summary?.disposisi ?? 0,
            hint: `${summary?.disposisi_ke_kades ?? 0} ke Kepala Desa`,
            icon: Send,
            tone: "disposisi",
            href: route("admin.disposisi.index"),
        },
        {
            label: "Menunggu Kades",
            value: summary?.disposisi_ke_kades_menunggu ?? 0,
            hint: "Belum ditindaklanjuti",
            icon: Send,
            tone: "info",
            href: route("admin.disposisi.index"),
        },
        {
            label: "Arsip",
            value: summary?.arsip ?? 0,
            hint: `${summary?.surat_keluar ?? 0} surat keluar aktif`,
            icon: Archive,
            tone: "success",
            href: route("admin.arsip-surat.index"),
        },
    ];

    return (
        <AppLayout
            title="Beranda"
            subtitle={`${greet}, ${auth.user.name}. Kelola surat masuk dan disposisi desa.`}
        >
            <Head title="Beranda Sekretaris Desa" />

            <div className="space-y-8">
                <motion.section
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-wrap gap-3">
                        <Button asChild className="rounded-xl">
                            <Link href={route("admin.disposisi.create")}>
                                <Plus className="size-4" />
                                Buat Disposisi
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
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
                            title="Tren Surat (6 Bulan)"
                            subtitle="Volume surat masuk dan keluar per bulan"
                            data={monthly_trend}
                        />
                    </div>
                    <div className="surface-card p-6 md:p-7">
                        <h2 className="text-base font-bold tracking-tight">
                            Status Ringkas
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                            Surat masuk &amp; disposisi aktif
                        </p>
                        <dl className="space-y-4">
                            <StatusGroup
                                title="Surat Masuk"
                                items={[
                                    {
                                        label: "Draft",
                                        value: summary?.surat_masuk_draft ?? summary?.surat_masuk_belum_diproses,
                                    },
                                    {
                                        label: "Terverifikasi",
                                        value: summary?.surat_masuk_terverifikasi,
                                    },
                                    {
                                        label: "Didisposisikan",
                                        value: summary?.surat_masuk_didisposisikan,
                                    },
                                ]}
                            />
                            <StatusGroup
                                title="Surat Penting"
                                items={[
                                    {
                                        label: "Menunggu Kades",
                                        value: summary?.disposisi_ke_kades_menunggu,
                                    },
                                    {
                                        label: "Tanpa disposisi (biasa)",
                                        value: summary?.surat_masuk_tanpa_disposisi,
                                    },
                                    {
                                        label: "Total disposisi",
                                        value: summary?.disposisi,
                                    },
                                ]}
                            />
                        </dl>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <DataTable
                        title="Surat Masuk Terbaru"
                        subtitle="5 surat terakhir yang diterima"
                        viewAllRoute="admin.surat-masuk.index"
                        emptyIcon={FileInput}
                        emptyTitle="Belum ada surat masuk"
                        emptyHint="Surat masuk baru akan tampil di sini."
                        columns={[
                            { key: "no_surat", label: "No. Surat" },
                            { key: "pengirim", label: "Pengirim" },
                            { key: "tanggal_terima", label: "Diterima" },
                            { key: "status", label: "Status" },
                        ]}
                        rows={recent_surat_masuk ?? []}
                        detailRoute={(row) =>
                            route("admin.surat-masuk.show", {
                                surat_masuk: row.id,
                            })
                        }
                        statusLabels={SURAT_MASUK_STATUS_LABELS}
                        dateKey="tanggal_terima"
                    />
                    <DataTable
                        title="Disposisi Terbaru"
                        subtitle="5 disposisi terakhir yang dibuat"
                        viewAllRoute="admin.disposisi.index"
                        emptyIcon={Send}
                        emptyTitle="Belum ada disposisi"
                        emptyHint="Buat disposisi dari surat masuk."
                        columns={[
                            { key: "no_surat", label: "No. Surat" },
                            { key: "kepada", label: "Kepada" },
                            { key: "tanggal", label: "Tanggal" },
                            { key: "status", label: "Status" },
                        ]}
                        rows={mapDisposisiRows(recent_disposisi)}
                        detailRoute={(row) =>
                            route("admin.disposisi.show", {
                                disposisi: row.id,
                            })
                        }
                        statusLabels={SURAT_MASUK_STATUS_LABELS}
                        dateKey="tanggal"
                    />
                </div>

                <DataTable
                    title="Disposisi Menunggu Kepala Desa"
                    subtitle="Instruksi yang belum ditindaklanjuti Kepala Desa"
                    viewAllRoute="admin.disposisi.index"
                    emptyIcon={Send}
                    emptyTitle="Tidak ada disposisi menunggu"
                    emptyHint="Semua disposisi ke Kepala Desa sudah ditangani."
                    columns={[
                        { key: "no_surat", label: "No. Surat" },
                        { key: "pengirim", label: "Pengirim" },
                        { key: "kepada", label: "Kepada" },
                        { key: "tanggal", label: "Tanggal" },
                    ]}
                    rows={mapDisposisiRows(pending_disposisi)}
                    detailRoute={(row) =>
                        route("admin.disposisi.show", { disposisi: row.id })
                    }
                    dateKey="tanggal"
                />
            </div>
        </AppLayout>
    );
}
