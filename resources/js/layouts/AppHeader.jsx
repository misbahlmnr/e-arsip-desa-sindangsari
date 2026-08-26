import { router, usePage } from "@inertiajs/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut } from "lucide-react";

const ROLE_LABEL = {
    admin: "Administrator",
    sekdes: "Sekretaris Desa",
    kades: "Kepala Desa",
};

const AppHeader = ({ title, subtitle, actions, onToggleSidebar, onOpenMobile }) => {
    const user = usePage().props.auth.user;

    const initials = user?.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const logout = () => {
        router.post(route("logout"));
    };

    return (
        <header className="h-16 bg-card border-b border-border flex items-center justify-between gap-4 px-5 md:px-6 sticky top-0 z-20">
            <div className="flex items-center gap-3 min-w-0">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenMobile}
                    className="md:hidden shrink-0"
                    aria-label="Buka menu"
                >
                    <Menu className="size-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleSidebar}
                    className="hidden md:inline-flex shrink-0"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="size-5" />
                </Button>
                <div className="min-w-0">
                    <h2 className="text-base md:text-lg font-semibold tracking-tight text-foreground truncate">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground truncate">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {actions ? (
                    <div className="hidden sm:flex items-center gap-2">
                        {actions}
                    </div>
                ) : null}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 px-2 py-1.5 hover:bg-muted transition-colors border border-transparent hover:border-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-foreground leading-tight">
                                    {user?.name}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                    {user ? ROLE_LABEL[user.role] : ""}
                                </p>
                            </div>
                            <Avatar className="size-8 border border-border">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="font-semibold">{user?.name}</div>
                            <div className="text-xs text-muted-foreground font-normal">
                                {user?.email}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={logout}
                            className="text-destructive focus:text-destructive"
                        >
                            <LogOut className="size-4 mr-2" /> Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default AppHeader;
