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
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                active
                    ? "!bg-primary-soft !text-primary font-semibold shadow-soft"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700",
                className,
            )}
        >
            {children}
        </Link>
    );
}
