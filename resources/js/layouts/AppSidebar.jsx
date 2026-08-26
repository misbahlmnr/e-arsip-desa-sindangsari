import NavLink from "@/components/NavLink";
import { NAVBAR_ITEMS } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/utils";
import { usePage } from "@inertiajs/react";
import { FileText } from "lucide-react";

const Sidebar = ({ collapsed = false }) => {
    const user = usePage().props.auth.user;
    const menuItems = NAVBAR_ITEMS.filter(
        (n) => !n.roles || (user && n.roles.includes(user.role)),
    );

    return (
        <aside
            className={cn(
                "hidden md:flex shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex-col h-full min-h-0 overflow-hidden transition-[width] duration-200",
                collapsed ? "w-[72px]" : "w-64",
            )}
        >
            <div
                className={cn(
                    "flex items-center gap-3 px-4 h-16 border-b border-sidebar-border",
                    collapsed && "justify-center px-2",
                )}
            >
                <div className="size-9 bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shrink-0">
                    <FileText className="size-4" strokeWidth={2.2} />
                </div>
                {!collapsed && (
                    <div className="min-w-0">
                        <h1 className="font-semibold text-white tracking-tight text-sm leading-none">
                            E-Arsip
                        </h1>
                        <p className="text-[10px] text-sidebar-foreground/60 mt-1 uppercase tracking-[0.16em] font-medium">
                            Desa Sindangsari
                        </p>
                    </div>
                )}
            </div>

            <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto min-h-0">
                {menuItems.map((item) => {
                    const isActive = route().current(item.routeName);
                    return (
                        <NavLink
                            key={item.href}
                            href={item.href}
                            end={item.href === "/"}
                            className={collapsed ? "!justify-center px-0" : ""}
                            active={isActive}
                        >
                            <item.icon
                                className="size-4 shrink-0"
                                strokeWidth={2}
                            />
                            {!collapsed && (
                                <span className="truncate">{item.label}</span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {!collapsed && (
                <div className="p-4 border-t border-sidebar-border">
                    <p className="text-[10px] font-semibold text-sidebar-primary uppercase tracking-wider mb-1">
                        Bantuan
                    </p>
                    <p className="text-xs text-sidebar-foreground/55 leading-relaxed">
                        Hubungi operator desa jika menemui kendala sistem.
                    </p>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
