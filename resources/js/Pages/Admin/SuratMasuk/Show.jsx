// resources/js/Pages/Admin/SuratMasuk/Show.jsx

import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    CheckCircle2,
    FileText,
    Pencil,
    Send,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { cn, formatTanggalKalenderWib } from "@/lib/utils";
import { FilePreview } from "@/Components/FilePreview";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    belum_diproses: {
        label: "Belum Diproses",
        className: "bg-yellow-100 text-yellow-800",
    },
    sedang_diproses: {
        label: "Sedang Diproses",
        className: "bg-blue-100 text-blue-800",
    },
    selesai: {
        label: "Selesai",
        className: "bg-green-100 text-green-800",
    },
};

const DISPOSISI_STATUS_CONFIG = {
    Menunggu: { label: "Menunggu", className: "bg-orange-100 text-orange-700" },
    Diproses: { label: "Diproses", className: "bg-blue-100 text-blue-700" },
    Selesai: { label: "Selesai", className: "bg-green-100 text-green-700" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function Field({ label, value, className }) {
    return (
        <div className={className}>
            <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {label}
            </dt>
            <dd className="text-sm font-medium text-foreground mt-1 leading-relaxed">
                {value || "—"}
            </dd>
        </div>
    );
}

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span
            className={cn(
                "inline-flex px-2.5 py-1 rounded-full text-xs font-semibold",
                cfg?.className ?? "bg-gray-100 text-gray-700",
            )}
        >
            {cfg?.label ?? status ?? "—"}
        </span>
    );
}

