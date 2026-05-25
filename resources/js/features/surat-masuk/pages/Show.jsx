import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    Archive,
    ArrowLeft,
    CheckCircle2,
    FileText,
    Pencil,
    Send,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { formatTanggalKalenderWib } from "@/shared/lib/utils";
import { FilePreview } from "@/components/FilePreview";
import { DisposisiBadge, StatusBadge } from "@/components/StatusBadge";
import {
    badgeLabel,
    DISPOSISI_STATUS_LABELS,
    SURAT_MASUK_STATUS_LABELS,
} from "@/shared/constants/badgeLabels";
import CreateDisposisiModal from "../components/CreateDisposisiModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

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

export default function ShowSuratMasuk({ letter }) {
    const { canManageSurat, canCreateDisposisi } = usePage().props.auth;
    const [openDispo, setOpenDispo] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

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

    const handleArsipkan = () => {
        router.patch(
            route("admin.surat-masuk.archive", { surat_masuk: letter.id }),
            {},
            { preserveScroll: true },
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
                            <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge
                                    value={letter.status}
                                    label={badgeLabel(
                                        SURAT_MASUK_STATUS_LABELS,
                                        letter.status,
                                    )}
                                />
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
                            {letter.tujuan && (
                                <Field label="Tujuan" value={letter.tujuan} />
                            )}
                            {letter.catatan?.trim() && (
                                <Field
                                    label="Catatan"
                                    value={letter.catatan}
                                    className="sm:col-span-2"
                                />
                            )}
                        </dl>

                        {(canCreateDisposisi || canManageSurat) && (
                            <div className="mt-7 pt-5 border-t border-border flex flex-wrap items-center gap-2">
                                {canCreateDisposisi && (
                                    <Button
                                        onClick={() => setOpenDispo(true)}
                                        className="rounded-xl font-semibold"
                                    >
                                        <Send className="size-4 mr-1.5" />
                                        Buat Disposisi
                                    </Button>
                                )}

                                {canManageSurat && (
                                    <>
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
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="rounded-xl"
                                            >
                                                <Link
                                                    href={route(
                                                        "admin.arsip-surat.show",
                                                        {
                                                            jenis: "masuk",
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
                                                href={route(
                                                    "admin.surat-masuk.edit",
                                                    {
                                                        surat_masuk: letter.id,
                                                    },
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
                                                    jenis: "masuk",
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
                                        href={route("admin.surat-masuk.edit", {
                                            surat_masuk: letter.id,
                                        })}
                                    >
                                        Tambahkan lampiran
                                    </Link>
                                </Button>
                            )}
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
                                        <div className="mt-2">
                                            <DisposisiBadge
                                                value={d.status}
                                                label={badgeLabel(
                                                    DISPOSISI_STATUS_LABELS,
                                                    d.status,
                                                )}
                                            />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    )}
                </aside>
            </div>

            {canCreateDisposisi && (
                <CreateDisposisiModal
                    letter={letter}
                    openDispo={openDispo}
                    setOpenDispo={setOpenDispo}
                />
            )}

            {canManageSurat && (
                <DeleteConfirmModal
                    letter={letter}
                    confirmDelete={confirmDelete}
                    setConfirmDelete={setConfirmDelete}
                />
            )}
        </AppLayout>
    );
}
