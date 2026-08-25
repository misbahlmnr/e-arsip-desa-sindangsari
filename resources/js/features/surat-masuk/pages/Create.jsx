import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Save } from "lucide-react";

export default function CreateSuratMasuk() {
    const { data, setData, post, processing, errors } = useForm({
        nomor_surat: "",
        tanggal_surat: new Date().toISOString().slice(0, 10),
        tanggal_diterima: new Date().toISOString().slice(0, 10),
        pengirim: "",
        perihal: "",
        tujuan: "-",
        catatan: "",
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.surat-masuk.store"), { forceFormData: true });
    };

    return (
        <AppLayout
            title="Tambah Surat Masuk"
            subtitle="Catat surat baru yang diterima oleh kantor desa."
        >
            <Head title="Tambah Surat Masuk" />

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
                            error={errors.no_surat ?? errors.nomor_surat}
                        >
                            <Input
                                value={data.nomor_surat}
                                onChange={(e) =>
                                    setData("nomor_surat", e.target.value)
                                }
                                placeholder="Contoh: 474.1/22/V/2024"
                                className="h-11 rounded-xl"
                            />
                        </FormField>

                        <FormField
                            label="Tanggal Surat"
                            required
                            error={errors.tanggal_surat}
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
                            error={errors.tanggal_terima}
                        >
                            <Input
                                type="date"
                                value={data.tanggal_diterima}
                                onChange={(e) =>
                                    setData("tanggal_diterima", e.target.value)
                                }
                                className="h-11 rounded-xl"
                            />
                        </FormField>

                        <FormField
                            label="Pengirim"
                            required
                            error={errors.pengirim}
                        >
                            <Input
                                value={data.pengirim}
                                onChange={(e) =>
                                    setData("pengirim", e.target.value)
                                }
                                placeholder="Nama instansi atau perorangan"
                                className="h-11 rounded-xl"
                                maxLength={120}
                            />
                        </FormField>

                        <FormField
                            label="Perihal"
                            required
                            error={errors.perihal}
                        >
                            <Input
                                value={data.perihal}
                                onChange={(e) =>
                                    setData("perihal", e.target.value)
                                }
                                placeholder="Ringkasan isi atau maksud surat"
                                className="h-11 rounded-xl"
                                maxLength={250}
                            />
                        </FormField>

                        <FormField label="Tujuan">
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
                        error={errors.catatan}
                    >
                        <Textarea
                            value={data.catatan}
                            onChange={(e) => setData("catatan", e.target.value)}
                            placeholder="Catatan tambahan untuk arsip…"
                            className="min-h-[120px] rounded-xl resize-none"
                            maxLength={5000}
                        />
                    </FormField>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <Button asChild variant="ghost" className="rounded-xl">
                            <Link href={route("admin.surat-masuk.index")}>
                                Batal
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl h-11 px-6 font-semibold"
                        >
                            <Save className="size-4 mr-1.5" />
                            {processing ? "Menyimpan…" : "Simpan Surat"}
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-1 surface-card p-6 md:p-8 space-y-4">
                    <h3 className="font-bold text-base">Lampiran Surat</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                        Unggah hasil scan atau file digital surat (opsional).
                    </p>
                    <FileUpload
                        value={data.file}
                        onChange={(f) => setData("file", f ?? null)}
                    />
                    {errors.file ? (
                        <p className="text-xs text-destructive font-medium mt-2">
                            {errors.file}
                        </p>
                    ) : null}
                </div>
            </form>
        </AppLayout>
    );
}

function FormField({ label, required, hint, error, children }) {
    return (
        <div className="space-y-1.5">
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
