import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/AppLayout";
import {
    badgeLabel,
    SURAT_KELUAR_STATUS_LABELS,
    SURAT_MASUK_ALUR_LABELS,
} from "@/shared/constants/badgeLabels";
import { formatTanggalKalenderWib } from "@/shared/lib/utils";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    AlertCircle,
    Archive,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Clock,
    FileInput,
    FileOutput,
    Plus,
    Send,
    Users,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const CHART_COLORS = {
    masuk: "hsl(188, 45%, 38%)",
    keluar: "hsl(38, 92%, 50%)",
};

const ATTENTION_STYLES = {
    warning: "border-warning/30 bg-warning-soft/50 text-warning",
    danger: "border-destructive/30 bg-destructive/5 text-destructive",
    info: "border-info/30 bg-info-soft/50 text-info",
};

export default function AdminDashboard({
    summary,
    attention,
    monthly_trend,
    recent_surat_masuk,
    recent_surat_keluar,
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
            label: "Menunggu Review",
            value: summary?.surat_masuk_belum_diproses ?? 0,
            hint: `${summary?.surat_masuk_tanpa_disposisi ?? 0} biasa tanpa disposisi`,
            icon: Clock,
            tone: "warning",
            href: route("admin.surat-masuk.index", { status: "draft" }),
        },
        {
            label: "Surat Keluar",
            value: summary?.surat_keluar ?? 0,
            hint: `${summary?.surat_keluar_bulan_ini ?? 0} bulan ini`,
            icon: FileOutput,
            tone: "info",
            href: route("admin.surat-keluar.index"),
        },
        {
            label: "Disposisi",
            value: summary?.disposisi ?? 0,
            hint: `${summary?.disposisi_menunggu ?? 0} penting menunggu Kades`,
            icon: Send,
            tone: "disposisi",
            href: route("admin.surat-masuk.index", {
                kades_aksi: "menunggu_verifikasi",
            }),
        },
        {
            label: "Arsip",
            value: summary?.arsip ?? 0,
            hint: `${summary?.siap_arsip ?? 0} siap diarsipkan`,
            icon: Archive,
            tone: "success",
            href: route("admin.arsip-surat.index"),
        },
    ];

    return (
        <AppLayout
            title="Beranda"
            subtitle={`${greet}, ${auth.user.name}. Ringkasan seluruh modul e-arsip desa.`}
        >
            <Head title="Dashboard Admin" />

            <div className="space-y-8">
                <motion.section
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    aria-labelledby="akses-cepat"
                >
                    <h2 id="akses-cepat" className="sr-only">
                        Akses cepat
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild className="rounded-xl">
                            <Link href={route("admin.surat-masuk.create")}>
                                <Plus className="size-4" />
                                Tambah Surat Masuk
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-xl"
                        >
                            <Link href={route("admin.surat-keluar.create")}>
                                <FileOutput className="size-4" />
                                Tambah Surat Keluar
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-xl"
                        >
                            <Link href={route("admin.arsip-surat.index")}>
                                <Archive className="size-4" />
                                Arsip Surat
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-xl"
                        >
                            <Link href={route("admin.laporan.index")}>
                                <BarChart3 className="size-4" />
                                Laporan
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-xl"
                        >
                            <Link href={route("admin.users.index")}>
                                <Users className="size-4" />
                                Manajemen User
                            </Link>
                        </Button>
                    </div>
                </motion.section>

                <section aria-labelledby="ringkasan">
                    <h2 id="ringkasan" className="sr-only">
                        Ringkasan modul
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5">
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

                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    aria-labelledby="perhatian"
                >
                    <div className="surface-card p-6 md:p-7">
                        <h2
                            id="perhatian"
                            className="text-base font-bold tracking-tight flex items-center gap-2"
                        >
                            <AlertCircle className="size-5 text-warning" />
                            Perlu Perhatian
                        </h2>
                        {(attention ?? []).length === 0 ? (
                            <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
                                <CheckCircle2 className="size-5 text-success shrink-0" />
                                Semua modul berjalan lancar — tidak ada item
                                yang menunggu tindakan.
                            </div>
                        ) : (
                            <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(attention ?? []).map((item) => (
                                    <li key={item.key}>
                                        <Link
                                            href={route(item.route, item.params ?? {})}
                                            className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 transition-colors hover:opacity-90 ${ATTENTION_STYLES[item.severity] ?? ATTENTION_STYLES.info}`}
                                        >
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm text-foreground">
                                                    {item.label}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <span className="text-2xl font-extrabold tabular-nums shrink-0">
                                                {item.count}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <motion.section
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="surface-card p-6 md:p-7 xl:col-span-2"
                        aria-labelledby="tren-surat"
                    >
                        <h2
                            id="tren-surat"
                            className="text-base font-bold tracking-tight"
                        >
                            Tren Surat (6 Bulan)
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                            Volume surat masuk dan keluar per bulan
                        </p>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={monthly_trend ?? []}
                                    margin={{
                                        top: 4,
                                        right: 4,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-border"
                                    />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fontSize: 11 }}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fontSize: 11 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "1px solid hsl(var(--border))",
                                            background: "hsl(var(--card))",
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="masuk"
                                        name="Masuk"
                                        fill={CHART_COLORS.masuk}
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="keluar"
                                        name="Keluar"
                                        fill={CHART_COLORS.keluar}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                        className="surface-card p-6 md:p-7"
                        aria-labelledby="status-ringkas"
                    >
                        <h2
                            id="status-ringkas"
                            className="text-base font-bold tracking-tight"
                        >
                            Status Ringkas
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                            Breakdown surat &amp; disposisi aktif
                        </p>
                        <dl className="space-y-4">
                            <StatusGroup
                                title="Surat Masuk"
                                items={[
                                    {
                                        label: "Belum diproses",
                                        value: summary?.surat_masuk_belum_diproses,
                                    },
                                    {
                                        label: "Sedang diproses",
                                        value: summary?.surat_masuk_sedang_diproses,
                                    },
                                    {
                                        label: "Selesai",
                                        value: summary?.surat_masuk_selesai,
                                    },
                                ]}
                            />
                            <StatusGroup
                                title="Surat Keluar"
                                items={[
                                    {
                                        label: "Draft",
                                        value: summary?.surat_keluar_draft,
                                    },
                                    {
                                        label: "Terkirim",
                                        value: summary?.surat_keluar_terkirim,
                                    },
                                ]}
                            />
                            <StatusGroup
                                title="Disposisi"
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
                        </dl>
                    </motion.section>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <RecentTable
                        title="Surat Masuk Terbaru"
                        subtitle="5 surat terakhir yang diterima"
                        viewAllRoute="admin.surat-masuk.index"
                        emptyIcon={FileInput}
                        emptyTitle="Belum ada surat masuk"
                        emptyHint="Tambahkan surat pertama untuk memulai."
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
                        statusLabels={SURAT_MASUK_ALUR_LABELS}
                        dateKey="tanggal_terima"
                    />
                    <RecentTable
                        title="Surat Keluar Terbaru"
                        subtitle="5 surat terakhir yang dibuat"
                        viewAllRoute="admin.surat-keluar.index"
                        emptyIcon={FileOutput}
                        emptyTitle="Belum ada surat keluar"
                        emptyHint="Buat surat keluar pertama dari modul terkait."
                        columns={[
                            { key: "no_surat", label: "No. Surat" },
                            { key: "tujuan", label: "Tujuan" },
                            { key: "tanggal_kirim", label: "Tanggal" },
                            { key: "status", label: "Status" },
                        ]}
                        rows={recent_surat_keluar ?? []}
                        detailRoute={(row) =>
                            route("admin.surat-keluar.show", {
                                surat_keluar: row.id,
                            })
                        }
                        statusLabels={SURAT_KELUAR_STATUS_LABELS}
                        dateKey="tanggal_kirim"
                    />
                </div>

                <RecentTable
                    title="Disposisi Menunggu Kepala Desa"
                    subtitle="Instruksi yang belum ditindaklanjuti Kepala Desa"
                    viewAllRoute="admin.laporan.index"
                    viewAllLabel="Lihat laporan"
                    emptyIcon={Send}
                    emptyTitle="Tidak ada disposisi menunggu"
                    emptyHint="Semua disposisi ke Kepala Desa sudah ditangani."
                    columns={[
                        { key: "no_surat", label: "No. Surat" },
                        { key: "pengirim", label: "Pengirim" },
                        { key: "kepada", label: "Kepada" },
                        { key: "tanggal", label: "Tanggal" },
                    ]}
                    rows={(pending_disposisi ?? []).map((row) => ({
                        id: row.id,
                        no_surat: row.surat_masuk?.no_surat ?? "—",
                        pengirim: row.surat_masuk?.pengirim ?? "—",
                        kepada: row.kepada,
                        tanggal: row.tanggal,
                        detail_id: row.surat_masuk?.id,
                    }))}
                    detailRoute={(row) =>
                        row.detail_id
                            ? route("admin.surat-masuk.show", {
                                  surat_masuk: row.detail_id,
                              })
                            : null
                    }
                    dateKey="tanggal"
                />
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, hint, icon: Icon, tone, href }) {
    const toneClasses = {
        primary: "bg-primary-soft text-primary",
        warning: "bg-warning-soft text-warning",
        info: "bg-info-soft text-info",
        success: "bg-success-soft text-success",
        disposisi:
            "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
        muted: "bg-muted text-muted-foreground",
    }[tone];

    const content = (
        <div className="surface-card surface-card-hover p-6 h-full">
            <div
                className={`size-11 rounded-xl ${toneClasses} flex items-center justify-center`}
            >
                <Icon className="size-5" strokeWidth={2.2} />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                {label}
            </p>
            <p className="text-3xl font-extrabold tracking-tight tabular-nums mt-1">
                {value}
            </p>
            {hint && (
                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                    {hint}
                </p>
            )}
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block h-full">
                {content}
            </Link>
        );
    }

    return content;
}

function StatusGroup({ title, items }) {
    const total = items.reduce((sum, item) => sum + (item.value ?? 0), 0);

    return (
        <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {title}
            </dt>
            <dd className="space-y-2">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center justify-between text-sm"
                    >
                        <span>{item.label}</span>
                        <span className="font-semibold tabular-nums">
                            {item.value ?? 0}
                        </span>
                    </div>
                ))}
                <div className="flex h-1.5 rounded-full bg-muted overflow-hidden mt-1">
                    {items.map((item, index) => {
                        if (!total || !item.value) return null;
                        const colors = [
                            "bg-primary",
                            "bg-warning",
                            "bg-success",
                        ];
                        return (
                            <div
                                key={item.label}
                                className={colors[index % colors.length]}
                                style={{
                                    width: `${(item.value / total) * 100}%`,
                                }}
                            />
                        );
                    })}
                </div>
            </dd>
        </div>
    );
}

function RecentTable({
    title,
    subtitle,
    viewAllRoute,
    viewAllLabel = "Lihat semua",
    emptyIcon: EmptyIcon,
    emptyTitle,
    emptyHint,
    columns,
    rows,
    detailRoute,
    statusLabels,
    dateKey,
}) {
    return (
        <section className="surface-card overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-6 md:px-8 py-5 border-b border-border">
                <div>
                    <h3 className="text-base font-bold tracking-tight">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {subtitle}
                    </p>
                </div>
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="rounded-lg h-10 text-sm shrink-0"
                >
                    <Link href={route(viewAllRoute)}>
                        {viewAllLabel}
                        <ArrowRight className="size-4 ml-1" />
                    </Link>
                </Button>
            </div>

            {rows.length === 0 ? (
                <div className="px-8 py-14 text-center">
                    <div className="mx-auto size-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <EmptyIcon className="size-6 text-muted-foreground" />
                    </div>
                    <p className="font-semibold">{emptyTitle}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {emptyHint}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/40">
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-6 md:px-8 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {rows.map((row) => {
                                const href = detailRoute?.(row);
                                return (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        {columns.map((col, index) => {
                                            const value = row[col.key];

                                            if (col.key === "no_surat") {
                                                return (
                                                    <td
                                                        key={col.key}
                                                        className="px-6 md:px-8 py-4"
                                                    >
                                                        {href ? (
                                                            <Link
                                                                href={href}
                                                                className="font-mono text-sm font-semibold text-primary hover:underline"
                                                            >
                                                                {value}
                                                            </Link>
                                                        ) : (
                                                            <span className="font-mono text-sm font-semibold">
                                                                {value}
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            }

                                            if (
                                                col.key === "status" &&
                                                statusLabels
                                            ) {
                                                return (
                                                    <td
                                                        key={col.key}
                                                        className="px-6 md:px-8 py-4"
                                                    >
                                                        <StatusBadge
                                                            value={value}
                                                            label={badgeLabel(
                                                                statusLabels,
                                                                value,
                                                            )}
                                                        />
                                                    </td>
                                                );
                                            }

                                            if (col.key === dateKey) {
                                                return (
                                                    <td
                                                        key={col.key}
                                                        className="px-6 py-4 text-sm text-muted-foreground tabular-nums"
                                                    >
                                                        {formatTanggalKalenderWib(
                                                            value,
                                                        )}
                                                    </td>
                                                );
                                            }

                                            return (
                                                <td
                                                    key={col.key}
                                                    className={`px-6 py-4 text-sm text-foreground/90 ${index === 1 ? "max-w-[200px] truncate" : ""}`}
                                                >
                                                    {value}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
