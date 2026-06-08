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
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { router } from "@inertiajs/react";

const CreateDisposisiModal = ({
    letter,
    jabatanOptions = [],
    dariJabatan,
    openDispo,
    setOpenDispo,
}) => {
    const [jabatanId, setJabatanId] = useState(
        jabatanOptions[0] ? String(jabatanOptions[0].id) : "",
    );
    const [dispoNote, setDispoNote] = useState("");
    const [dispoLoading, setDispoLoading] = useState(false);

    const submitDispo = () => {
        if (!dispoNote.trim() || !jabatanId) return;
        setDispoLoading(true);
        router.post(
            route("admin.surat-masuk.disposisi.store", {
                surat_masuk: letter.id,
            }),
            {
                jabatan_tujuan_id: Number(jabatanId),
                catatan: dispoNote.trim(),
            },
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
                        Teruskan surat ini kepada jabatan terkait beserta
                        arahan.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Dari</Label>
                        <Input
                            value={dariJabatan ?? "—"}
                            readOnly
                            className="h-11 rounded-xl bg-muted"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Kepada</Label>
                        <Select value={jabatanId} onValueChange={setJabatanId}>
                            <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue placeholder="Pilih jabatan" />
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
                        disabled={
                            !dispoNote.trim() || !jabatanId || dispoLoading
                        }
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
