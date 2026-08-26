import { cn } from "@/shared/lib/utils";
import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm font-medium border-l-[3px] transition-colors",
                active
                    ? "bg-sidebar-accent text-white border-l-sidebar-primary"
                    : "border-l-transparent text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/70",
                className,
            )}
        >
            {children}
        </Link>
    );
}
