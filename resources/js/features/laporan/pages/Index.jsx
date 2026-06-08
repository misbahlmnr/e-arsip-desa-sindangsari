import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    badgeLabel,
    SURAT_KELUAR_STATUS_LABELS,
    SURAT_MASUK_STATUS_LABELS,
    TINGKAT_SURAT_LABELS,
} from "@/shared/constants/badgeLabels";
import { Head, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Archive,
    BarChart3,
    Clock,
    Download,
    FileInput,
    FileOutput,
    Inbox,
    Send,
    Users,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const RANGE_OPTIONS = [
    { value: "all", label: "Semua waktu" },
    { value: "7d", label: "7 hari terakhir" },
    { value: "30d", label: "30 hari terakhir" },
    { value: "90d", label: "90 hari terakhir" },
    { value: "1y", label: "1 tahun terakhir" },
];

const CHART_COLORS = {
    masuk: "hsl(188, 45%, 38%)",
    keluar: "hsl(38, 92%, 50%)",
    arsip: "hsl(24, 95%, 53%)",
    disposisi: "hsl(262, 52%, 47%)",
    status: [
        "hsl(188, 45%, 38%)",
        "hsl(38, 92%, 50%)",
        "hsl(142, 71%, 45%)",
        "hsl(262, 52%, 47%)",
        "hsl(0, 84%, 60%)",
    ],
};

export default function LaporanIndex({
    summary,
    surat_masuk_status,
    surat_keluar_status,
    tingkat_surat,
    monthly_trend,
    top_pengirim,
    disposisi_by_kepada,
    filters,
}) {
    const {
        props: { auth },
    } = usePage();
    const canExportLaporan = auth?.canExportLaporan;
    const rangeValue = filters?.range ?? "all";

    const handleRangeChange = (value) => {
        router.get(
            route("admin.laporan.index"),
            { range: value },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const summaryCards = [
        {
            label: "Surat Masuk",
            value: summary?.surat_masuk ?? 0,
            hint: `${summary?.surat_masuk_aktif ?? 0} aktif`,
            icon: FileInput,
            tone: "primary",
        },
        {
            label: "Menunggu Review",
            value: summary?.surat_masuk_belum_diproses ?? 0,
            hint: `${summary?.surat_masuk_tanpa_disposisi ?? 0} tanpa disposisi`,
            icon: Clock,
            tone: "warning",
        },
        {
            label: "Surat Keluar",
            value: summary?.surat_keluar ?? 0,
            hint: `${summary?.surat_keluar_draft ?? 0} masih draft`,
            icon: FileOutput,
            tone: "info",
        },
        {
            label: "Arsip",
            value: summary?.arsip ?? 0,
            hint: "Surat masuk & keluar",
            icon: Archive,
            tone: "success",
        },
        {
            label: "Disposisi",
            value: summary?.disposisi ?? 0,
            hint: `${summary?.surat_penting_menunggu_kades ?? 0} penting menunggu Kades`,
            icon: Send,
            tone: "disposisi",
        },
    ];

    const masukChartData = (surat_masuk_status ?? []).map((row) => ({
        name: badgeLabel(SURAT_MASUK_STATUS_LABELS, row.status),
        value: row.total,
        key: row.status,
    }));

    const keluarChartData = (surat_keluar_status ?? []).map((row) => ({
        name: badgeLabel(SURAT_KELUAR_STATUS_LABELS, row.status),
        value: row.total,
        key: row.status,
    }));

    const tingkatChartData = (tingkat_surat ?? []).map((row) => ({
        name: badgeLabel(TINGKAT_SURAT_LABELS, row.status),
        value: row.total,
        key: row.status,
    }));

    return (
        <AppLayout
            title="Laporan"
            subtitle="Statistik dan ringkasan surat masuk, keluar, disposisi, serta arsip."
        >
            <Head title="Laporan" />

            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="size-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                            <BarChart3 className="size-5" />
                        </div>
                        <p className="text-sm">
                            Data disesuaikan dengan periode yang dipilih.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Select
                            value={rangeValue}
                            onValueChange={handleRangeChange}
                        >
                            <SelectTrigger className="w-full sm:w-52 h-11 rounded-xl">
                                <SelectValue placeholder="Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                {RANGE_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {canExportLaporan && (
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="rounded-xl"
                            >
                                <a
                                    href={route("admin.laporan.export", {
                                        range: rangeValue,
                                    })}
                                >
                                    <Download className="size-4" />
                                    Unduh PDF
                                </a>
                            </Button>
                        )}
                    </div>
                </motion.div>

                <section aria-labelledby="ringkasan-laporan">
                    <h2 id="ringkasan-laporan" className="sr-only">
                        Ringkasan
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
                        {summaryCards.map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
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
                    className="surface-card p-6 md:p-8"
                    aria-labelledby="tren-bulanan"
                >
                    <div className="mb-6">
                        <h3
                            id="tren-bulanan"
                            className="text-base font-bold tracking-tight"
                        >
                            Tren Surat (6 Bulan Terakhir)
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Perbandingan surat masuk dan keluar per bulan
                        </p>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={monthly_trend ?? []}
                                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-border"
                                />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 12 }}
                                    className="text-muted-foreground"
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 12 }}
                                    className="text-muted-foreground"
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
                                    name="Surat Masuk"
                                    fill={CHART_COLORS.masuk}
                                    radius={[6, 6, 0, 0]}
                                />
                                <Bar
                                    dataKey="keluar"
                                    name="Surat Keluar"
                                    fill={CHART_COLORS.keluar}
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <StatusPieCard
                        title="Status Surat Masuk"
                        subtitle="Surat aktif (belum diarsipkan)"
                        data={masukChartData}
                        icon={Inbox}
                    />
                    <StatusPieCard
                        title="Status Surat Keluar"
                        subtitle="Surat aktif (belum diarsipkan)"
                        data={keluarChartData}
                        icon={FileOutput}
                    />
                    <StatusPieCard
                        title="Tingkat Surat"
                        subtitle="Surat yang sudah direview Sekdes"
                        data={tingkatChartData}
                        icon={Send}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RankListCard
                        title="Pengirim Terbanyak"
                        subtitle="Surat masuk berdasarkan pengirim"
                        icon={Users}
                        emptyMessage="Belum ada data pengirim."
                        rows={(top_pengirim ?? []).map((row) => ({
                            label: row.pengirim,
                            value: row.total,
                        }))}
                    />
                    <RankListCard
                        title="Disposisi per Tujuan"
                        subtitle="Distribusi disposisi berdasarkan penerima"
                        icon={Send}
                        emptyMessage="Belum ada data disposisi."
                        rows={(disposisi_by_kepada ?? []).map((row) => ({
                            label: row.kepada,
                            value: row.total,
                        }))}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, hint, icon: Icon, tone }) {
    const toneClasses = {
        primary: "bg-primary-soft text-primary",
        warning: "bg-warning-soft text-warning",
        info: "bg-info-soft text-info",
        success: "bg-success-soft text-success",
        disposisi: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    }[tone];

    return (
        <div className="surface-card surface-card-hover p-6">
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
                <p className="text-sm text-muted-foreground mt-1.5">{hint}</p>
            )}
        </div>
    );
}

