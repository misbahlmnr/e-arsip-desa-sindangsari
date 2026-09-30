import { useState } from "react";
import { usePage } from "@inertiajs/react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import FlashMessage from "@/components/FlashMessage";
import NavLink from "@/components/NavLink";
import BrandLogo from "@/components/BrandLogo";
import { NAVBAR_ITEMS } from "@/shared/config/navigation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

function readSidebarCollapsed() {
    try {
        return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
    } catch {
        return false;
    }
}

function writeSidebarCollapsed(collapsed) {
    try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
        // Private mode or storage quota — keep the in-memory toggle.
    }
}

export default function AppLayout({ title, subtitle, children }) {
    const [collapsed, setCollapsed] = useState(readSidebarCollapsed);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = () => {
        setCollapsed((current) => {
            const next = !current;
            writeSidebarCollapsed(next);
            return next;
        });
    };
    const user = usePage().props.auth.user;
    const menuItems = NAVBAR_ITEMS.filter(
        (n) => !n.roles || (user && n.roles.includes(user.role)),
    );

    return (
        <div className="flex h-dvh w-full bg-background overflow-hidden">
            <FlashMessage />
            <AppSidebar collapsed={collapsed} />
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                <AppHeader
                    title={title}
                    subtitle={subtitle}
                    onToggleSidebar={toggleSidebar}
                    onOpenMobile={() => setMobileOpen(true)}
                />
                <main className="flex-1 overflow-y-auto min-h-0">
                    <div className="p-5 md:p-6 max-w-[1400px] mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent
                    side="left"
                    className="w-72 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border [&>button]:text-sidebar-foreground"
                >
                    <SheetHeader className="sr-only">
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border pr-12">
                        <BrandLogo className="size-12 shrink-0" />
                        <div className="min-w-0">
                            <p className="font-semibold text-white tracking-tight text-sm leading-none">
                                E-Arsip
                            </p>
                            <p className="text-[10px] text-sidebar-foreground/60 mt-1 uppercase tracking-[0.16em] font-medium">
                                Desa Sindangsari
                            </p>
                        </div>
                    </div>
                    <div className="h-1 flex shrink-0" aria-hidden>
                        <span className="flex-[3] bg-sidebar-primary" />
                        <span className="flex-1 bg-warning" />
                        <span className="w-8 bg-destructive" />
                    </div>
                    <nav className="py-4">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.href}
                                href={item.href}
                                active={route().current(item.routeName)}
                                onClick={() => setMobileOpen(false)}
                            >
                                <item.icon className="size-4 shrink-0" strokeWidth={2} />
                                <span className="truncate">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}
