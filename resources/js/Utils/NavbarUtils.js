import {
    Home,
    Inbox,
    Send,
    Archive,
    Users,
    FileText,
    ClipboardList,
} from "lucide-react";

export const getNavbarItems = (role) => {
    const baseItems = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            icon: Home,
            current: route().current("dashboard"),
        },
    ];

    const roleBasedItems = {
        admin: [
            {
                name: "Surat Masuk",
                href: route("admin.surat-masuk.index"),
                icon: Inbox,
                current: route().current("surat-masuk.*"),
            },
            {
                name: "Surat Keluar",
                href: "#",
                icon: Send,
                current: route().current("surat-keluar.*"),
            },
            {
                name: "Disposisi",
                href: "#",
                icon: ClipboardList,
                current: route().current("disposisi.*"),
            },
            {
                name: "Arsip Surat",
                href: "#",
                icon: Archive,
                current: route().current("arsip.*"),
            },
            {
                name: "Laporan",
                href: "#",
                icon: FileText,
                current: route().current("laporan.*"),
            },
            {
                name: "Manajemen User",
                href: "#",
                icon: Users,
                current: route().current("users.*"),
            },
        ],

        sekdes: [
            {
                name: "Surat Masuk",
                href: "#",
                icon: Inbox,
                current: route().current("surat-masuk.*"),
            },
            {
                name: "Surat Keluar",
                href: "#",
                icon: Send,
                current: route().current("surat-keluar.*"),
            },
            {
                name: "Disposisi",
                href: "#",
                icon: ClipboardList,
                current: route().current("disposisi.*"),
            },
            {
                name: "Arsip Surat",
                href: "#",
                icon: Archive,
                current: route().current("arsip.*"),
            },
        ],

        kades: [
            {
                name: "Surat Masuk",
                href: "#",
                icon: Inbox,
                current: route().current("surat-masuk.*"),
            },
            {
                name: "Disposisi",
                href: "#",
                icon: ClipboardList,
                current: route().current("disposisi.*"),
            },
            {
                name: "Arsip Surat",
                href: "#",
                icon: Archive,
                current: route().current("arsip.*"),
            },
            {
                name: "Laporan",
                href: "#",
                icon: FileText,
                current: route().current("laporan.*"),
            },
        ],
    };

    return [...baseItems, ...(roleBasedItems[role] || [])];
};
