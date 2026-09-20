import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@inertiajs/react";
import { Menu } from "lucide-react";
import { useState } from "react";
import { NAV_LINKS } from "../constants";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50">
            <nav
                className="bg-card/90 backdrop-blur-md border-b border-border"
                aria-label="Navigasi utama"
            >
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                    <a
                        href="#beranda"
                        className="flex min-w-0 items-center gap-3"
                    >
                        <BrandLogo className="size-10 shrink-0 sm:size-11" />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold leading-none tracking-tight text-foreground">
                                E-Arsip
                            </p>
                            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                Desa Sindangsari
                            </p>
                        </div>
                    </a>

                    <div className="hidden items-center gap-1 lg:flex">
                        {NAV_LINKS.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                                {item.label}
                            </a>
                        ))}
                        <Button asChild className="ml-2 rounded-xl">
                            <Link href={route("login")}>Masuk</Link>
                        </Button>
                    </div>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="lg:hidden"
                                aria-label="Buka menu"
                            >
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 sm:max-w-sm">
                            <SheetHeader>
                                <SheetTitle className="text-left">
                                    Menu
                                </SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 flex flex-col gap-1">
                                {NAV_LINKS.map((item) => (
                                    <SheetClose asChild key={item.href}>
                                        <a
                                            href={item.href}
                                            className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                                        >
                                            {item.label}
                                        </a>
                                    </SheetClose>
                                ))}
                                <Button asChild className="mt-4 rounded-xl">
                                    <Link
                                        href={route("login")}
                                        onClick={() => setOpen(false)}
                                    >
                                        Masuk
                                    </Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
            <div className="flex h-1" aria-hidden>
                <span className="flex-[3] bg-sidebar-primary" />
                <span className="flex-1 bg-warning" />
                <span className="w-8 bg-destructive" />
            </div>
        </header>
    );
}
