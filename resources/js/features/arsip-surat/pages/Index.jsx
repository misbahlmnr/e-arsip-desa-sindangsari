import AppLayout from "@/layouts/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Head, Link, router } from "@inertiajs/react";
import {
    Archive,
    ChevronDown,
    ChevronUp,
    Eye,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatTanggalKalenderWib } from "@/shared/lib/utils";

const BULAN = [
    ["1", "Januari"],
    ["2", "Februari"],
    ["3", "Maret"],
    ["4", "April"],
    ["5", "Mei"],
    ["6", "Juni"],
    ["7", "Juli"],
    ["8", "Agustus"],
    ["9", "September"],
    ["10", "Oktober"],
    ["11", "November"],
    ["12", "Desember"],
];

function yearChoices(selected) {
    const now = new Date().getFullYear();
    const years = [];
    for (let year = now + 1; year >= now - 10; year -= 1) {
        years.push(String(year));
    }
    if (selected && selected !== "all" && !years.includes(String(selected))) {
        years.push(String(selected));
        years.sort((a, b) => Number(b) - Number(a));
    }
    return years;
}

function blankDraft() {
    return {
        jenis: "all",
        tahun: "all",
        bulan: "all",
        tanggal: "",
        perihal: "",
        pihak: "",
        range: "all",
        search: "",
    };
}

function draftFromFilters(filters) {
    return {
        jenis: filters?.jenis && filters.jenis !== "all" ? filters.jenis : "all",
        tahun: filters?.tahun ? String(filters.tahun) : "all",
        bulan: filters?.bulan ? String(filters.bulan) : "all",
        tanggal: filters?.tanggal ? String(filters.tanggal).slice(0, 10) : "",
        perihal: filters?.perihal ?? "",
        pihak: filters?.pihak ?? "",
        range: filters?.range && filters.range !== "all" ? filters.range : "all",
        search: filters?.search ?? "",
    };
}

function agendaInputFromFilters(filters) {
    if (filters?.nomor_agenda) {
        return String(filters.nomor_agenda);
    }
    const kode = filters?.jenis === "masuk" ? "SM" : filters?.jenis === "keluar" ? "SK" : "";
    if (!kode) {
        return "";
    }
    if (!filters?.tahun) {
        return kode;
    }
    if (!filters?.bulan) {
        return `${kode}/${filters.tahun}`;
    }
    return `${kode}/${filters.tahun}/${String(filters.bulan).padStart(2, "0")}`;
}

/**
 * @param {string} raw
 * @returns {{ valid: boolean, jenis?: string, tahun?: number, bulan?: number, nomor_agenda?: string }}
 */
function parseAgendaInput(raw) {
    const text = String(raw ?? "").trim().toUpperCase();
    if (text === "") {
        return { valid: true };
    }

    const full = text.match(/^(SM|SK)\/(\d{4})\/(\d{2})\/(\d{4})$/);
    const month = text.match(/^(SM|SK)\/(\d{4})\/(\d{2})$/);
    const year = text.match(/^(SM|SK)\/(\d{4})$/);
    const kind = text.match(/^(SM|SK)$/);
    const match = full || month || year || kind;
    if (!match) {
        return { valid: false };
    }

    const jenis = match[1] === "SM" ? "masuk" : "keluar";
    if (!match[2]) {
        return { valid: true, jenis };
    }

    const tahun = Number(match[2]);
    if (tahun < 2000 || tahun > 2100) {
        return { valid: false };
    }
    if (!match[3]) {
        return { valid: true, jenis, tahun };
    }

    const bulan = Number(match[3]);
    if (bulan < 1 || bulan > 12) {
        return { valid: false };
    }
    if (!match[4]) {
        return { valid: true, jenis, tahun, bulan };
    }

    return {
        valid: true,
        jenis,
        tahun,
        bulan,
        nomor_agenda: `${match[1]}/${match[2]}/${match[3]}/${match[4]}`,
    };
}

