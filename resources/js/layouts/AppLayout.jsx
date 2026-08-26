import { useState } from "react";
import { usePage } from "@inertiajs/react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import FlashMessage from "@/components/FlashMessage";
import NavLink from "@/components/NavLink";
import { NAVBAR_ITEMS } from "@/shared/config/navigation";
import { FileText } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

export default function AppLayout({ title, subtitle, children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
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
                    onToggleSidebar={() => setCollapsed((c) => !c)}
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
                        <div className="size-9 bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shrink-0">
                            <FileText className="size-4" strokeWidth={2.2} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-white tracking-tight text-sm leading-none">
                                E-Arsip
                            </p>
                            <p className="text-[10px] text-sidebar-foreground/60 mt-1 uppercase tracking-[0.16em] font-medium">
                                Desa Sindangsari
                            </p>
                        </div>
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
