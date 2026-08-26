import BackLink from "@/components/BackLink";
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
import { Head, Link, useForm } from "@inertiajs/react";
import { Send } from "lucide-react";

function FormField({ label, required, error, children }) {
    return (
        <div className="space-y-1.5">
            <Label>
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
            </Label>
            {children}
            {error && (
                <p className="text-xs text-destructive font-medium">{error}</p>
            )}
        </div>
    );
}

export default function CreateDisposisi({
    suratOptions,
    jabatanOptions,
    dariJabatan,
    selectedSuratMasukId,
}) {
    const { data, setData, post, processing, errors } = useForm({
        surat_masuk_id: selectedSuratMasukId
            ? String(selectedSuratMasukId)
            : "",
        jabatan_tujuan_id: jabatanOptions[0]
            ? String(jabatanOptions[0].id)
            : "",
        catatan: "",
        tanggal: new Date().toISOString().slice(0, 10),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.disposisi.store"));
    };

    return (
        <AppLayout
            title="Buat Disposisi"
            subtitle="Teruskan surat masuk kepada jabatan terkait beserta arahan."
        >
            <Head title="Buat Disposisi" />

            <BackLink href={route("admin.disposisi.index")} />

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                noValidate
            >
                <div className="lg:col-span-2 surface-card p-6 md:p-8 space-y-5">
                    <FormField
                        label="Pilih Surat"
                        required
                        error={errors.surat_masuk_id}
                    >
                        <Select
                            value={data.surat_masuk_id}
                            onValueChange={(v) => setData("surat_masuk_id", v)}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Pilih surat masuk…" />
                            </SelectTrigger>
                            <SelectContent>
                                {suratOptions.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="Dari">
                            <Input
                                value={dariJabatan ?? "—"}
                                readOnly
                                className="h-11 bg-muted"
                            />
                        </FormField>

                        <FormField
                            label="Kepada"
                            required
                            error={errors.jabatan_tujuan_id}
                        >
                            <Select
                                value={data.jabatan_tujuan_id}
                                onValueChange={(v) =>
                                    setData("jabatan_tujuan_id", v)
                                }
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {jabatanOptions.map((j) => (
                                        <SelectItem
                                            key={j.id}
                                            value={String(j.id)}
                                        >
                                            {j.nama_jabatan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                    </div>

                    <FormField label="Tanggal" required error={errors.tanggal}>
                        <Input
                            type="date"
                            value={data.tanggal}
                            onChange={(e) => setData("tanggal", e.target.value)}
                            className="h-11"
                        />
                    </FormField>

                    <FormField
                        label="Catatan / Arahan"
                        required
                        error={errors.catatan}
                    >
                        <Textarea
                            value={data.catatan}
                            onChange={(e) => setData("catatan", e.target.value)}
                            placeholder="Tuliskan arahan atau instruksi…"
                            className="min-h-[120px] resize-none"
                            maxLength={500}
                        />
                    </FormField>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <Button asChild variant="ghost">
                            <Link href={route("admin.disposisi.index")}>
                                Batal
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                processing ||
                                !data.surat_masuk_id ||
                                !data.jabatan_tujuan_id
                            }
                            className="h-11 px-6 font-semibold"
                        >
                            <Send className="size-4 mr-1.5" />
                            {processing ? "Mengirim…" : "Kirim Disposisi"}
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-1 surface-card p-6 md:p-8 space-y-4 self-start">
                    <h3 className="font-semibold text-base">Petunjuk</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Hanya surat yang sudah direview dan belum diarsip yang
                        dapat didisposisikan. Setelah surat diarsipkan,
                        disposisi tidak lagi tampil di menu ini.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Surat biasa didisposisi oleh Sekretaris Desa. Surat
                        penting didisposisi oleh Kepala Desa setelah
                        verifikasi.
                    </p>
                </div>
            </form>
        </AppLayout>
    );
}