function sameAgenda(parsed, filters) {
    const jenis = parsed.jenis ?? "all";
    const currentJenis = filters?.jenis && filters.jenis !== "all" ? filters.jenis : "all";
    return (
        jenis === currentJenis &&
        String(parsed.tahun ?? "") === String(filters?.tahun ?? "") &&
        String(parsed.bulan ?? "") === String(filters?.bulan ?? "") &&
        String(parsed.nomor_agenda ?? "") === String(filters?.nomor_agenda ?? "")
    );
}

function formatTanggalArsip(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/** @typedef {'no_surat' | 'tanggal_surat' | 'diarsipkan_at'} SortKey */

export default function ArsipSuratIndex({ letters, filters }) {
    const [loading, setLoading] = useState(false);
    const [agendaInput, setAgendaInput] = useState(() => agendaInputFromFilters(filters));
    const [filterOpen, setFilterOpen] = useState(false);
    const [draft, setDraft] = useState(() => draftFromFilters(filters));
    const filtersRef = useRef(filters);
    const skipAgendaDebounce = useRef(false);

    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    const visit = useCallback((params = {}) => {
        setLoading(true);
        const f = filtersRef.current ?? {};
        const pick = (key) => {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                const value = params[key];
                return value === "" || value === null || value === undefined || value === "all"
                    ? undefined
                    : value;
            }
            const current = f[key];
            return current === "" || current == null || current === "all"
                ? undefined
                : current;
        };
        router.get(
            route("admin.arsip-surat.index"),
            {
                page: params.page ?? 1,
                search: pick("search"),
                sort_by: params.sort_by ?? f.sort_by,
                sort_dir: params.sort_dir ?? f.sort_dir,
                per_page: params.per_page ?? f.per_page,
                jenis: pick("jenis") ?? "all",
                range: pick("range") ?? "all",
                tahun: pick("tahun"),
                bulan: pick("bulan"),
                tanggal: pick("tanggal"),
                perihal: pick("perihal"),
                pihak: pick("pihak"),
                nomor_agenda: pick("nomor_agenda"),
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
        if (skipAgendaDebounce.current) {
            skipAgendaDebounce.current = false;
            return undefined;
        }
        const handle = setTimeout(() => {
            const parsed = parseAgendaInput(agendaInput);
            if (!parsed.valid || sameAgenda(parsed, filtersRef.current)) {
                return;
            }
            visit({
                page: 1,
                jenis: parsed.jenis ?? "all",
                tahun: parsed.tahun,
                bulan: parsed.bulan,
                nomor_agenda: parsed.nomor_agenda,
            });
        }, 400);
        return () => clearTimeout(handle);
    }, [agendaInput, visit]);

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
        range !== "all" ||
        Boolean(filters?.tahun) ||
        Boolean(filters?.bulan) ||
        Boolean(filters?.tanggal) ||
        Boolean(filters?.perihal) ||
        Boolean(filters?.pihak) ||
        Boolean(filters?.nomor_agenda);

    const activeFilterCount = [
        filters?.search,
        jenis !== "all",
        range !== "all",
        filters?.tahun,
        filters?.bulan,
        filters?.tanggal,
        filters?.perihal,
        filters?.pihak,
    ].filter(Boolean).length;

    const openFilters = () => {
        setDraft(draftFromFilters(filters));
        setFilterOpen(true);
    };

    const applyFilters = () => {
        const yearActive = draft.jenis === "masuk" || draft.jenis === "keluar";
        const tahun = yearActive && draft.tahun !== "all" ? draft.tahun : undefined;
        visit({
            page: 1,
            jenis: draft.jenis,
            range: draft.range,
            search: String(draft.search ?? "").trim() || undefined,
            tahun,
            bulan: tahun && draft.bulan !== "all" ? draft.bulan : undefined,
            tanggal: draft.tanggal || undefined,
            perihal: String(draft.perihal ?? "").trim() || undefined,
            pihak: String(draft.pihak ?? "").trim() || undefined,
            nomor_agenda: undefined,
        });
        setFilterOpen(false);
    };

    const resetFilters = () => {
        if (agendaInput !== "") {
            skipAgendaDebounce.current = true;
            setAgendaInput("");
        }
        setDraft(blankDraft());
        setFilterOpen(false);
        visit({
            page: 1,
            search: undefined,
            jenis: "all",
            range: "all",
            tahun: undefined,
            bulan: undefined,
            tanggal: undefined,
            perihal: undefined,
            pihak: undefined,
            nomor_agenda: undefined,
        });
    };

    const yearActive = draft.jenis === "masuk" || draft.jenis === "keluar";
    const yearChosen = yearActive && draft.tahun !== "all";

    return (
        <AppLayout
            title="Arsip Surat"
            subtitle="Kumpulan surat masuk dan keluar yang telah diarsipkan."
        >
            <Head title="Arsip Surat" />

            <div className="surface-card overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-border px-6 py-6 md:flex-row md:items-center md:px-8">
                    <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={agendaInput}
                            onChange={(event) => setAgendaInput(event.target.value)}
                            placeholder="Cari Nomor Agenda, contoh SM/2026, SM/2026/08, SM/2026/08/0005"
                            aria-label="Cari Nomor Agenda"
                            className="h-12 rounded-xl pl-12 text-base"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-12 shrink-0 rounded-xl px-5"
                        onClick={openFilters}
                    >
                        <SlidersHorizontal className="size-4" />
                        Filter
                        {activeFilterCount > 0 ? (
                            <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                                {activeFilterCount}
                            </span>
                        ) : null}
                    </Button>
                </div>

                <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Filter arsip</DialogTitle>
                            <DialogDescription>
                                Saring berdasarkan atribut surat. Nomor surat tetap dicari dengan kecocokan sebagian.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <h3 className="col-span-1 text-sm font-semibold text-foreground sm:col-span-2">
                                Pencarian Nomor Agenda
                            </h3>
                            <div className="space-y-2">
                                <Label>Jenis</Label>
                                <Select
                                    value={draft.jenis}
                                    onValueChange={(value) =>
                                        setDraft((current) => ({
                                            ...current,
                                            jenis: value,
                                            ...(value === "all"
                                                ? { tahun: "all", bulan: "all" }
                                                : {}),
                                        }))
                                    }
                                >
                                    <SelectTrigger className="h-11 w-full rounded-xl">
                                        <SelectValue placeholder="Jenis surat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua jenis</SelectItem>
                                        <SelectItem value="masuk">Surat Masuk</SelectItem>
                                        <SelectItem value="keluar">Surat Keluar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tahun</Label>
                                <Select
                                    value={yearActive ? draft.tahun : "all"}
                                    disabled={!yearActive}
                                    onValueChange={(value) =>
                                        setDraft((current) => ({
                                            ...current,
                                            tahun: value,
                                            ...(value === "all" ? { bulan: "all" } : {}),
                                        }))
                                    }
                                >
                                    <SelectTrigger className="h-11 w-full rounded-xl">
                                        <SelectValue placeholder="Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua tahun</SelectItem>
                                        {yearChoices(draft.tahun).map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Bulan</Label>
                                <Select
                                    value={yearChosen ? draft.bulan : "all"}
                                    disabled={!yearChosen}
                                    onValueChange={(value) =>
                                        setDraft((current) => ({ ...current, bulan: value }))
                                    }
                                >
                                    <SelectTrigger className="h-11 w-full rounded-xl">
                                        <SelectValue placeholder="Bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua bulan</SelectItem>
                                        {BULAN.map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <h3 className="col-span-1 border-t border-border pt-4 text-sm font-semibold text-foreground sm:col-span-2">
                                Informasi Surat
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="arsip-tanggal">Tanggal Surat</Label>
                                <Input
                                    id="arsip-tanggal"
                                    type="date"
                                    value={draft.tanggal}
                                    onChange={(event) =>
                                        setDraft((current) => ({
                                            ...current,
                                            tanggal: event.target.value,
                                        }))
                                    }
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="arsip-perihal">Perihal</Label>
                                <Input
                                    id="arsip-perihal"
                                    value={draft.perihal}
                                    onChange={(event) =>
                                        setDraft((current) => ({
                                            ...current,
                                            perihal: event.target.value,
                                        }))
                                    }
                                    placeholder="Perihal"
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="arsip-pihak">Pengirim / Tujuan</Label>
                                <Input
                                    id="arsip-pihak"
                                    value={draft.pihak}
                                    onChange={(event) =>
                                        setDraft((current) => ({
                                            ...current,
                                            pihak: event.target.value,
                                        }))
                                    }
                                    placeholder="Pengirim / Tujuan"
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="arsip-nomor-surat">Nomor Surat</Label>
                                <Input
                                    id="arsip-nomor-surat"
                                    value={draft.search}
                                    onChange={(event) =>
                                        setDraft((current) => ({
                                            ...current,
                                            search: event.target.value,
                                        }))
                                    }
                                    placeholder="Nomor surat"
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Rentang Arsip</Label>
                                <Select
                                    value={draft.range}
                                    onValueChange={(value) =>
                                        setDraft((current) => ({ ...current, range: value }))
                                    }
                                >
                                    <SelectTrigger className="h-11 w-full rounded-xl">
                                        <SelectValue placeholder="Rentang arsip" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua waktu</SelectItem>
                                        <SelectItem value="7d">7 hari terakhir</SelectItem>
                                        <SelectItem value="30d">30 hari terakhir</SelectItem>
                                        <SelectItem value="90d">90 hari terakhir</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={resetFilters}>
                                Reset
                            </Button>
                            <Button type="button" onClick={applyFilters}>
                                Terapkan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
                                            Surat{" "}
                                            <SortIcon k="no_surat" />
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Pengirim / Tujuan
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            <div className="flex flex-col items-start gap-1.5">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center hover:text-foreground"
                                                    onClick={() =>
                                                        toggleSort("tanggal_surat")
                                                    }
                                                >
                                                    Tgl Surat{" "}
                                                    <SortIcon k="tanggal_surat" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center hover:text-foreground"
                                                    onClick={() =>
                                                        toggleSort("diarsipkan_at")
                                                    }
                                                >
                                                    Tgl Arsip{" "}
                                                    <SortIcon k="diarsipkan_at" />
                                                </button>
                                            </div>
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
                                            <td className="px-6 md:px-8 py-3 text-sm text-muted-foreground tabular-nums align-top">
                                                {from + idx}
                                            </td>
                                            <td className="max-w-md px-4 py-3 align-top">
                                                <p className="text-sm font-medium leading-tight text-foreground">
                                                    {a.perihal}
                                                </p>
                                                <Link
                                                    href={route(
                                                        "admin.arsip-surat.show",
                                                        {
                                                            jenis: a.jenis,
                                                            id: a.id,
                                                        },
                                                    )}
                                                    className="mt-0.5 inline-block font-mono text-sm text-primary hover:underline"
                                                >
                                                    {a.no_surat}
                                                </Link>
                                                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                                    {a.nomor_agenda ?? "—"}
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {a.jenis === "masuk"
                                                        ? "Surat Masuk"
                                                        : "Surat Keluar"}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-foreground align-top">
                                                {a.pihak}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground align-top">
                                                <p className="tabular-nums whitespace-nowrap">
                                                    <span className="mr-2 text-xs">Surat</span>
                                                    {a.tanggal_surat
                                                        ? formatTanggalKalenderWib(
                                                              a.tanggal_surat,
                                                          )
                                                        : "—"}
                                                </p>
                                                <p className="mt-0.5 tabular-nums whitespace-nowrap text-xs">
                                                    <span className="mr-2">Arsip</span>
                                                    {formatTanggalArsip(
                                                        a.diarsipkan_at,
                                                    )}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-sm border border-success/20 bg-success-soft px-2 py-0 text-[11px] font-medium text-success"
                                                >
                                                    Diarsipkan
                                                </Badge>
                                            </td>
                                            <td className="px-6 md:px-8 py-3 align-top">
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

                        <div className="flex flex-col items-center justify-between gap-3 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row md:px-8">
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
                            <div className="flex flex-wrap items-center justify-end gap-2">
                                <Select
                                    value={String(perPage)}
                                    onValueChange={(value) =>
                                        visit({
                                            page: 1,
                                            per_page: Number(value),
                                        })
                                    }
                                >
                                    <SelectTrigger className="h-9 w-36 rounded-lg">
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
