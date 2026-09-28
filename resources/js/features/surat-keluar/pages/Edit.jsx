import { FilePreview } from "@/components/FilePreview";
import { FileUpload } from "@/components/FileUpload";
import { SupportingDocumentsField } from "@/components/SupportingDocumentsField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/AppLayout";
import { cn } from "@/shared/lib/utils";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Lock, Save } from "lucide-react";
import { useMemo, useState } from "react";
import BackLink from "@/components/BackLink";

function tanggalToInput(value) {
    if (!value) return "";
    if (typeof value === "string") return value.slice(0, 10);
    return String(value).slice(0, 10);
}

export default function EditSuratKeluar({ letter }) {
    const pageErrors = usePage().props.errors ?? {};
    const [busy, setBusy] = useState(false);
    const [replaceAttachment, setReplaceAttachment] = useState(
        () => !letter.file_url,
    );

    const defaults = useMemo(
        () => ({
            nomor_surat: letter.no_surat ?? "",
            tanggal_kirim: tanggalToInput(letter.tanggal_kirim),
            tujuan: letter.tujuan ?? "",
            perihal: letter.perihal ?? "",
            catatan: letter.catatan ?? "",
            file: null,
            supporting_files: [],
            remove_supporting_ids: [],
        }),
        [letter],
    );

    const { data, setData, reset } = useForm(defaults);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = route("admin.surat-keluar.update", {
            surat_keluar: letter.id,
        });

        const fields = {
            nomor_surat: data.nomor_surat,
            tanggal_kirim: data.tanggal_kirim,
            tujuan: data.tujuan,
            perihal: data.perihal,
            catatan: data.catatan,
        };

        const finish = {
            preserveScroll: true,
            onStart: () => setBusy(true),
            onFinish: () => setBusy(false),
        };

        const supportingFiles = Array.isArray(data.supporting_files)
            ? data.supporting_files
            : [];
        const removeIds = Array.isArray(data.remove_supporting_ids)
            ? data.remove_supporting_ids
            : [];
        const hasSupportingChange =
            supportingFiles.length > 0 || removeIds.length > 0;

        if (data.file instanceof File || hasSupportingChange) {
            router.post(
                url,
                {
                    ...fields,
                    _method: "put",
                    ...(data.file instanceof File ? { file: data.file } : {}),
                    ...(supportingFiles.length > 0
                        ? { supporting_files: supportingFiles }
                        : {}),
                    remove_supporting_ids: removeIds,
                },
                { forceFormData: true, ...finish },
            );
            return;
        }

        router.put(url, fields, {
            ...finish,
            onSuccess: () => {
                reset({
                    ...fields,
                    file: null,
                    supporting_files: [],
                    remove_supporting_ids: [],
                });
            },
        });
    };

    const hasExistingFile = Boolean(letter.file_url);
    const hasNewFile = data.file instanceof File;
    const showExistingPreview =
        hasExistingFile && !replaceAttachment && !hasNewFile;
    const showUploader = !hasExistingFile || replaceAttachment || hasNewFile;

    return (
        <AppLayout
            title="Edit Surat Keluar"
            subtitle="Perbarui data surat keluar yang sudah tercatat."
        >
            <Head title={`Edit — ${letter.no_surat}`} />

            <BackLink href={route("admin.surat-keluar.index")} />

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                noValidate
            >
                <div className="lg:col-span-2 surface-card p-6 md:p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="Nomor Agenda">
                            <div className="relative">
                                <Input
                                    value={letter.nomor_agenda ?? ""}
                                    readOnly
                                    tabIndex={-1}
                                    onMouseDown={(e) => e.preventDefault()}
                                    className="h-11 rounded-xl cursor-not-allowed border-muted-foreground/30 bg-muted pr-10 text-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                        </FormField>
                        <FormField
                            label="Nomor Surat"
                            required
                            error={pageErrors.no_surat ?? pageErrors.nomor_surat}
                        >
                            <Input
                                value={data.nomor_surat}
                                onChange={(e) =>
                                    setData("nomor_surat", e.target.value)
                                }
                                className="h-11 rounded-xl"
                            />
                        </FormField>

                        <FormField
                            label="Tujuan"
                            required
                            error={pageErrors.tujuan}
                        >
                            <Input
                                value={data.tujuan}
                                onChange={(e) =>
                                    setData("tujuan", e.target.value)
                                }
                                className="h-11 rounded-xl"
                                maxLength={120}
                            />
                        </FormField>

                        <FormField
                            label="Tanggal Kirim"
                            required
                            error={pageErrors.tanggal_kirim}
                        >
                            <Input
                                type="date"
                                value={data.tanggal_kirim}
                                onChange={(e) =>
                                    setData("tanggal_kirim", e.target.value)
                                }
                                className="h-11 rounded-xl"
                            />
                        </FormField>

                        <FormField
                            label="Perihal"
                            required
                            error={pageErrors.perihal}
                        >
                            <Input
                                value={data.perihal}
                                onChange={(e) =>
                                    setData("perihal", e.target.value)
                                }
                                className="h-11 rounded-xl"
                                maxLength={250}
                            />
                        </FormField>

                        <FormField
                            label="Catatan"
                            hint="Opsional"
                            error={pageErrors.catatan}
                            className="col-span-2"
                        >
                            <Textarea
                                value={data.catatan}
                                onChange={(e) =>
                                    setData("catatan", e.target.value)
                                }
                                placeholder="Catatan tambahan untuk arsip…"
                                className="min-h-[120px] rounded-xl resize-none"
                                maxLength={5000}
                            />
                        </FormField>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border">
                        <Button asChild variant="ghost" className="rounded-xl">
                            <Link
                                href={route("admin.surat-keluar.show", {
                                    surat_keluar: letter.id,
                                })}
                            >
                                Batal
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={busy}
                            className="rounded-xl h-11 px-6 font-semibold"
                        >
                            <Save className="size-4 mr-1.5" />
                            {busy ? "Menyimpan…" : "Simpan Perubahan"}
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-1 surface-card p-6 md:p-8 space-y-4">
                    <div>
                        <h3 className="font-bold text-base">Lampiran Surat</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {hasExistingFile
                                ? "Pratinjau lampiran saat ini. Tutup (✕) untuk mengganti file; jika tidak memilih file baru, lampiran lama tetap disimpan."
                                : "Unggah lampiran surat (opsional). Format: PDF, DOC, DOCX."}
                        </p>
                    </div>

                    {showExistingPreview ? (
                        <div className="space-y-3">
                            <FilePreview
                                file={letter.file_url}
                                onRemove={() => {
                                    setReplaceAttachment(true);
                                    setData("file", null);
                                }}
                            />
                        </div>
                    ) : null}

                    {showUploader ? (
                        <div className="space-y-2">
                            {hasExistingFile &&
                            replaceAttachment &&
                            !hasNewFile ? (
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl"
                                        onClick={() => {
                                            setReplaceAttachment(false);
                                            setData("file", null);
                                        }}
                                    >
                                        Batal ganti — kembalikan pratinjau
                                    </Button>
                                </div>
                            ) : null}

                            <FileUpload
                                value={hasNewFile ? data.file : null}
                                onChange={(f) => setData("file", f ?? null)}
                            />
                            {pageErrors.file ? (
                                <p className="text-xs text-destructive font-medium">
                                    {pageErrors.file}
                                </p>
                            ) : null}
                        </div>
                    ) : null}

                    <div className="border-t border-border pt-4">
                        <SupportingDocumentsField
                            files={data.supporting_files}
                            onFilesChange={(files) =>
                                setData("supporting_files", files)
                            }
                            existing={letter.supporting_documents ?? []}
                            removedIds={data.remove_supporting_ids}
                            onRemovedIdsChange={(ids) =>
                                setData("remove_supporting_ids", ids)
                            }
                            error={
                                pageErrors.supporting_files ||
                                pageErrors.remove_supporting_ids
                            }
                        />
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}

function FormField({ label, required, hint, error, children, className }) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <Label className="flex items-center gap-1.5">
                {label}
                {required && <span className="text-destructive">*</span>}
                {hint ? (
                    <span className="text-xs text-muted-foreground font-normal">
                        ({hint})
                    </span>
                ) : null}
            </Label>
            {children}
            {error ? (
                <p className="text-xs text-destructive font-medium">{error}</p>
            ) : null}
        </div>
    );
}
