import { Button } from "@/Components/ui/button";
import { Download, FileText, Image as ImageIcon, X } from "lucide-react";

function formatBytes(bytes) {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Normalise berbagai bentuk prop `file` menjadi { src, name, isImage, isPdf, size }
 */
function normaliseFile(file) {
    // Kalau cuma string: URL absolut/relatif ke storage (bukan path DB mentah)
    if (typeof file === "string") {
        const name = file.split("/").pop().split("?")[0] || "file";
        const ext = name.split(".").pop().toLowerCase();
        return {
            src: file,
            name,
            isImage: ["jpg", "jpeg", "png", "gif", "webp"].includes(ext),
            isPdf: ext === "pdf",
            size: null,
        };
    }

    // Object dari Inertia: file_url, url, dataUrl, dll.
    const src =
        file.file_url ??
        file.dataUrl ??
        file.url ??
        file.src ??
        "";
    const name = file.name || src.split("/").pop().split("?")[0] || "file";

    let isImage = false;
    let isPdf = false;

    if (file.type) {
        isImage = file.type.startsWith("image/");
        isPdf = file.type === "application/pdf";
    } else {
        // deteksi dari ekstensi / dataUrl prefix
        const ext = name.split(".").pop().toLowerCase();
        isImage =
            ["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ||
            src.startsWith("data:image");
        isPdf = ext === "pdf" || src.startsWith("data:application/pdf");
    }

    return { src, name, isImage, isPdf, size: file.size ?? null };
}

export function FilePreview({ file, onRemove, height = "h-[420px]" }) {
    const { src, name, isImage, isPdf, size } = normaliseFile(file);

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3 min-w-0">
                    {isImage ? (
                        <ImageIcon className="size-5 text-muted-foreground shrink-0" />
                    ) : (
                        <FileText className="size-5 text-muted-foreground shrink-0" />
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{name}</p>
                        {size && (
                            <p className="text-xs text-muted-foreground">
                                {formatBytes(size)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {src && (
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="rounded-lg"
                        >
                            <a
                                href={src}
                                download={name}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Download className="size-4 mr-1.5" />
                                Unduh
                            </a>
                        </Button>
                    )}
                    {onRemove && (
                        <Button
                            onClick={onRemove}
                            variant="ghost"
                            size="icon"
                            aria-label="Hapus file"
                            className="text-destructive hover:text-destructive"
                        >
                            <X className="size-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className={`bg-muted/30 ${height} overflow-auto`}>
                {isImage ? (
                    <img
                        src={src}
                        alt={name}
                        className="w-full h-full object-contain"
                    />
                ) : isPdf ? (
                    <iframe
                        src={src}
                        title={name}
                        className="w-full h-full bg-white"
                    />
                ) : (
                    <div className="h-full grid place-items-center text-sm text-muted-foreground p-6 text-center">
                        Pratinjau tidak tersedia untuk jenis file ini.{" "}
                        <a
                            href={src}
                            download={name}
                            className="underline text-foreground font-medium ml-1"
                        >
                            Unduh untuk melihat isinya.
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
