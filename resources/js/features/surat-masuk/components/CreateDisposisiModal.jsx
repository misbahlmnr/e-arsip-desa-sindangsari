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
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";
import { router } from "@inertiajs/react";

const CreateDisposisiModal = ({ letter, openDispo, setOpenDispo }) => {
    const [dispoTo, setDispoTo] = useState("Kepala Desa");
    const [dispoNote, setDispoNote] = useState("");
    const [dispoLoading, setDispoLoading] = useState(false);

    const submitDispo = () => {
        if (!dispoNote.trim()) return;
        setDispoLoading(true);
        router.post(
            route("admin.surat-masuk.disposisi.store", {
                surat_masuk: letter.id,
            }),
            { kepada: dispoTo, catatan: dispoNote.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenDispo(false);
                    setDispoNote("");
                },
                onFinish: () => setDispoLoading(false),
            },
        );
    };

    return (
        <Dialog open={openDispo} onOpenChange={setOpenDispo}>
            <DialogContent className="rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Buat Disposisi</DialogTitle>
                    <DialogDescription>
                        Teruskan surat ini kepada pejabat yang berwenang beserta
                        arahan.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Tujuan</Label>
                        <Select value={dispoTo} onValueChange={setDispoTo}>
                            <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Kepala Desa">
                                    Kepala Desa
                                </SelectItem>
                                <SelectItem value="Sekretaris Desa">
                                    Sekretaris Desa
                                </SelectItem>
                                <SelectItem value="Kaur Pemerintahan">
                                    Kaur Pemerintahan
                                </SelectItem>
                                <SelectItem value="Kaur Keuangan">
                                    Kaur Keuangan
                                </SelectItem>
                                <SelectItem value="Kaur Umum">
                                    Kaur Umum
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Catatan / Arahan</Label>
                        <Textarea
                            value={dispoNote}
                            onChange={(e) => setDispoNote(e.target.value)}
                            placeholder="Tuliskan arahan atau instruksi…"
                            className="min-h-[100px] rounded-xl resize-none"
                            maxLength={500}
                        />
                        {!dispoNote.trim() && dispoLoading === false && (
                            <p className="text-xs text-muted-foreground">
                                Catatan wajib diisi.
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setOpenDispo(false)}
                        className="rounded-xl"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={submitDispo}
                        disabled={!dispoNote.trim() || dispoLoading}
                        className="rounded-xl font-semibold"
                    >
                        <Send className="size-4 mr-1.5" />
                        {dispoLoading ? "Mengirim…" : "Kirim Disposisi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateDisposisiModal;
