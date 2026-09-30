import { Download, Eye, FileText, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 10;
const ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "jpg", "jpeg", "png"];

function formatBytes(size) {
    const bytes = Number(size);
    if (!Number.isFinite(bytes) || bytes < 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(name) {
    const parts = String(name ?? "").toLowerCase().split(".");
    return parts.length > 1 ? parts.pop() : "";
}

export function SupportingDocumentsList({ documents }) {
    const items = Array.isArray(documents) ? documents : [];
    if (items.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="font-bold text-base">Dokumen Pendukung</h3>
            <ul className="space-y-2">
                {items.map((doc) => (
                    <li
                        key={doc.id}
                        className="flex flex-wrap items-center justify-between gap-3 border border-border bg-card px-4 py-3"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <FileText className="size-5 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">
                                    {doc.original_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatBytes(doc.file_size)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="rounded-lg"
                            >
                                <a
                                    href={doc.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Eye className="size-4 mr-1.5" /> Lihat
                                </a>
                            </Button>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="rounded-lg"
                            >
                                <a
                                    href={doc.file_url}
                                    download={doc.original_name}
                                >
                                    <Download className="size-4 mr-1.5" /> Unduh
                                </a>
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/**
 * @param {{
 *   files: File[];
 *   onFilesChange: (files: File[]) => void;
 *   existing?: Array<{ id: number, original_name: string, file_size: number }>;
 *   removedIds?: number[];
 *   onRemovedIdsChange?: (ids: number[]) => void;
 *   error?: string;
 * }} props
 */
export function SupportingDocumentsField({
    files = [],
    onFilesChange,
    existing = [],
    removedIds = [],
    onRemovedIdsChange,
    error,
}) {
    const inputRef = useRef(null);
    const [drag, setDrag] = useState(false);
    const [localError, setLocalError] = useState("");

    const visibleExisting = existing.filter(
        (doc) => !removedIds.includes(doc.id),
    );
    const used = visibleExisting.length + files.length;

    const addFiles = (list) => {
        const incoming = Array.from(list ?? []);
        if (incoming.length === 0) return;

        const next = [...files];
        const messages = [];
        let room = MAX_FILES - visibleExisting.length - next.length;

        incoming.forEach((file) => {
            const ext = extensionOf(file.name);
            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                messages.push(
                    `${file.name}: format tidak didukung. Gunakan PDF, DOC, DOCX, JPG, atau PNG.`,
                );
                return;
            }
            if (file.size > MAX_BYTES) {
                messages.push(`${file.name}: ukuran maksimal 5 MB.`);
                return;
            }
            if (room <= 0) {
                messages.push("Maksimal 10 dokumen pendukung untuk satu surat.");
                return;
            }
            next.push(file);
            room -= 1;
        });

        setLocalError(messages[0] ?? "");
        onFilesChange(next);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="space-y-3">
            <div>
                <h3 className="font-bold text-base">Dokumen Pendukung</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Unggah berkas tambahan. Maksimal {MAX_FILES} file, masing-masing
                    5 MB. {used}/{MAX_FILES} terpakai.
                </p>
            </div>

            {visibleExisting.length > 0 ? (
                <ul className="space-y-2">
                    {visibleExisting.map((doc) => (
                        <li
                            key={doc.id}
                            className="flex items-center justify-between gap-3 border border-border px-3 py-2"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {doc.original_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatBytes(doc.file_size)}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Hapus ${doc.original_name}`}
                                className="text-destructive hover:text-destructive shrink-0"
                                onClick={() =>
                                    onRemovedIdsChange?.([...removedIds, doc.id])
                                }
                            >
                                <X className="size-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : null}

            {files.length > 0 ? (
                <ul className="space-y-2">
                    {files.map((file, index) => (
                        <li
                            key={`${file.name}-${file.size}-${index}`}
                            className="flex items-center justify-between gap-3 border border-border px-3 py-2"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatBytes(file.size)} · belum disimpan
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Batalkan ${file.name}`}
                                className="text-destructive hover:text-destructive shrink-0"
                                onClick={() =>
                                    onFilesChange(
                                        files.filter((_, itemIndex) => itemIndex !== index),
                                    )
                                }
                            >
                                <X className="size-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : null}

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    addFiles(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed transition-colors p-6 text-center cursor-pointer ${
                    drag
                        ? "border-primary bg-primary/10"
                        : "border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/10"
                }`}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT}
                    multiple
                    className="sr-only"
                    onChange={(e) => addFiles(e.target.files)}
                />
                <p className="font-semibold text-foreground text-sm">
                    Tarik file ke sini atau klik untuk memilih
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, DOCX, JPG, PNG · Maksimal 5 MB
                </p>
            </div>

            {localError ? (
                <p className="text-xs text-destructive font-medium">{localError}</p>
            ) : null}
            {error ? (
                <p className="text-xs text-destructive font-medium">{error}</p>
            ) : null}
        </div>
    );
}
