import { FileUpload } from "@/Components/FileUpload";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import AppLayout from "@/Layouts/AppLayout";
import { cn } from "@/lib/utils";
import { Head, Link, useForm } from "@inertiajs/react";
import { Save } from "lucide-react";

export default function CreateSuratKeluar() {
    const { data, setData, post, processing, errors } = useForm({
        nomor_surat: "",
        tanggal_kirim: new Date().toISOString().slice(0, 10),
        tujuan: "",
        perihal: "",
        catatan: "",
        status: "draft",
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.surat-keluar.store"), { forceFormData: true });
    };

    return (
        <AppLayout
            title="Tambah Surat Keluar"
            subtitle="Catat surat baru yang dikirim oleh kantor desa."
        >
            <Head title="Tambah Surat Keluar" />

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                noValidate
            >
                <div className="lg:col-span-2 surface-card p-6 md:p-8 space-y-5 flex flex-col justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                            label="Nomor Surat"
                            required
                            error={errors.nomor_surat}
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
                            label="Tujuan"
                            required
                            error={errors.tujuan}
                        >
                            <Input
                                value={data.tujuan}
                                onChange={(e) =>
                                    setData("tujuan", e.target.value)
                                }
                                placeholder="Nama instansi atau penerima"
                                className="h-11 rounded-xl"
                                maxLength={120}
                            />
                        </FormField>
                        <FormField
                            label="Tanggal Kirim"
                            required
                            error={errors.tanggal_kirim}
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
                        <FormField
                            label="Status"
                            required
                            error={errors.status}
                        >
                            <Select
                                value={data.status}
                                onValueChange={(v) => setData("status", v)}
                            >
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="terkirim">
                                        Terkirim
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField
                            label="Catatan"
                            hint="Opsional"
                            error={errors.catatan}
                            className="col-span-2"
                        >
                            <Textarea
                                value={data.catatan}
                                onChange={(e) =>
                                    setData("catatan", e.target.value)
                                }
                                placeholder="Catatan tambahan..."
                                className="min-h-[120px] rounded-xl resize-none"
                                maxLength={250}
                            />
                        </FormField>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <Button asChild variant="ghost" className="rounded-xl">
                            <Link href={route("admin.surat-keluar.index")}>
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
