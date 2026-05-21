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
import { Menu, UserIcon, LogOut } from "lucide-react";

const ROLE_LABEL = {
    admin: "Administrator",
    sekdes: "Sekretaris Desa",
    kades: "Kepala Desa",
};

const AppHeader = ({ title, subtitle, onToggleSidebar }) => {
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
        <header className="h-20 bg-card border-b border-border flex items-center justify-between gap-4 px-6 md:px-10 sticky top-0 z-20">
            <div className="flex items-center gap-3 min-w-0">
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
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground truncate">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground truncate">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-muted transition-colors">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-foreground leading-tight">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {user ? ROLE_LABEL[user.role] : ""}
                                </p>
                            </div>
                            <Avatar className="size-10 border border-border">
                                <AvatarFallback className="bg-primary-soft text-primary font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="font-semibold">{user?.name}</div>
                            <div className="text-xs text-muted-foreground font-normal">
                                {user?.jabatan}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>
                            <UserIcon className="size-4 mr-2" /> Profil Saya
                        </DropdownMenuItem>
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
