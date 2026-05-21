import AppLayout from "@/layouts/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Head, Link, router } from "@inertiajs/react";
import { Archive, ChevronDown, ChevronUp, Eye, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn, formatTanggalKalenderWib } from "@/shared/lib/utils";

function formatTanggalArsip(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function JenisBadge({ jenis }) {
    const cls =
        jenis === "masuk"
            ? "bg-info-soft text-info border-info/20"
            : "bg-warning-soft text-warning border-warning/20";
    const label = jenis === "masuk" ? "Surat Masuk" : "Surat Keluar";
    return (
        <Badge
            variant="outline"
            className={cn(
                "font-semibold rounded-full px-2.5 py-0.5 border",
                cls,
            )}
        >
            {label}
        </Badge>
    );
}

/** @typedef {'no_surat' | 'tanggal_surat' | 'diarsipkan_at'} SortKey */

export default function ArsipSuratIndex({ letters, filters }) {
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState(filters?.search ?? "");
    const filtersRef = useRef(filters);

    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    useEffect(() => {
        setSearchInput(filters?.search ?? "");
    }, [filters?.search]);

    const visit = useCallback((params = {}) => {
        setLoading(true);
        const f = filtersRef.current ?? {};
        router.get(
            route("admin.arsip-surat.index"),
            {
                page: params.page ?? 1,
                search:
                    params.search !== undefined
                        ? params.search || undefined
                        : f.search || undefined,
                sort_by: params.sort_by ?? f.sort_by,
                sort_dir: params.sort_dir ?? f.sort_dir,
                per_page: params.per_page ?? f.per_page,
                jenis: params.jenis ?? f.jenis ?? "all",
                range: params.range ?? f.range ?? "all",
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => setLoading(false),
            },
        );
    }, []);

    useEffect(() => {
        const handle = setTimeout(() => {
            const q = String(searchInput ?? "").trim();
            const current = String(filtersRef.current?.search ?? "").trim();
            if (q === current) {
                return;
            }
            visit({
                page: 1,
                search: q || undefined,
                sort_by: filtersRef.current?.sort_by,
                sort_dir: filtersRef.current?.sort_dir,
                per_page: filtersRef.current?.per_page,
                jenis: filtersRef.current?.jenis ?? "all",
                range: filtersRef.current?.range ?? "all",
            });
        }, 400);
        return () => clearTimeout(handle);
    }, [searchInput, visit]);

    const sortBy = filters?.sort_by ?? "diarsipkan_at";
    const sortDir = filters?.sort_dir ?? "desc";
    const jenis = filters?.jenis ?? "all";
    const range = filters?.range ?? "all";
    const perPage = filters?.per_page ?? 10;
    const currentPage = letters?.current_page ?? 1;
    const totalPages = letters?.last_page ?? 1;
    const from = letters?.from ?? 0;
    const to = letters?.to ?? 0;
    const total = letters?.total ?? 0;
    const rows = letters?.data ?? [];

    /** @param {SortKey} key */
    const toggleSort = (key) => {
        if (sortBy === key) {
            visit({
                page: 1,
                sort_by: key,
                sort_dir: sortDir === "asc" ? "desc" : "asc",
                search: filters?.search,
                per_page: perPage,
                jenis,
                range,
            });
        } else {
            visit({
                page: 1,
                sort_by: key,
                sort_dir: "desc",
                search: filters?.search,
                per_page: perPage,
                jenis,
                range,
            });
        }
    };

    /** @param {SortKey} k */
    const SortIcon = ({ k }) =>
        sortBy === k ? (
            sortDir === "asc" ? (
                <ChevronUp className="size-3.5 inline-block ml-1" />
            ) : (
                <ChevronDown className="size-3.5 inline-block ml-1" />
            )
        ) : null;

    const hasFilters =
        (filters?.search && String(filters.search).trim() !== "") ||
        jenis !== "all" ||
        range !== "all";

    return (
        <AppLayout
            title="Arsip Surat"
            subtitle="Kumpulan surat masuk dan keluar yang telah diarsipkan."
        >
            <Head title="Arsip Surat" />

            <div className="surface-card overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center gap-3 px-6 md:px-8 py-5 border-b border-border">
                    <div className="relative flex-1 max-w-md">
                        <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Cari nomor, pihak, atau perihal…"
                            className="pl-10 h-11 rounded-xl"
                        />
                    </div>
                    <Select
                        value={jenis}
                        onValueChange={(v) =>
                            visit({
                                page: 1,
                                jenis: v,
                                search: filters?.search,
                                sort_by: sortBy,
                                sort_dir: sortDir,
                                per_page: perPage,
                                range,
                            })
                        }
                    >
                        <SelectTrigger className="w-full md:w-44 h-11 rounded-xl">
                            <SelectValue placeholder="Jenis surat" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua jenis</SelectItem>
                            <SelectItem value="masuk">Surat Masuk</SelectItem>
                            <SelectItem value="keluar">Surat Keluar</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={range}
                        onValueChange={(v) =>
                            visit({
                                page: 1,
                                range: v,
                                search: filters?.search,
                                sort_by: sortBy,
                                sort_dir: sortDir,
                                per_page: perPage,
                                jenis,
                            })
                        }
                    >
                        <SelectTrigger className="w-full md:w-44 h-11 rounded-xl">
                            <SelectValue placeholder="Tanggal arsip" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua waktu</SelectItem>
                            <SelectItem value="7d">7 hari terakhir</SelectItem>
                            <SelectItem value="30d">30 hari terakhir</SelectItem>
                            <SelectItem value="90d">90 hari terakhir</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={String(perPage)}
                        onValueChange={(value) =>
                            visit({
                                page: 1,
                                per_page: Number(value),
                                search: filters?.search,
                                sort_by: sortBy,
                                sort_dir: sortDir,
                                jenis,
                                range,
                            })
                        }
                    >
                        <SelectTrigger className="w-full md:w-44 h-11 rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="8">8 / halaman</SelectItem>
                            <SelectItem value="10">10 / halaman</SelectItem>
                            <SelectItem value="20">20 / halaman</SelectItem>
                            <SelectItem value="50">50 / halaman</SelectItem>
                            <SelectItem value="100">100 / halaman</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {loading ? (
                    <div className="px-8 py-10 text-sm text-muted-foreground">
                        Memuat data…
                    </div>
                ) : rows.length === 0 ? (
                    <div className="px-8 py-20 text-center">
                        <div className="mx-auto size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                            <Archive className="size-7 text-muted-foreground" />
                        </div>
                        <p className="font-semibold text-lg">Belum ada surat di arsip</p>
                        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
                            {hasFilters
                                ? "Coba ubah kata kunci pencarian atau filter."
                                : "Surat akan tampil di sini setelah diarsipkan dari modul Surat Masuk atau Surat Keluar."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-muted/40 border-b border-border">
                                        <th className="px-6 md:px-8 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider w-12">
                                            No
                                        </th>
                                        <th
                                            className="px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                                            onClick={() => toggleSort("no_surat")}
                                        >
                                            Nomor Surat{" "}
                                            <SortIcon k="no_surat" />
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Jenis
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Perihal
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Pengirim / Tujuan
                                        </th>
                                        <th
                                            className="px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground whitespace-nowrap"
                                            onClick={() =>
                                                toggleSort("tanggal_surat")
                                            }
                                        >
                                            Tgl Surat{" "}
                                            <SortIcon k="tanggal_surat" />
                                        </th>
                                        <th
                                            className="px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground whitespace-nowrap"
                                            onClick={() =>
                                                toggleSort("diarsipkan_at")
                                            }
                                        >
                                            Tgl Arsip{" "}
                                            <SortIcon k="diarsipkan_at" />
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Pengarsip
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 md:px-8 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {rows.map((a, idx) => (
                                        <tr
                                            key={`${a.jenis}-${a.id}`}
                                            className="hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-6 md:px-8 py-4 text-sm text-muted-foreground tabular-nums">
                                                {from + idx}
                                            </td>
                                            <td className="px-4 py-4">
                                                <Link
                                                    href={route(
                                                        "admin.arsip-surat.show",
                                                        {
                                                            jenis: a.jenis,
                                                            id: a.id,
                                                        },
                                                    )}
                                                    className="font-mono text-sm font-semibold text-primary hover:underline"
                                                >
                                                    {a.no_surat}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4">
                                                <JenisBadge jenis={a.jenis} />
                                            </td>
                                            <td className="px-4 py-4 text-sm max-w-[260px] truncate">
                                                {a.perihal}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium">
                                                {a.pihak}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                                                {a.tanggal_surat
                                                    ? formatTanggalKalenderWib(
                                                          a.tanggal_surat,
                                                      )
                                                    : "—"}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                                                {formatTanggalArsip(
                                                    a.diarsipkan_at,
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                —
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge
                                                    variant="outline"
                                                    className="font-semibold rounded-full px-2.5 py-0.5 border bg-success-soft text-success border-success/20"
                                                >
                                                    Diarsipkan
                                                </Badge>
                                            </td>
                                            <td className="px-6 md:px-8 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-9 rounded-lg"
                                                        aria-label="Lihat detail arsip"
                                                    >
                                                        <Link
                                                            href={route(
                                                                "admin.arsip-surat.show",
                                                                {
                                                                    jenis: a.jenis,
                                                                    id: a.id,
                                                                },
                                                            )}
                                                        >
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 md:px-8 py-4 border-t border-border bg-muted/20">
                            <p className="text-xs text-muted-foreground">
                                Menampilkan{" "}
                                <span className="font-semibold text-foreground">
                                    {from}
                                </span>
                                –
                                <span className="font-semibold text-foreground">
                                    {to}
                                </span>{" "}
                                dari{" "}
                                <span className="font-semibold text-foreground">
                                    {total}
                                </span>{" "}
                                arsip
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg"
                                    disabled={currentPage <= 1}
                                    onClick={() =>
                                        visit({
                                            page: currentPage - 1,
                                            search: filters?.search,
                                            sort_by: sortBy,
                                            sort_dir: sortDir,
                                            per_page: perPage,
                                            jenis,
                                            range,
                                        })
                                    }
                                >
                                    Sebelumnya
                                </Button>
                                <span className="text-sm font-semibold tabular-nums px-2">
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg"
                                    disabled={currentPage >= totalPages}
                                    onClick={() =>
                                        visit({
                                            page: currentPage + 1,
                                            search: filters?.search,
                                            sort_by: sortBy,
                                            sort_dir: sortDir,
                                            per_page: perPage,
                                            jenis,
                                            range,
                                        })
                                    }
                                >
                                    Berikutnya
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
