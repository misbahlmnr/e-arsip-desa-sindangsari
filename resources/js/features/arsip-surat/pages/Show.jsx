import { FilePreview } from "@/components/FilePreview";
import { SupportingDocumentsList } from "@/components/SupportingDocumentsField";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/AppLayout";
import { cn, formatTanggalKalenderWib } from "@/shared/lib/utils";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Download, FileText, RotateCcw } from "lucide-react";
import { useState } from "react";
import BackLink from "@/components/BackLink";

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
    const canManageSurat = usePage().props.auth.canManageSurat;
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
            );
        } else {
            router.patch(
                route("admin.surat-keluar.unarchive", {
                    surat_keluar: letter.id,
                }),
            );
        }
    };

    return (
        <AppLayout
            title="Detail Arsip"
            subtitle={letter.no_surat}
        >
            <Head title={`Arsip — ${letter.no_surat}`} />

            <BackLink href={route("admin.arsip-surat.index")} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="surface-card p-6 md:p-8">
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-xl font-semibold leading-snug text-foreground">
                                    {letter.perihal}
                                </h2>
                                <p className="mt-2 font-mono text-base text-foreground">
                                    {letter.no_surat}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "rounded-sm border px-2 py-0 text-[11px] font-medium",
                                            isMasuk
                                                ? "border-info/20 bg-info-soft text-info"
                                                : "border-warning/20 bg-warning-soft text-warning",
                                        )}
                                    >
                                        {isMasuk ? "Surat Masuk" : "Surat Keluar"}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="rounded-sm border border-success/20 bg-success-soft px-2 py-0 text-[11px] font-medium text-success"
                                    >
                                        Diarsipkan
                                    </Badge>
                                </div>
                                <p className="mt-3 text-sm text-muted-foreground">
                                    Nomor agenda{" "}
                                    <span className="font-mono">
                                        {letter.nomor_agenda ?? "—"}
                                    </span>
                                </p>
                            </div>

                            <dl className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-border pt-5 sm:grid-cols-2">
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
                            </dl>

                            {letter.catatan?.trim() && (
                                <div className="border-t border-border pt-5">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Catatan
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {letter.catatan}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5">
                            {canManageSurat && (
                                <Button
                                    variant="outline"
                                    onClick={() => setConfirmRestore(true)}
                                    className="rounded-xl"
                                >
                                    <RotateCcw className="size-4 mr-1.5" />
                                    Pulihkan Arsip
                                </Button>
                            )}
                            {letter.file_url ? (
                                <Button asChild className="rounded-xl">
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
                    <SupportingDocumentsList
                        documents={letter.supporting_documents}
                    />
                </div>

                <aside className="surface-card p-6 md:p-8 self-start">
                    <h3 className="font-bold text-base">Informasi Arsip</h3>
                    <p className="mb-5 mt-1 text-sm text-muted-foreground">
                        Ringkasan data arsip surat.
                    </p>
                    <div className="space-y-4 text-sm">
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

            {canManageSurat && (
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
            )}
        </AppLayout>
    );
}
