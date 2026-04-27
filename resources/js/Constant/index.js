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
        current: route().current("dashboard"),
    },
    {
        label: "Surat Masuk",
        href: route("admin.surat-masuk.index"),
        icon: FileInput,
        current: "#",
    },
    {
        label: "Disposisi",
        href: "#",
        icon: Send,
        current: "#",
    },
    {
        label: "Surat Keluar",
        href: route("admin.surat-keluar.index"),
        icon: FileOutput,
        current: "#",
    },
    {
        label: "Arsip Surat",
        href: "#",
        icon: Archive,
        current: "#",
    },
    {
        label: "Laporan",
        href: "#",
        icon: BarChart3,
        current: "#",
    },
    {
        label: "Manajemen User",
        href: "#",
        icon: Users,
        current: "#",
        roles: ["admin"],
    },
];
