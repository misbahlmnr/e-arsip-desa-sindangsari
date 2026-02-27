import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    ChevronDown,
    ChevronRight,
    Home,
    Users,
    BookOpen,
    Calendar,
    Settings,
    FileText,
    BarChart3,
    Menu,
    LogOut,
    User,
    GraduationCap,
    UserCheck,
    Lightbulb,
    ClipboardList,
    Award,
    CheckCircle,
} from "lucide-react";
import FlashMessage from "@/Components/FlashMessage";

export default function AppLayout({ children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});

    const getMenuItems = () => {
        const baseItems = [
            {
                name: "Dashboard",
                href: route("dashboard"),
                icon: Home,
                current: route().current("dashboard"),
            },
        ];

        if (user.role === "admin") {
            return [
                ...baseItems,
                {
                    name: "Manajemen User",
                    href: "#",
                    icon: Users,
                    children: [
                        {
                            name: "Data Admin",
                            href: route("admin.manajemen-user.admins.index"),
                            icon: User,
                            current: route().current(
                                "admin.manajemen-user.admins.*"
                            ),
                        },
                        {
                            name: "Data Guru",
                            href: route("admin.manajemen-user.gurus.index"),
                            icon: GraduationCap,
                            current: route().current(
                                "admin.manajemen-user.gurus.*"
                            ),
                        },
                        {
                            name: "Data Siswa",
                            href: route("admin.manajemen-user.siswas.index"),
                            icon: UserCheck,
                            current: route().current(
                                "admin.manajemen-user.siswas.*"
                            ),
                        },
                    ],
                },
                {
                    name: "Kelas",
                    href: route("admin.kelas.index"),
                    icon: BookOpen,
                    current: route().current("admin.kelas.*"),
                },
                {
                    name: "Mata Pelajaran",
                    href: route("admin.mapel.index"),
                    icon: BookOpen,
                    current: route().current("admin.mapel.*"),
                },
                {
                    name: "Jadwal",
                    href: route("admin.jadwal.index"),
                    icon: Calendar,
                    current: route().current("admin.jadwal.*"),
                },
                {
                    name: "Adaptive Rules",
                    href: route("admin.adaptive-rule.index"),
                    icon: Settings,
                    current: route().current("admin.adaptive-rule.*"),
                },
                {
                    name: "Laporan",
                    href: "#",
                    icon: FileText,
                    children: [
                        {
                            name: "Nilai",
                            href: route("admin.laporan.nilai"),
                            icon: BarChart3,
                            current: route().current("admin.laporan.nilai"),
                        },
                        {
                            name: "Absensi",
                            href: route("admin.laporan.absensi"),
                            icon: CheckCircle,
                            current: route().current("admin.laporan.absensi"),
                        },
                        {
                            name: "Adaptive Learning",
                            href: route("admin.laporan.adaptive-rules"),
                            icon: Lightbulb,
                            current: route().current(
                                "admin.laporan.adaptive-rules"
                            ),
                        },
                    ],
                },
            ];
        } else if (user.role === "guru") {
            return [
                ...baseItems,
                {
                    name: "Jadwal Mengajar",
                    href: route("guru.jadwal-mengajar"),
                    icon: Calendar,
                    current: route().current("guru.jadwal-mengajar"),
                },
                {
                    name: "Materi",
                    href: route("guru.materi.index"),
                    icon: BookOpen,
                    current: route().current("guru.materi.*"),
                },
                {
                    name: "Tugas",
                    href: route("guru.tugas.index"),
                    icon: ClipboardList,
                    current: route().current("guru.tugas.*"),
                },
                {
                    name: "Nilai",
                    href: route("guru.nilai.index"),
                    icon: Award,
                    current: route().current("guru.nilai.*"),
                },
                {
                    name: "Absensi",
                    href: route("guru.absensi.index"),
                    icon: CheckCircle,
                    current: route().current("guru.absensi.*"),
                },
                {
                    name: "Adaptive Rules",
                    href: route("guru.adaptive-rules.index"),
                    icon: Settings,
                    current: route().current("guru.adaptive-rules.*"),
                },
            ];
        } else if (user.role === "siswa") {
            return [
                ...baseItems,
                {
                    name: "Jadwal Hari Ini",
                    href: route("siswa.jadwal"),
                    icon: Calendar,
                    current: route().current("siswa.jadwal"),
                },
                {
                    name: "Materi",
                    href: route("siswa.materi.index"),
                    icon: BookOpen,
                    current: route().current("siswa.materi.*"),
                },
                {
                    name: "Materi Rekomendasi",
                    href: route("siswa.materi-rekomendasi.index"),
                    icon: Lightbulb,
                    current: route().current("siswa.materi-rekomendasi.*"),
                },
                {
                    name: "Tugas",
                    href: route("siswa.tugas.index"),
                    icon: ClipboardList,
                    current: route().current("siswa.tugas.*"),
                },
                {
                    name: "Nilai",
                    href: route("siswa.nilai.index"),
                    icon: Award,
                    current: route().current("siswa.nilai.*"),
                },
                {
                    name: "Absensi",
                    href: route("siswa.absensi.index"),
                    icon: CheckCircle,
                    current: route().current("siswa.absensi.*"),
                },
            ];
        }

        return baseItems;
    };

    const menuItems = getMenuItems();

    const SidebarContent = ({ mobile = false }) => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900">
                            SIAKAD
                        </span>
                        <span className="text-xs text-gray-500">
                            SMP System
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <div key={item.name}>
                        {item.children ? (
                            <div>
                                <button
                                    onClick={() =>
                                        setExpandedMenus((prev) => ({
                                            ...prev,
                                            [item.name]: !prev[item.name],
                                        }))
                                    }
                                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        expandedMenus[item.name]
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    <span className="flex-1 text-left">
                                        {item.name}
                                    </span>
                                    <motion.div
                                        animate={{
                                            rotate: expandedMenus[item.name]
                                                ? 90
                                                : 0,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {expandedMenus[item.name] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: "auto",
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="ml-8 mt-2 space-y-1 overflow-hidden"
                                        >
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                        child.current
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                    }`}
                                                >
                                                    <child.icon className="w-4 h-4 mr-3" />
                                                    <span>{child.name}</span>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href={item.href}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    item.current
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                <span>{item.name}</span>
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <FlashMessage />

            {/* Mobile sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="p-0 w-80">
                    <SidebarContent mobile />
                </SheetContent>
            </Sheet>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    <SidebarContent />
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-80">
                {/* Top navigation */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>

                    {/* Separator */}
                    <div className="h-6 w-px bg-gray-200 lg:hidden" />

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1"></div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* Profile dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-8 w-8 rounded-full"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src=""
                                                alt={user.name}
                                            />
                                            <AvatarFallback className="bg-blue-600 text-white">
                                                {user.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="end"
                                    forceMount
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {user.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground capitalize">
                                                {user.role}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={route("profile.edit")}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            className="text-red-600"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
