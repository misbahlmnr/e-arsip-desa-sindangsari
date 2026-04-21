import { useMemo, useState } from "react";
import { Download, FileText, Maximize2 } from "lucide-react";

import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { cn } from "@/lib/utils";

function extensionFromUrl(url) {
    try {
        const pathname = new URL(url, window.location.href).pathname;
        const part = pathname.split(".").pop();
        return typeof part === "string" ? part.toLowerCase() : "";
    } catch {
        return "";
    }
}

/**
 * Pratinjau lampiran: PDF ditampilkan di iframe pendek; tombol membuka dialog layar hampir penuh.
 * Word (.doc/.docx) tidak dipratinjau di browser — ditampilkan pesan + tautan unduh/tab baru.
 *
 * @param {{ url?: string | null; className?: string }} props
 */
export default function FileAttachmentPreview({ url, className }) {
    const [fullscreenOpen, setFullscreenOpen] = useState(false);

    const ext = useMemo(() => (url ? extensionFromUrl(url) : ""), [url]);
    const isPdf = ext === "pdf";
    const isOffice = ext === "doc" || ext === "docx";

    if (!url) {
        return null;
    }

    return (
        <div className={cn("space-y-2", className)}>
            <div className="overflow-hidden rounded-lg border bg-muted/30 shadow-sm">
                {isPdf ? (
                    <button
                        type="button"
                        className="group relative block h-[200px] w-full overflow-hidden border-0 bg-transparent p-0 text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => setFullscreenOpen(true)}
                        aria-label="Buka pratinjau layar penuh"
                    >
                        <iframe
                            title="Pratinjau PDF"
                            src={`${url}#navpanes=0`}
                            className="pointer-events-none h-full w-full border-0 bg-white"
                        />
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-background from-40% via-background/70 to-transparent px-3 pb-2 pt-10 text-center text-xs font-medium text-foreground">
                            Klik untuk layar penuh
                        </span>
                    </button>
                ) : isOffice ? (
                    <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 px-4 py-6 text-center">
                        <FileText
                            className="h-10 w-10 text-muted-foreground"
                            aria-hidden
                        />
                        <p className="text-sm text-muted-foreground max-w-xs">
                            File Word tidak bisa dipratinjau di browser. Unduh
                            atau buka di tab baru untuk melihat isinya.
                        </p>
                    </div>
                ) : (
                    <div className="flex min-h-[100px] items-center justify-center px-4 py-6 text-sm text-muted-foreground">
                        Pratinjau tidak tersedia untuk jenis file ini.
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-2 border-t bg-background/95 px-2 py-2">
                    {isPdf ? (
                        <Button
                            type="button"
                            size="sm"
                            variant="default"
                            onClick={() => setFullscreenOpen(true)}
                        >
                            <Maximize2 className="mr-1.5 h-4 w-4" />
                            Layar penuh
                        </Button>
                    ) : null}
                    <Button type="button" size="sm" variant="outline" asChild>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Download className="mr-1.5 h-4 w-4" />
                            Buka / unduh
                        </a>
                    </Button>
                </div>
            </div>

            <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
                <DialogContent
                    className={cn(
                        "z-[100] flex h-[92vh] max-h-[92vh] w-[min(100vw,1200px)] max-w-[96vw] flex-col gap-0 overflow-hidden p-0",
                        "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
                        "sm:max-w-[96vw]",
                    )}
                >
                    <DialogHeader className="shrink-0 space-y-0 border-b px-4 py-3 text-left">
                        <DialogTitle className="text-base">
                            Pratinjau lampiran
                        </DialogTitle>
                    </DialogHeader>
                    {isPdf ? (
                        <iframe
                            title="Pratinjau PDF layar penuh"
                            src={url}
                            className="min-h-0 flex-1 w-full border-0 bg-white"
                        />
                    ) : (
                        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
                            Pratinjau tidak tersedia.
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
