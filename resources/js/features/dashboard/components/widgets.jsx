import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { badgeLabel } from "@/shared/constants/badgeLabels";
import { formatTanggalKalenderWib } from "@/shared/lib/utils";
import { Link } from "@inertiajs/react";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
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

export const ATTENTION_STYLES = {
    warning: "border-warning/30 bg-warning-soft/50 text-warning",
    danger: "border-destructive/30 bg-destructive/5 text-destructive",
    info: "border-info/30 bg-info-soft/50 text-info",
};

export function StatCard({ label, value, hint, icon: Icon, tone, href }) {
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

export function AttentionPanel({ items }) {
    return (
        <div className="surface-card p-6 md:p-7">
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
                <AlertCircle className="size-5 text-warning" />
                Perlu Perhatian
            </h2>
            {(items ?? []).length === 0 ? (
                <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-5 text-success shrink-0" />
                    Semua berjalan lancar — tidak ada item yang menunggu
                    tindakan.
                </div>
            ) : (
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((item) => (
                        <li key={item.key}>
                            <Link
                                href={route(item.route)}
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
    );
}

export function StatusGroup({ title, items }) {
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

export function TrendChart({
    title,
    subtitle,
    data,
    bars = [
        { key: "masuk", name: "Masuk", color: "hsl(188, 45%, 38%)" },
        { key: "keluar", name: "Keluar", color: "hsl(38, 92%, 50%)" },
    ],
}) {
    return (
        <div className="surface-card p-6 md:p-7 h-full">
            <h2 className="text-base font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                {subtitle}
            </p>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data ?? []}
                        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-border"
                        />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid hsl(var(--border))",
                                background: "hsl(var(--card))",
                            }}
                        />
                        <Legend />
                        {bars.map((bar) => (
                            <Bar
                                key={bar.key}
                                dataKey={bar.key}
                                name={bar.name}
                                fill={bar.color}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function DataTable({
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
                {viewAllRoute && (
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
                )}
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

                                            if (
                                                col.key === "no_surat" ||
                                                col.key === "link_label"
                                            ) {
                                                const label =
                                                    col.key === "link_label"
                                                        ? value
                                                        : value;
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
                                                                {label}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-sm font-semibold">
                                                                {label}
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
