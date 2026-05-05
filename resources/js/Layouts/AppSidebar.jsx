import NavLink from "@/Components/NavLink";
import { NAVBAR_ITEMS } from "@/Constant";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";

const Sidebar = ({ collapsed = false }) => {
    const user = usePage().props.auth.user;
    const menuItems = NAVBAR_ITEMS.filter(
        (n) => !n.roles || (user && n.roles.includes(user.role)),
    );

    return (
        <aside
            className={cn(
                "hidden md:flex shrink-0 bg-sidebar border-r border-sidebar-border flex-col transition-[width] duration-200",
                collapsed ? "w-20" : "w-72",
            )}
        >
            <div
                className={cn(
                    "flex items-center gap-3 px-6 py-6 border-b border-sidebar-border",
                    collapsed && "justify-center px-3",
                )}
            >
                <div className="size-11 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-soft shrink-0">
                    AD
                </div>
                {!collapsed && (
                    <div className="min-w-0">
                        <h1 className="font-bold text-sidebar-foreground tracking-tight text-base leading-none">
                            ArsipDesa
                        </h1>
                        <p className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-widest font-medium">
                            Sistem Arsip Desa
                        </p>
                    </div>
                )}
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = route().current(item.routeName);
                    return (
                        <NavLink
                            key={item.href}
                            href={item.href}
                            end={item.href === "/"}
                            className={collapsed ? "!justify-center" : ""}
                            active={isActive}
                        >
                            <item.icon
                                className="size-[18px] shrink-0"
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
                    <div className="rounded-xl bg-primary-soft px-4 py-3.5">
                        <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                            Bantuan
                        </p>
                        <p className="text-xs text-foreground/70 leading-relaxed">
                            Hubungi operator desa jika menemui kendala sistem.
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
