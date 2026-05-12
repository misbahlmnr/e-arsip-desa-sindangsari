import { FilePreview } from "@/Components/FilePreview";
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
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import AppLayout from "@/Layouts/AppLayout";
import { cn, formatTanggalKalenderWib } from "@/lib/utils";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, Download, FileText, RotateCcw } from "lucide-react";
import { useState } from "react";

function formatDateTime(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

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

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right">{value}</span>
        </div>
    );
}

export default function ArsipSuratShow({ jenis, letter }) {
    const [confirmRestore, setConfirmRestore] = useState(false);
    const isMasuk = jenis === "masuk";

    const tanggalSurat = isMasuk
        ? letter.tanggal_surat ?? letter.tanggal_terima
        : letter.tanggal_kirim;

    const pihak = isMasuk ? letter.pengirim : letter.tujuan;

    const handleRestore = () => {
        setConfirmRestore(false);
        if (isMasuk) {
            router.patch(
                route("admin.surat-masuk.unarchive", {
                    surat_masuk: letter.id,
                }),
                {},
                {
                    onSuccess: () =>
                        router.visit(route("admin.surat-masuk.index")),
                },
            );
        } else {
            router.patch(
                route("admin.surat-keluar.unarchive", {
                    surat_keluar: letter.id,
                }),
                {},
                {
                    onSuccess: () =>
                        router.visit(route("admin.surat-keluar.index")),
                },
            );
        }
    };

    return (
        <AppLayout
            title="Detail Arsip"
            subtitle={letter.no_surat}
            actions={
                <Button asChild variant="outline" className="rounded-xl h-10">
                    <Link href={route("admin.arsip-surat.index")}>
                        <ArrowLeft className="size-4 mr-1.5" />
                        Kembali
                    </Link>
                </Button>
            }
        >
            <Head title={`Arsip — ${letter.no_surat}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="surface-card p-6 md:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    Nomor Surat
                                </p>
                                <p className="font-mono text-xl font-bold mt-1">
                                    {letter.no_surat}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "font-semibold rounded-full px-2.5 py-0.5 border",
                                        isMasuk
                                            ? "bg-info-soft text-info border-info/20"
                                            : "bg-warning-soft text-warning border-warning/20",
                                    )}
                                >
                                    {isMasuk ? "Surat Masuk" : "Surat Keluar"}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="font-semibold rounded-full px-2.5 py-0.5 border bg-success-soft text-success border-success/20"
                                >
                                    Diarsipkan
                                </Badge>
                            </div>
                        </div>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <Field
                                label="Tanggal Surat"
                                value={
                                    tanggalSurat
                                        ? formatTanggalKalenderWib(tanggalSurat)
                                        : null
                                }
                            />
                            <Field
                                label={isMasuk ? "Pengirim" : "Tujuan"}
                                value={pihak}
                            />
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

                        <div className="mt-7 pt-5 border-t border-border flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setConfirmRestore(true)}
                                className="rounded-xl"
                            >
                                <RotateCcw className="size-4 mr-1.5" />
                                Pulihkan Arsip
                            </Button>
                            {letter.file_url ? (
                                <Button asChild variant="outline" className="rounded-xl">
                                    <a
                                        href={letter.file_url}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Download className="size-4 mr-1.5" />
                                        Download File
                                    </a>
                                </Button>
                            ) : null}
                            <Button asChild variant="ghost" className="rounded-xl">
                                <Link
                                    href={
                                        isMasuk
                                            ? route("admin.surat-masuk.show", {
                                                  surat_masuk: letter.id,
                                              })
                                            : route("admin.surat-keluar.show", {
                                                  surat_keluar: letter.id,
                                              })
                                    }
                                >
                                    Lihat sumber surat
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {letter.file_url ? (
                        <div className="space-y-3">
                            <h3 className="font-bold text-base">Lampiran Surat</h3>
                            <FilePreview file={letter.file_url} />
                        </div>
                    ) : (
                        <div className="surface-card p-8 text-center">
                            <div className="mx-auto size-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                                <FileText className="size-5 text-muted-foreground" />
                            </div>
                            <p className="font-medium">
                                Arsip ini tidak memiliki lampiran.
                            </p>
                        </div>
                    )}
                </div>

                <aside className="surface-card p-6 md:p-8 self-start">
                    <h3 className="font-bold text-base">Informasi Arsip</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                        Metadata pengarsipan.
                    </p>
                    <div className="space-y-4 text-sm">
                        <InfoRow label="Diarsipkan oleh" value="—" />
                        <InfoRow
                            label="Tanggal arsip"
                            value={formatDateTime(letter.diarsipkan_at)}
                        />
                        <InfoRow
                            label="Lampiran"
                            value={letter.file_url ? "Tersedia" : "Tidak ada"}
                        />
                    </div>
                </aside>
            </div>

            <AlertDialog open={confirmRestore} onOpenChange={setConfirmRestore}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Pulihkan arsip ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Surat{" "}
                            <span className="font-mono font-semibold text-foreground">
                                {letter.no_surat}
                            </span>{" "}
                            akan kembali ke modul{" "}
                            {isMasuk ? "Surat Masuk" : "Surat Keluar"} dan dihapus
                            dari daftar arsip.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestore}>
                            Pulihkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
