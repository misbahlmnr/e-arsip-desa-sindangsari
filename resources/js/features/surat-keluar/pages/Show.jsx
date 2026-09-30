import { Button } from "@/components/ui/button";
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
import AppLayout from "@/layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Archive, FileText, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { carryListState } from "@/shared/lib/listState";
import { formatTanggalKalenderWib } from "@/shared/lib/utils";
import { FilePreview } from "@/components/FilePreview";
import { SupportingDocumentsList } from "@/components/SupportingDocumentsField";
import BackLink from "@/components/BackLink";

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
    const canManageSurat = usePage().props.auth.canManageSurat;
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleArsipkan = () => {
        router.patch(
            route("admin.surat-keluar.archive", { surat_keluar: letter.id }),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout
            title="Detail Surat Keluar"
            subtitle={letter.no_surat}
        >
            <Head title={`Surat — ${letter.no_surat}`} />

            <BackLink href={route("admin.surat-keluar.index")} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/*  Kolom utama  */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Info card */}
                    <div className="surface-card p-6 md:p-8">
                        <div className="mb-6 space-y-5">
                            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                                <h2 className="text-xl font-semibold leading-tight text-foreground min-w-0 flex-1">
                                    {letter.perihal || "—"}
                                </h2>
                                {letter.diarsipkan_at && (
                                    <span className="inline-flex px-2.5 py-1 rounded-sm text-xs font-semibold bg-success-soft text-success">
                                        Diarsip
                                    </span>
                                )}
                            </div>

                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                <div>
                                    <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Nomor Agenda
                                    </dt>
                                    <dd className="font-mono text-base font-semibold text-foreground mt-1">
                                        {letter.nomor_agenda ?? "—"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Nomor Surat
                                    </dt>
                                    <dd className="font-mono text-sm font-medium text-foreground mt-1">
                                        {letter.no_surat}
                                    </dd>
                                </div>
                            </dl>
                        </div>

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
                            {letter.catatan?.trim() && (
                                <Field
                                    label="Catatan"
                                    value={letter.catatan}
                                    className="sm:col-span-2"
                                />
                            )}
                        </dl>

                        {(canManageSurat || letter.diarsipkan_at) && (
                            <div className="mt-7 pt-5 border-t border-border flex flex-wrap items-center gap-2">
                                {canManageSurat && (
                                    <>
                                        {!letter.diarsipkan_at ? (
                                            <Button
                                                variant="outline"
                                                onClick={handleArsipkan}
                                                className="rounded-xl text-muted-foreground border-border hover:bg-muted"
                                            >
                                                <Archive className="size-4 mr-1.5" />
                                                Arsipkan
                                            </Button>
                                        ) : (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="rounded-xl"
                                            >
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
                                                href={carryListState(
                                                    route(
                                                        "admin.surat-keluar.edit",
                                                        {
                                                            surat_keluar:
                                                                letter.id,
                                                        },
                                                    ),
                                                )}
                                            >
                                                <Pencil className="size-4 mr-1.5" />
                                                Edit
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="rounded-xl text-destructive hover:text-destructive hover:bg-red-50 border-destructive/30"
                                            onClick={() =>
                                                setConfirmDelete(true)
                                            }
                                        >
                                            <Trash2 className="size-4 mr-1.5" />
                                            Hapus
                                        </Button>
                                    </>
                                )}

                                {!canManageSurat && letter.diarsipkan_at && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="rounded-xl"
                                    >
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
                            </div>
                        )}
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
                            {canManageSurat && (
                                <Button asChild variant="link" className="mt-2">
                                    <Link
                                        href={carryListState(
                                            route("admin.surat-keluar.edit", {
                                                surat_keluar: letter.id,
                                            }),
                                        )}
                                    >
                                        Tambahkan lampiran
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                    <SupportingDocumentsList
                        documents={letter.supporting_documents}
                    />
                </div>

                {/* ── Sidebar disposisi ────────────────────────────────── */}
                <aside className="surface-card p-6 md:p-8 self-start">
                    <h3 className="font-semibold text-base">Lampiran</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                        Berkas utama surat keluar.
                    </p>
                    <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">
                            File surat
                        </span>
                        <span className="font-medium">
                            {letter.file_url ? "Tersedia" : "Tidak ada"}
                        </span>
                    </div>
                </aside>
            </div>

            {canManageSurat && (
                <AlertDialog
                    open={confirmDelete}
                    onOpenChange={setConfirmDelete}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Hapus surat ini?
                            </AlertDialogTitle>
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
            )}
        </AppLayout>
    );
}
