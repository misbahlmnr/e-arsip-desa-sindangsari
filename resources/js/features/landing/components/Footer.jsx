import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-card">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                    <BrandLogo className="size-12 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold leading-none text-foreground">
                            E-Arsip
                        </p>
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            Desa Sindangsari
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            Sistem Arsip Surat Desa Sindangsari
                        </p>
                    </div>
                </div>

                <address className="not-italic text-sm leading-relaxed text-muted-foreground">
                    <p className="font-medium text-foreground">Alamat</p>
                    <p className="mt-2">Kantor Desa Sindangsari</p>
                    <p>Kecamatan Cimerak</p>
                    <p>Kabupaten Pangandaran</p>
                </address>
            </div>
            <div className="border-t border-border">
                <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
                    © {year} Kantor Desa Sindangsari — Kecamatan Cimerak,
                    Kabupaten Pangandaran
                </p>
            </div>
        </footer>
    );
}
