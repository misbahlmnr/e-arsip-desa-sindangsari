import { FilePreview } from "@/components/FilePreview";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/AppLayout";
import { cn } from "@/shared/lib/utils";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useMemo, useState } from "react";

const STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "terkirim", label: "Terkirim" },
];

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
            status: letter.status ?? "draft",
            file: null,
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
            status: data.status,
        };

        const finish = {
            preserveScroll: true,
            onStart: () => setBusy(true),
            onFinish: () => setBusy(false),
        };

        if (data.file instanceof File) {
            router.post(
                url,
                { ...fields, _method: "put", file: data.file },
                { forceFormData: true, ...finish },
            );
            return;
        }

        router.put(url, fields, {
            ...finish,
            onSuccess: () => {
                reset({ ...fields, file: null });
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

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                noValidate
            >
                <div className="lg:col-span-2 surface-card p-6 md:p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                            label="Status"
                            required
                            error={pageErrors.status}
                        >
                            <Select
                                value={data.status}
                                onValueChange={(v) => setData("status", v)}
                            >
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
