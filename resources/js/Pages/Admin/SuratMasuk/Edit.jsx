import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useMemo, useState } from "react";
import { FileUpload } from "@/Components/FileUpload";
import { FilePreview } from "@/Components/FilePreview";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
    { value: "belum_diproses", label: "Belum Diproses" },
    { value: "sedang_diproses", label: "Sedang Diproses" },
    { value: "selesai", label: "Selesai" },
];

function tanggalToInput(value) {
    if (!value) return "";
    if (typeof value === "string") return value.slice(0, 10);
    return String(value).slice(0, 10);
}

export default function EditSuratMasuk({ letter }) {
    const pageErrors = usePage().props.errors ?? {};
    const [busy, setBusy] = useState(false);
    /** true = user menutup pratinjau lama dan boleh pilih file baru (boleh kosong = tetap simpan file lama). */
    const [replaceAttachment, setReplaceAttachment] = useState(
        () => !letter.file_url,
    );

    const defaults = useMemo(
        () => ({
            no_surat: letter.no_surat ?? "",
            tanggal_terima: tanggalToInput(letter.tanggal_terima),
            tanggal_surat: tanggalToInput(letter.tanggal_surat),
            pengirim: letter.pengirim ?? "",
            perihal: letter.perihal ?? "",
            catatan: letter.catatan ?? "",
            status: letter.status ?? "belum_diproses",
            tujuan: letter.tujuan ?? "-",
            file: null,
        }),
        [letter],
    );

    const { data, setData, reset } = useForm(defaults);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = route("admin.surat-masuk.update", {
            surat_masuk: letter.id,
        });
        const fields = {
            no_surat: data.no_surat,
            tanggal_terima: data.tanggal_terima,
            tanggal_surat: data.tanggal_surat || null,
            pengirim: data.pengirim,
            perihal: data.perihal,
            catatan: data.catatan,
            status: data.status,
            tujuan: data.tujuan || "-",
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
            title="Edit Surat Masuk"
            subtitle="Perbarui data surat yang sudah tercatat."
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
                            error={pageErrors.no_surat}
                        >
                            <Input
                                value={data.no_surat}
                                onChange={(e) =>
                                    setData("no_surat", e.target.value)
                                }
                                className="h-11 rounded-xl"
                            />
                        </FormField>
                        <FormField
                            label="Tanggal Surat"
                            error={pageErrors.tanggal_surat}
                        >
                            <Input
                                type="date"
                                value={data.tanggal_surat}
                                onChange={(e) =>
                                    setData("tanggal_surat", e.target.value)
                                }
                                className="h-11 rounded-xl"
                            />
                        </FormField>
                        <FormField
                            label="Tanggal Diterima"
                            required
                            error={pageErrors.tanggal_terima}
                        >
                            <Input
                                type="date"
                                value={data.tanggal_terima}
                                onChange={(e) =>
                                    setData("tanggal_terima", e.target.value)
                                }
                                className="h-11 rounded-xl"
                            />
                        </FormField>
                        <FormField
                            label="Pengirim"
                            required
                            error={pageErrors.pengirim}
                        >
                            <Input
                                value={data.pengirim}
                                onChange={(e) =>
                                    setData("pengirim", e.target.value)
                                }
                                className="h-11 rounded-xl"
                                maxLength={120}
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
                            label="Tujuan"
                            error={pageErrors.tujuan}
                            className="col-span-2"
                        >
                            <Input
                                value={data.tujuan}
                                onChange={(e) =>
                                    setData("tujuan", e.target.value)
                                }
                                className="h-11 rounded-xl"
                            />
                        </FormField>
                    </div>

                    <FormField
                        label="Catatan"
                        hint="Opsional"
                        error={pageErrors.catatan}
                    >
                        <Textarea
                            value={data.catatan}
                            onChange={(e) => setData("catatan", e.target.value)}
                            placeholder="Catatan tambahan untuk arsip…"
                            className="min-h-[100px] rounded-xl resize-none"
                            maxLength={5000}
                        />
                    </FormField>

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border">
                        <Button asChild variant="ghost" className="rounded-xl">
                            <Link
                                href={route("admin.surat-masuk.show", {
                                    surat_masuk: letter.id,
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
                        <h3 className="font-bold text-base">Lampiran</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {hasExistingFile
                                ? "Pratinjau lampiran saat ini. Tutup (✕) untuk mengganti file; jika tidak memilih file baru, lampiran lama tetap disimpan."
                                : "Unggah lampiran surat (opsional). Format: PDF, JPG, PNG."}
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
