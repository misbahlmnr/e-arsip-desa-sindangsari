import { Button } from "@/components/ui/button";
import { Eye, FileText, X } from "lucide-react";
import { useRef } from "react";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 10;
const ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png";

function formatBytes(size) {
    const bytes = Number(size);
    if (!Number.isFinite(bytes) || bytes < 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
                        className="flex flex-wrap items-center justify-between gap-3 surface-card px-4 py-3"
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
                        {doc.file_url ? (
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="rounded-xl"
                            >
                                <a
                                    href={doc.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Eye className="size-4 mr-1.5" /> Lihat
                                </a>
                            </Button>
                        ) : null}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function SupportingDocumentsField({
    documents = [],
    files = [],
    onFilesChange,
    removeIds = [],
    onRemoveIdsChange,
    error,
}) {
    const inputRef = useRef(null);
    const existing = Array.isArray(documents) ? documents : [];
    const kept = existing.filter((doc) => !removeIds.includes(doc.id));
    const remaining = MAX_FILES - kept.length - files.length;

    const addFiles = (list) => {
        const next = [...files];
        for (const file of list) {
            if (next.length + kept.length >= MAX_FILES) break;
            if (file.size > MAX_BYTES) continue;
            next.push(file);
        }
        onFilesChange(next);
    };

    return (
        <div className="space-y-3">
            <div>
                <h3 className="font-bold text-base">Dokumen Pendukung</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Opsional, maksimal 10 file. PDF, DOC, DOCX, JPG, atau PNG,
                    masing-masing 5 MB.
                </p>
            </div>
            {kept.length > 0 ? (
                <ul className="space-y-2">
                    {kept.map((doc) => (
                        <li
                            key={doc.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
                        >
                            <span className="text-sm truncate">
                                {doc.original_name}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-lg shrink-0"
                                onClick={() =>
                                    onRemoveIdsChange([...removeIds, doc.id])
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
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
                        >
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-lg shrink-0"
                                onClick={() =>
                                    onFilesChange(
                                        files.filter((_, i) => i !== index),
                                    )
                                }
                            >
                                <X className="size-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : null}
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                multiple
                className="hidden"
                onChange={(e) => {
                    addFiles(Array.from(e.target.files ?? []));
                    e.target.value = "";
                }}
            />
            <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                disabled={remaining <= 0}
                onClick={() => inputRef.current?.click()}
            >
                Tambah dokumen
            </Button>
            {error ? (
                <p className="text-xs text-destructive font-medium">{error}</p>
            ) : null}
        </div>
    );
}
