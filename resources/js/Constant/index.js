import {
    Archive,
    BarChart3,
    FileInput,
    FileOutput,
    LayoutDashboard,
    Send,
    Users,
} from "lucide-react";

export const NAVBAR_ITEMS = [
    {
        label: "Beranda",
        href: route("dashboard"),
        icon: LayoutDashboard,
        routeName: "dashboard",
    },
    {
        label: "Surat Masuk",
        href: route("admin.surat-masuk.index"),
        icon: FileInput,
        routeName: "admin.surat-masuk.index",
    },
    {
        label: "Disposisi",
        href: "#",
        icon: Send,
        routeName: "#",
    },
    {
        label: "Surat Keluar",
        href: route("admin.surat-keluar.index"),
        icon: FileOutput,
        routeName: "#",
    },
    {
        label: "Arsip Surat",
        href: "#",
        icon: Archive,
        routeName: "#",
    },
    {
        label: "Laporan",
        href: "#",
        icon: BarChart3,
        routeName: "#",
    },
    {
        label: "Manajemen User",
        href: "#",
        icon: Users,
        routeName: "#",
        roles: ["admin"],
    },
];
