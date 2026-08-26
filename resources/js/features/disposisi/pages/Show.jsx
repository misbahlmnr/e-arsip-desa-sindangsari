import BackLink from "@/components/BackLink";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/AppLayout";
import {
    badgeLabel,
    resolveSuratMasukAlurStatus,
    SURAT_MASUK_ALUR_LABELS,
    TINGKAT_SURAT_LABELS,
} from "@/shared/constants/badgeLabels";
import { formatTanggalKalenderWib } from "@/shared/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { FileInput } from "lucide-react";

function Field({ label, value, className }) {
    return (
        <div className={className}>
            <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {label}
            </dt>
            <dd className="text-sm font-medium text-foreground mt-1 leading-relaxed">
                {value || "—"}
            </dd>
        </div>
    );
}

export default function ShowDisposisi({ disposisi }) {
    const surat = disposisi.surat_masuk;
    const alur = surat ? resolveSuratMasukAlurStatus(surat) : null;

    return (
        <AppLayout
            title="Detail Disposisi"
            subtitle={
                surat ? `Surat ${surat.no_surat}` : "Instruksi antar pejabat"
            }
        >
            <Head title="Detail Disposisi" />

            <BackLink href={route("admin.disposisi.index")} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 surface-card p-6 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-5 border-b border-border">
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Arahan
                            </p>
                            <p className="text-lg font-semibold mt-1">
                                {disposisi.dari_jabatan}{" "}
                                <span className="text-muted-foreground font-normal">
                                    →
                                </span>{" "}
                                {disposisi.kepada}
                            </p>
                        </div>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        <Field label="Dari" value={disposisi.dari_jabatan} />
                        <Field label="Kepada" value={disposisi.kepada} />
                        <Field label="Dibuat oleh" value={disposisi.dari} />
                        <Field
                            label="Tanggal"
                            value={
                                disposisi.tanggal
                                    ? formatTanggalKalenderWib(
                                          disposisi.tanggal,
                                      )
                                    : null
                            }
                        />
                        <Field
                            label="Catatan / Arahan"
                            value={disposisi.catatan}
                            className="sm:col-span-2"
                        />
                    </dl>
                </div>

                <aside className="surface-card p-6 md:p-8 self-start">
                    <h3 className="font-semibold text-base">Surat Terkait</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                        Surat masuk yang didisposisikan
                    </p>
                    {surat ? (
                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Nomor Surat
                                </dt>
                                <dd className="font-mono font-semibold text-primary mt-1">
                                    {surat.no_surat}
                                </dd>
                            </div>
                            <Field
                                label="Pengirim Surat"
                                value={surat.pengirim}
                            />
                            <Field label="Perihal" value={surat.perihal} />
                            <div>
                                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Status Surat
                                </dt>
                                <dd className="mt-2">
                                    <StatusBadge
                                        value={alur}
                                        label={badgeLabel(
                                            SURAT_MASUK_ALUR_LABELS,
                                            alur,
                                        )}
                                    />
                                </dd>
                            </div>
                            {surat.tingkat && (
                                <div>
                                    <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Tingkat
                                    </dt>
                                    <dd className="mt-2">
                                        <StatusBadge
                                            value={surat.tingkat}
                                            label={badgeLabel(
                                                TINGKAT_SURAT_LABELS,
                                                surat.tingkat,
                                            )}
                                        />
                                    </dd>
                                </div>
                            )}
                            <Button asChild variant="outline" className="w-full mt-2">
                                <Link
                                    href={route("admin.surat-masuk.show", {
                                        surat_masuk: surat.id,
                                    })}
                                >
                                    <FileInput className="size-4 mr-1.5" />
                                    Lihat Surat
                                </Link>
                            </Button>
                        </dl>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Data surat tidak tersedia.
                        </p>
                    )}
                </aside>
            </div>
        </AppLayout>
    );
}
