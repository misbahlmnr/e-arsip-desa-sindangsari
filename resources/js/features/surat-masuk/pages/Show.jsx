import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    Archive,
    ArrowLeft,
    ClipboardCheck,
    FileText,
    Pencil,
    Send,
    ShieldCheck,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { formatTanggalKalenderWib } from "@/shared/lib/utils";
import { FilePreview } from "@/components/FilePreview";
import { StatusBadge } from "@/components/StatusBadge";
import {
    badgeLabel,
    resolveSuratMasukAlurStatus,
    SURAT_MASUK_ALUR_LABELS,
    TINGKAT_SURAT_LABELS,
} from "@/shared/constants/badgeLabels";
import CreateDisposisiModal from "../components/CreateDisposisiModal";
import ReviewSuratModal from "../components/ReviewSuratModal";
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

export default function ShowSuratMasuk({ letter, jabatanOptions, dariJabatan }) {
    const { canManageSurat } = usePage().props.auth;
    const [openDispo, setOpenDispo] = useState(false);
    const [openReview, setOpenReview] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    const disposisi = letter.disposisi ?? [];

    const handleArsipkan = () => {
        router.patch(
            route("admin.surat-masuk.archive", { surat_masuk: letter.id }),
            {},
            { preserveScroll: true },
        );
    };

    const handleVerifikasiKades = () => {
        setVerifyLoading(true);
        router.patch(
            route("admin.surat-masuk.verifikasi-kades", {
                surat_masuk: letter.id,
            }),
            {},
            {
                preserveScroll: true,
                onFinish: () => setVerifyLoading(false),
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
                            <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge
                                    value={resolveSuratMasukAlurStatus(letter)}
                                    label={badgeLabel(
                                        SURAT_MASUK_ALUR_LABELS,
                                        resolveSuratMasukAlurStatus(letter),
                                    )}
                                />
                                {letter.tingkat && (
                                    <StatusBadge
                                        value={letter.tingkat}
                                        label={badgeLabel(
                                            TINGKAT_SURAT_LABELS,
                                            letter.tingkat,
                                        )}
                                    />
                                )}
                                {letter.diarsipkan_at && (
                                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-100">
                                        Diarsip
                                    </span>
                                )}
                            </div>
                        </div>

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
                            {letter.verified_sekdes_at && (
                                <Field
                                    label="Direview Sekdes"
                                    value={formatDateTime(
                                        letter.verified_sekdes_at,
                                    )}
                                />
                            )}
                            {letter.verified_kades_at && (
                                <Field
                                    label="Diverifikasi Kades"
                                    value={formatDateTime(
                                        letter.verified_kades_at,
                                    )}
                                />
                            )}
                        </dl>

                        <div className="mt-7 pt-5 border-t border-border flex flex-wrap items-center gap-2">
                            {letter.can_review_by_sekdes && (
                                <Button
                                    onClick={() => setOpenReview(true)}
                                    className="rounded-xl font-semibold"
                                >
                                    <ClipboardCheck className="size-4 mr-1.5" />
                                    Review Surat
                                </Button>
                            )}

                            {letter.can_verify_by_kades && (
                                <Button
                                    onClick={handleVerifikasiKades}
                                    disabled={verifyLoading}
                                    className="rounded-xl font-semibold"
                                >
                                    <ShieldCheck className="size-4 mr-1.5" />
                                    {verifyLoading
                                        ? "Memverifikasi…"
                                        : "Verifikasi Surat"}
                                </Button>
                            )}

                            {letter.can_create_disposisi && (
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
                                    {letter.diarsipkan_at ? (
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
                                    ) : (
                                        letter.can_archive && (
                                            <Button
                                                variant="outline"
                                                onClick={handleArsipkan}
                                                className="rounded-xl text-muted-foreground border-border hover:bg-muted"
                                            >
                                                <Archive className="size-4 mr-1.5" />
                                                Arsipkan
                                            </Button>
                                        )
                                    )}

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="rounded-xl"
                                    >
                                        <Link
                                            href={route(
                                                "admin.surat-masuk.edit",
                                                { surat_masuk: letter.id },
                                            )}
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
                                </>
                            )}

                            {!canManageSurat && letter.diarsipkan_at && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-xl"
                                >
                                    <Link
                                        href={route("admin.arsip-surat.show", {
                                            jenis: "masuk",
                                            id: letter.id,
                                        })}
                                    >
                                        <Archive className="size-4 mr-1.5" />
                                        Lihat di Arsip
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

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

                <aside className="surface-card p-6 md:p-8 self-start">
                    <h3 className="font-bold text-base">Riwayat Disposisi</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                        {disposisi.length} entri
                    </p>

                    {disposisi.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border p-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Belum ada disposisi.
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
                                </li>
                            ))}
                        </ol>
                    )}
                </aside>
            </div>

            {letter.can_create_disposisi && (
                <CreateDisposisiModal
                    letter={letter}
                    jabatanOptions={jabatanOptions}
                    dariJabatan={dariJabatan}
                    openDispo={openDispo}
                    setOpenDispo={setOpenDispo}
                />
            )}

            {letter.can_review_by_sekdes && (
                <ReviewSuratModal
                    letter={letter}
                    open={openReview}
                    onOpenChange={setOpenReview}
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