function StatusPieCard({ title, subtitle, data, icon: Icon }) {
    const total = data.reduce((sum, row) => sum + row.value, 0);
    const hasData = total > 0;

    return (
        <div className="surface-card p-6 md:p-7">
            <div className="flex items-start gap-3 mb-4">
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-base font-bold tracking-tight">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {subtitle}
                    </p>
                </div>
            </div>

            {hasData ? (
                <>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={48}
                                    outerRadius={72}
                                    paddingAngle={3}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={entry.key}
                                            fill={
                                                CHART_COLORS.status[
                                                    index %
                                                        CHART_COLORS.status
                                                            .length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid hsl(var(--border))",
                                        background: "hsl(var(--card))",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <ul className="mt-2 space-y-2">
                        {data.map((row, index) => (
                            <li
                                key={row.key}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className="size-2.5 rounded-full shrink-0"
                                        style={{
                                            background:
                                                CHART_COLORS.status[
                                                    index %
                                                        CHART_COLORS.status
                                                            .length
                                                ],
                                        }}
                                    />
                                    {row.name}
                                </span>
                                <span className="font-semibold tabular-nums">
                                    {row.value}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">
                    Tidak ada data pada periode ini.
                </div>
            )}
        </div>
    );
}

function RankListCard({ title, subtitle, icon: Icon, rows, emptyMessage }) {
    const max = rows.length ? Math.max(...rows.map((r) => r.value)) : 0;

    return (
        <div className="surface-card overflow-hidden">
            <div className="flex items-start gap-3 px-6 md:px-8 py-5 border-b border-border">
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-base font-bold tracking-tight">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {subtitle}
                    </p>
                </div>
            </div>

            {rows.length === 0 ? (
                <div className="px-8 py-14 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                </div>
            ) : (
                <ul className="divide-y divide-border">
                    {rows.map((row, index) => (
                        <li
                            key={`${row.label}-${index}`}
                            className="px-6 md:px-8 py-4"
                        >
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <span className="text-sm font-medium truncate">
                                    {row.label}
                                </span>
                                <span className="text-sm font-bold tabular-nums shrink-0">
                                    {row.value}
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{
                                        width: `${max ? (row.value / max) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
