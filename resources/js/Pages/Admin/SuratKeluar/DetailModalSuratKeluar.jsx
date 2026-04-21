import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { cn, formatTanggalKalenderWib } from "@/lib/utils";
import FileAttachmentPreview from "../SuratMasuk/FileAttachmentPreview";

const STATUS_CONFIG = {
    belum_diproses: {
        label: "Belum Diproses",
        className: "bg-yellow-100 text-yellow-800",
    },
    sedang_diproses: {
        label: "Sedang Diproses",
        className: "bg-blue-100 text-blue-800",
    },
    selesai: {
        label: "Selesai",
        className: "bg-green-100 text-green-800",
    },
};

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
    const status = letter?.status;
    const statusConfig = status ? STATUS_CONFIG[status] : null;

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
                    <DialogTitle>Detail Surat Masuk</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap surat masuk yang dipilih.
                    </DialogDescription>
                </DialogHeader>

                {letter ? (
                    <dl className="py-2">
                        <Row label="No. Registrasi">
                            {letter.nomor_registrasi}
                        </Row>
                        <Row label="No. Surat">{letter.no_surat}</Row>
                        <Row label="Tanggal terima">
                            {formatTanggalKalenderWib(letter.tanggal_terima)}
                        </Row>
                        <Row label="Pengirim">{letter.pengirim}</Row>
                        <Row label="Perihal">{letter.perihal}</Row>
                        <Row label="Status">
                            <span
                                className={cn(
                                    "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                                    statusConfig?.className ||
                                        "bg-gray-100 text-gray-800",
                                )}
                            >
                                {statusConfig?.label ?? status ?? "—"}
                            </span>
                        </Row>
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
