import { Button } from "@/Components/ui/button";
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
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Archive,
    ArrowLeft,
    FileText,
    Pencil,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { cn, formatTanggalKalenderWib } from "@/lib/utils";
import { FilePreview } from "@/Components/FilePreview";

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

export default function ShowSuratKeluar({ letter }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleArsipkan = () => {
        router.patch(
            route("admin.surat-keluar.archive", { surat_keluar: letter.id }),
            {},
            { preserveScroll: true },
        );
    };

    const STATUS_CONFIG = {
        draft: { label: "Draft", className: "bg-yellow-100 text-yellow-800" },
        terkirim: {
            label: "Terkirim",
            className: "bg-blue-100 text-blue-800",
        },
    };

    const statusCfg = STATUS_CONFIG[letter.status];

    return (
        <AppLayout
            title="Detail Surat Keluar"
            subtitle={letter.no_surat}
            actions={
                <Button asChild variant="outline" className="rounded-xl h-10">
                    <Link href={route("admin.surat-keluar.index")}>
                        <ArrowLeft className="size-4 mr-1.5" />
                        Kembali
                    </Link>
                </Button>
            }
        >
            <Head title={`Surat — ${letter.no_surat}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/*  Kolom utama  */}
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
                            <div className="flex flex-wrap items-center gap-2 justify-end">
                                <span
                                    className={cn(
                                        "inline-flex px-2.5 py-1 rounded-full text-xs font-semibold",
                                        statusCfg?.className ??
                                            "bg-gray-100 text-gray-700",
                                    )}
                                >
                                    {statusCfg?.label ?? letter.status ?? "—"}
                                </span>
                                {letter.diarsipkan_at && (
                                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-100">
                                        Diarsip
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Fields */}
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <Field
                                label="Tanggal Surat"
                                value={
                                    letter.tanggal_kirim
                                        ? formatTanggalKalenderWib(
                                              letter.tanggal_kirim,
                                          )
                                        : null
                                }
                            />
                            <Field label="Tujuan" value={letter.tujuan} />
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
                        </dl>

                        {/* Action buttons */}
                        <div className="mt-7 pt-5 border-t border-border flex flex-wrap items-center gap-2">
                            {!letter.diarsipkan_at ? (
                                <Button
                                    variant="outline"
                                    onClick={handleArsipkan}
                                    className="rounded-xl border-amber-300/80 text-amber-900 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-100 dark:hover:bg-amber-950/40"
                                >
                                    <Archive className="size-4 mr-1.5" />
                                    Arsipkan
                                </Button>
                            ) : (
                                <Button asChild variant="outline" className="rounded-xl">
                                    <Link
                                        href={route(
                                            "admin.arsip-surat.show",
                                            {
                                                jenis: "keluar",
                                                id: letter.id,
                                            },
                                        )}
                                    >
                                        <Archive className="size-4 mr-1.5" />
                                        Lihat di Arsip
                                    </Link>
                                </Button>
                            )}

                            <Button
                                asChild
                                variant="outline"
                                className="rounded-xl"
                            >
                                <Link
                                    href={route("admin.surat-keluar.edit", {
                                        surat_keluar: letter.id,
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
                                    href={route("admin.surat-keluar.edit", {
                                        surat_keluar: letter.id,
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
                    <h3 className="font-bold text-base">Informasi Surat</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                        Ringkasan metadata surat keluar.
                    </p>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-medium">
                                {statusCfg?.label ?? letter.status ?? "—"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">
                                Tanggal Kirim
                            </span>
                            <span className="font-medium tabular-nums">
                                {letter.tanggal_kirim
                                    ? formatTanggalKalenderWib(
                                          letter.tanggal_kirim,
                                      )
                                    : "—"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">
                                Lampiran
                            </span>
                            <span className="font-medium">
                                {letter.file_url ? "Tersedia" : "Tidak ada"}
                            </span>
                        </div>
                    </div>
                </aside>
            </div>

            <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus surat ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Surat{" "}
                            <span className="font-mono font-semibold text-foreground">
                                {letter.no_surat}
                            </span>{" "}
                            akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                router.delete(
                                    route("admin.surat-keluar.destroy", {
                                        surat_keluar: letter.id,
                                    }),
                                )
                            }
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
