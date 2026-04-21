import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { formatTanggalKalenderWib } from "@/lib/utils";
import FileAttachmentPreview from "../SuratMasuk/FileAttachmentPreview";

function Row({ label, children }) {
    return (
        <div className="grid gap-1 py-2 sm:grid-cols-[140px_1fr] sm:gap-4 sm:items-start border-b border-border/60 last:border-0">
            <dt className="text-sm font-medium text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm text-foreground break-words">{children}</dd>
        </div>
    );
}

const DetailModalSuratMasuk = (props) => {
    const { letter, onClose } = props;
    const open = Boolean(letter);

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Surat Keluar</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap surat keluar yang dipilih.
                    </DialogDescription>
                </DialogHeader>

                {letter ? (
                    <dl className="py-2">
                        <Row label="No. Registrasi">
                            {letter.nomor_registrasi}
                        </Row>
                        <Row label="No. Surat">{letter.no_surat}</Row>
                        <Row label="Tanggal kirim">
                            {formatTanggalKalenderWib(letter.tanggal_kirim)}
                        </Row>
                        <Row label="Perihal">{letter.perihal}</Row>
                        <Row label="Tujuan">{letter.tujuan || "—"}</Row>
                        <Row label="Lampiran">
                            {letter.file_url ? (
                                <div className="space-y-2">
                                    <FileAttachmentPreview
                                        url={letter.file_url}
                                    />
                                </div>
                            ) : (
                                "—"
                            )}
                        </Row>
                    </dl>
                ) : null}

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DetailModalSuratMasuk;