function DisposisiBadge({ status }) {
    const cfg = DISPOSISI_STATUS_CONFIG[status];
    if (!cfg) return null;
    return (
        <span
            className={cn(
                "inline-flex px-2.5 py-1 rounded-full text-xs font-semibold",
                cfg.className,
            )}
        >
            {cfg.label}
        </span>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ShowSuratMasuk({ letter }) {
    const [openDispo, setOpenDispo] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [dispoTo, setDispoTo] = useState("Kepala Desa");
    const [dispoNote, setDispoNote] = useState("");
    const [dispoLoading, setDispoLoading] = useState(false);

    // Pastikan disposisi selalu array meskipun null dari backend
    const disposisi = letter.disposisi ?? [];

    const handleStatusSelesai = () => {
        router.patch(
            route("admin.surat-masuk.update-status", {
                surat_masuk: letter.id,
            }),
            { status: "selesai" },
            { preserveScroll: true },
        );
    };

    const handleDelete = () => {
        router.delete(
            route("admin.surat-masuk.destroy", { surat_masuk: letter.id }),
        );
    };

    const submitDispo = () => {
        if (!dispoNote.trim()) return;
        setDispoLoading(true);
        router.post(
            route("admin.surat-masuk.disposisi.store", {
                surat_masuk: letter.id,
            }),
            { kepada: dispoTo, catatan: dispoNote.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenDispo(false);
                    setDispoNote("");
                },
                onFinish: () => setDispoLoading(false),
            },
        );
    };

    const formatDateTime = (iso) => {
        if (!iso) return "—";
        return new Date(iso).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AppLayout
            title="Detail Surat Masuk"
            subtitle={letter.no_surat}
            actions={
                <Button asChild variant="outline" className="rounded-xl h-10">
                    <Link href={route("admin.surat-masuk.index")}>
                        <ArrowLeft className="size-4 mr-1.5" />
                        Kembali
                    </Link>
                </Button>
            }
        >
            <Head title={`Surat — ${letter.no_surat}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Kolom utama ─────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Info card */}
                    <div className="surface-card p-6 md:p-8">
                        {/* Header: nomor + badge */}
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    Nomor Surat
                                </p>
                                <p className="font-mono text-xl font-bold mt-1">
                                    {letter.no_surat}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge status={letter.status} />
                            </div>
                        </div>

                        {/* Fields */}
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <Field
                                label="No. Registrasi"
                                value={letter.nomor_registrasi}
                            />
                            <Field
                                label="Tanggal Surat"
                                value={
                                    letter.tanggal_surat
                                        ? formatTanggalKalenderWib(
                                              letter.tanggal_surat,
                                          )
                                        : null
                                }
                            />
                            <Field
                                label="Tanggal Diterima"
                                value={formatTanggalKalenderWib(
                                    letter.tanggal_terima,
                                )}
                            />
                            <Field label="Pengirim" value={letter.pengirim} />
                            <Field
                                label="Perihal"
                                value={letter.perihal}
                                className="sm:col-span-2"
                            />
                            {letter.catatan?.trim() && (
                                <Field
                                    label="Catatan"
                                    value={letter.catatan}
                                    className="sm:col-span-2"
                                />
                            )}
                            {letter.tujuan && (
                                <Field label="Tujuan" value={letter.tujuan} />
                            )}
                        </dl>

                        {/* Action buttons */}
                        <div className="mt-7 pt-5 border-t border-border flex flex-wrap items-center gap-2">
                            <Button
                                onClick={() => setOpenDispo(true)}
                                className="rounded-xl font-semibold"
                            >
                                <Send className="size-4 mr-1.5" />
                                Buat Disposisi
                            </Button>

                            {letter.status !== "selesai" && (
                                <Button
                                    variant="outline"
                                    onClick={handleStatusSelesai}
                                    className="rounded-xl"
                                >
                                    <CheckCircle2 className="size-4 mr-1.5" />
                                    Tandai Selesai
                                </Button>
                            )}

                            <Button
                                asChild
                                variant="outline"
                                className="rounded-xl"
                            >
                                <Link
                                    href={route("admin.surat-masuk.edit", {
                                        surat_masuk: letter.id,
                                    })}
                                >
                                    <Pencil className="size-4 mr-1.5" />
                                    Edit
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="rounded-xl text-destructive hover:text-destructive hover:bg-red-50 border-destructive/30"
                                onClick={() => setConfirmDelete(true)}
                            >
                                <Trash2 className="size-4 mr-1.5" />
                                Hapus
                            </Button>
                        </div>
                    </div>

                    {/* File lampiran */}
                    {letter.file_url ? (
                        <div className="space-y-3">
                            <h3 className="font-bold text-base">
                                Lampiran Surat
                            </h3>
                            <FilePreview file={letter.file_url} />
                        </div>
                    ) : (
                        <div className="surface-card p-8 text-center">
                            <div className="mx-auto size-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                                <FileText className="size-5 text-muted-foreground" />
                            </div>
                            <p className="font-medium">
                                Surat ini belum memiliki lampiran.
                            </p>
                            <Button asChild variant="link" className="mt-2">
                                <Link
                                    href={route("admin.surat-masuk.edit", {
                                        surat_masuk: letter.id,
                                    })}
                                >
                                    Tambahkan lampiran
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* ── Sidebar disposisi ────────────────────────────────── */}
                <aside className="surface-card p-6 md:p-8 self-start">
                    <h3 className="font-bold text-base">Riwayat Disposisi</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                        {disposisi.length} entri
                    </p>

                    {disposisi.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border p-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Belum ada disposisi. Klik{" "}
                                <span className="font-semibold text-foreground">
                                    Buat Disposisi
                                </span>{" "}
                                untuk memulai.
                            </p>
                        </div>
                    ) : (
                        <ol className="space-y-4 relative before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                            {disposisi.map((d) => (
                                <li key={d.id} className="relative pl-7">
                                    <span className="absolute left-0 top-1.5 size-3.5 rounded-full bg-primary ring-4 ring-card" />
                                    <p className="text-xs text-muted-foreground tabular-nums">
                                        {formatDateTime(
                                            d.created_at ?? d.tanggal,
                                        )}
                                    </p>
                                    <p className="text-sm font-semibold mt-0.5">
                                        {d.dari}{" "}
                                        <span className="text-muted-foreground font-normal">
                                            →
                                        </span>{" "}
                                        {d.kepada}
                                    </p>
                                    <p className="text-sm text-foreground/80 mt-1.5 leading-relaxed">
                                        {d.catatan}
                                    </p>
                                    {d.status && (
                                        <DisposisiBadge status={d.status} />
                                    )}
                                </li>
                            ))}
                        </ol>
                    )}
                </aside>
            </div>

            {/* ── Dialog: Buat Disposisi ──────────────────────────────── */}
            <Dialog open={openDispo} onOpenChange={setOpenDispo}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Buat Disposisi</DialogTitle>
                        <DialogDescription>
                            Teruskan surat ini kepada pejabat yang berwenang
                            beserta arahan.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Tujuan</Label>
                            <Select value={dispoTo} onValueChange={setDispoTo}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Kepala Desa">
                                        Kepala Desa
                                    </SelectItem>
                                    <SelectItem value="Sekretaris Desa">
                                        Sekretaris Desa
                                    </SelectItem>
                                    <SelectItem value="Kaur Pemerintahan">
                                        Kaur Pemerintahan
                                    </SelectItem>
                                    <SelectItem value="Kaur Keuangan">
                                        Kaur Keuangan
                                    </SelectItem>
                                    <SelectItem value="Kaur Umum">
                                        Kaur Umum
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Catatan / Arahan</Label>
                            <Textarea
                                value={dispoNote}
                                onChange={(e) => setDispoNote(e.target.value)}
                                placeholder="Tuliskan arahan atau instruksi…"
                                className="min-h-[100px] rounded-xl resize-none"
                                maxLength={500}
                            />
                            {!dispoNote.trim() && dispoLoading === false && (
                                <p className="text-xs text-muted-foreground">
                                    Catatan wajib diisi.
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setOpenDispo(false)}
                            className="rounded-xl"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={submitDispo}
                            disabled={!dispoNote.trim() || dispoLoading}
                            className="rounded-xl font-semibold"
                        >
                            <Send className="size-4 mr-1.5" />
                            {dispoLoading ? "Mengirim…" : "Kirim Disposisi"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── AlertDialog: Konfirmasi hapus ───────────────────────── */}
            <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus surat ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Surat{" "}
                            <span className="font-mono font-semibold text-foreground">
                                {letter.no_surat}
                            </span>{" "}
                            beserta riwayat disposisinya akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus Surat
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
