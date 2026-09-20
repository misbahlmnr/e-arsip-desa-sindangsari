import { Archive, FileInput, FileOutput, Send } from "lucide-react";

export default function HeroIllustration() {
    return (
        <div
            className="relative mx-auto w-full max-w-md"
            aria-hidden
        >
            <div className="absolute -left-6 -top-6 size-28 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-8 -right-4 size-36 rounded-full bg-info/10 blur-2xl" />

            <div className="relative rounded-xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                            Ringkasan arsip
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                            Administrasi surat desa
                        </p>
                    </div>
                    <span className="rounded-md bg-primary-soft px-2 py-1 text-[11px] font-semibold text-primary">
                        Digital
                    </span>
                </div>

                <ul className="space-y-2.5">
                    <IllustrationRow
                        icon={FileInput}
                        label="Surat Masuk"
                        meta="Review berjenjang"
                    />
                    <IllustrationRow
                        icon={FileOutput}
                        label="Surat Keluar"
                        meta="Tercatat rapi"
                    />
                    <IllustrationRow
                        icon={Send}
                        label="Disposisi"
                        meta="Ke Kaur / Kasi"
                    />
                    <IllustrationRow
                        icon={Archive}
                        label="Arsip Surat"
                        meta="Siap dicari"
                    />
                </ul>
            </div>

            <div className="absolute -right-3 top-16 hidden rounded-xl border border-border bg-card px-3 py-2 shadow-sm sm:flex sm:items-center sm:gap-2">
                <FileInput className="size-4 text-primary" strokeWidth={2} />
                <span className="text-xs font-medium text-foreground">
                    Arsip lebih terstruktur
                </span>
            </div>
            <div className="absolute -bottom-4 left-6 hidden rounded-xl border border-border bg-card px-3 py-2 shadow-sm sm:flex sm:items-center sm:gap-2">
                <Archive className="size-4 text-primary" strokeWidth={2} />
                <span className="text-xs font-medium text-foreground">
                    Temu kembali cepat
                </span>
            </div>
        </div>
    );
}

function IllustrationRow({ icon: Icon, label, meta }) {
    return (
        <li className="flex items-center gap-3 rounded-lg border border-border/80 bg-background px-3 py-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-4" strokeWidth={2} />
            </span>
            <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">
                    {label}
                </span>
                <span className="block text-xs text-muted-foreground">
                    {meta}
                </span>
            </span>
        </li>
    );
}
