import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { TINGKAT_SURAT_LABELS } from "@/shared/constants/badgeLabels";

export default function ReviewSuratModal({ letter, open, onOpenChange }) {
    const [tingkat, setTingkat] = useState("biasa");
    const [loading, setLoading] = useState(false);

    const submit = () => {
        setLoading(true);
        router.patch(
            route("admin.surat-masuk.review-sekdes", {
                surat_masuk: letter.id,
            }),
            { tingkat },
            {
                preserveScroll: true,
                onSuccess: () => onOpenChange(false),
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Review Surat</DialogTitle>
                    <DialogDescription>
                        Telaah surat dan tentukan apakah surat diproses oleh
                        Sekretaris Desa atau perlu diverifikasi oleh Kepala
                        Desa.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Hasil Review</Label>
                        <Select value={tingkat} onValueChange={setTingkat}>
                            <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="biasa">
                                    {TINGKAT_SURAT_LABELS.biasa}
                                </SelectItem>
                                <SelectItem value="penting">
                                    {TINGKAT_SURAT_LABELS.penting}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Diproses Sekretaris Desa: disposisi oleh Sekdes.
                            Perlu Verifikasi Kepala Desa: verifikasi Kades lalu
                            disposisi Kades.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={submit}
                        disabled={loading}
                        className="rounded-xl font-semibold"
                    >
                        <ClipboardCheck className="size-4 mr-1.5" />
                        {loading ? "Menyimpan…" : "Simpan Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
