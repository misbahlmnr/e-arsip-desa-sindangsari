// resources/js/components/FileUpload.jsx

import { Download, FileText, ImageIcon, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPT = "application/pdf,image/png,image/jpeg";
const ACCEPT_EXTENSIONS = ["application/pdf", "image/png", "image/jpeg"];

function UploadPreview({
    previewUrl,
    name,
    type,
    onRemove,
    height = "h-[360px]",
}) {
    const isImage = type?.startsWith("image/");
    const isPdf = type === "application/pdf";

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
                        {/* <p className="text-xs text-muted-foreground">
                            {formatBytes(size)}
                        </p> */}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="rounded-lg"
                    >
                        <a href={previewUrl} download={name}>
                            <Download className="size-4 mr-1.5" /> Unduh
                        </a>
                    </Button>
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
                        src={previewUrl}
                        alt={name}
                        className="w-full h-full object-contain"
                    />
                ) : isPdf ? (
                    <iframe
                        src={previewUrl}
                        title={name}
                        className="w-full h-full bg-white"
                    />
                ) : (
                    <div className="h-full grid place-items-center text-sm text-muted-foreground p-6 text-center">
                        Pratinjau tidak tersedia untuk jenis file ini. Silakan
                        unduh untuk melihat isinya.
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * @param {{
 *   value: File | null | undefined;
 *   onChange: (file: File | undefined) => void;
 *   required?: boolean;
 * }} props
 */
export function FileUpload({ value, onChange, required }) {
    const inputRef = useRef(null);
    const [drag, setDrag] = useState(false);
    const [error, setError] = useState("");

    const previewUrl = useMemo(() => {
        if (!value || !(value instanceof File)) {
            return null;
        }
        return URL.createObjectURL(value);
    }, [value]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFiles = (files) => {
        setError("");
        const file = files?.[0];
        if (!file) return;

        if (!ACCEPT_EXTENSIONS.includes(file.type)) {
            setError("Format file tidak didukung. Gunakan PDF, JPG, atau PNG.");
            return;
        }
        if (file.size > MAX_BYTES) {
            setError(
                `Ukuran file terlalu besar. Maksimal ${MAX_BYTES / 1024 / 1024} MB.`,
            );
            return;
        }

        onChange(file);
        if (inputRef.current) inputRef.current.value = "";
    };

    if (value instanceof File) {
        return (
            <UploadPreview
                previewUrl={previewUrl}
                name={value.name}
                type={value.type}
                onRemove={() => {
                    onChange(undefined);
                    if (inputRef.current) inputRef.current.value = "";
                }}
                height="h-[360px]"
            />
        );
    }

    return (
        <div>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    handleFiles(e.dataTransfer.files);
                }}
                className={`rounded-2xl border-2 border-dashed transition-colors p-8 text-center cursor-pointer ${
                    drag
                        ? "border-primary bg-primary/10"
                        : "border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/10"
                }`}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                        inputRef.current?.click();
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT}
                    className="sr-only"
                    onChange={(e) => handleFiles(e.target.files)}
                />

                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </div>

                <p className="font-semibold text-foreground">
                    Tarik file ke sini atau klik untuk memilih
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                    Format: PDF, JPG, PNG · Maksimal 5 MB{" "}
                    {required && "· Wajib"}
                </p>

                <button
                    type="button"
                    className="mt-5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-50 transition"
                    onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                    }}
                >
                    Pilih File
                </button>
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}
