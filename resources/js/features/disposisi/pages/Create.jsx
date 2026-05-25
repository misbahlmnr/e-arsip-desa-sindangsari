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
import { ArrowLeft, Send } from "lucide-react";

function FormField({ label, required, error, children }) {
    return (
        <div className="space-y-1.5">
            <Label>
                {label}
                {required && (
                    <span className="text-destructive ml-0.5">*</span>
                )}
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
    tujuanOptions,
    selectedSuratMasukId,
}) {
    const { data, setData, post, processing, errors } = useForm({
        surat_masuk_id: selectedSuratMasukId
            ? String(selectedSuratMasukId)
            : "",
        kepada: "Kepala Desa",
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
            subtitle="Teruskan surat masuk kepada pejabat terkait beserta arahan."
        >
            <Head title="Buat Disposisi" />

            <div className="mb-6">
                <Button
                    variant="ghost"
                    asChild
                    className="rounded-xl -ml-2 text-muted-foreground"
                >
                    <Link href={route("admin.disposisi.index")}>
                        <ArrowLeft className="size-4 mr-1.5" />
                        Kembali ke daftar
                    </Link>
                </Button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="max-w-2xl surface-card p-6 md:p-8 space-y-5"
                noValidate
            >
                <FormField
                    label="Pilih Surat"
                    required
                    error={errors.surat_masuk_id}
                >
                    <Select
                        value={data.surat_masuk_id}
                        onValueChange={(v) => setData("surat_masuk_id", v)}
                    >
                        <SelectTrigger className="h-11 rounded-xl">
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

                <FormField label="Tujuan" required error={errors.kepada}>
                    <Select
                        value={data.kepada}
                        onValueChange={(v) => setData("kepada", v)}
                    >
                        <SelectTrigger className="h-11 rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {tujuanOptions.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {t}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>

                <FormField label="Tanggal" required error={errors.tanggal}>
                    <Input
                        type="date"
                        value={data.tanggal}
                        onChange={(e) => setData("tanggal", e.target.value)}
                        className="h-11 rounded-xl"
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
                        className="min-h-[120px] rounded-xl resize-none"
                        maxLength={500}
                    />
                </FormField>

                <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                        type="submit"
                        disabled={processing || !data.surat_masuk_id}
                        className="rounded-xl font-semibold"
                    >
                        <Send className="size-4 mr-1.5" />
                        {processing ? "Mengirim…" : "Kirim Disposisi"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        asChild
                        className="rounded-xl"
                    >
                        <Link href={route("admin.disposisi.index")}>Batal</Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
