import { FileText } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
            <div className="w-full max-w-md border border-border bg-card">
                <div className="flex items-center gap-3 bg-primary px-6 py-4 text-primary-foreground">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="size-9 bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
                            <FileText className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold leading-none">
                                E-Arsip Desa
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.16em] opacity-70 mt-1">
                                Desa Sindangsari
                            </p>
                        </div>
                    </Link>
                </div>
                <div className="px-6 py-6">{children}</div>
            </div>
        </div>
    );
}
