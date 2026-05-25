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
        roles: ["admin", "sekdes", "kades"],
    },
    {
        label: "Disposisi",
        href: route("admin.disposisi.index"),
        icon: Send,
        routeName: "admin.disposisi.index",
        roles: ["sekdes", "kades"],
    },
    {
        label: "Surat Keluar",
        href: route("admin.surat-keluar.index"),
        icon: FileOutput,
        routeName: "admin.surat-keluar.index",
        roles: ["admin", "sekdes", "kades"],
    },
    {
        label: "Arsip Surat",
        href: route("admin.arsip-surat.index"),
        icon: Archive,
        routeName: "admin.arsip-surat.index",
        roles: ["admin", "sekdes", "kades"],
    },
    {
        label: "Laporan",
        href: "#",
        icon: BarChart3,
        routeName: "#",
        roles: ["admin", "sekdes", "kades"],
    },
    {
        label: "Manajemen User",
        href: route("admin.users.index"),
        icon: Users,
        routeName: "admin.users.index",
        roles: ["admin"],
    },
];
