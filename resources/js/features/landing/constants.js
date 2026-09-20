import {
    Archive,
    BarChart3,
    CheckCircle2,
    FileInput,
    FileOutput,
    FileText,
    LayoutDashboard,
    Search,
    Send,
    Shield,
    UserCog,
    Users,
} from "lucide-react";

export const APP_NAME = "E-Arsip Desa Sindangsari";
export const APP_TAGLINE = "Sistem Arsip Surat Desa Sindangsari";
export const APP_DESCRIPTION =
    "Sistem informasi pengelolaan surat masuk, surat keluar, review berjenjang, disposisi, dan arsip surat berbasis web untuk Kantor Desa Sindangsari, Kecamatan Cimerak, Kabupaten Pangandaran.";

export const NAV_LINKS = [
    { href: "#beranda", label: "Beranda" },
    { href: "#fitur", label: "Fitur" },
    { href: "#alur", label: "Alur" },
];

export const OVERVIEW_ITEMS = [
    {
        icon: FileInput,
        title: "Surat Masuk",
        description: "Kelola surat masuk secara digital.",
    },
    {
        icon: FileOutput,
        title: "Surat Keluar",
        description: "Catat dan pantau surat keluar.",
    },
    {
        icon: Send,
        title: "Disposisi",
        description: "Distribusi surat secara terstruktur.",
    },
    {
        icon: Archive,
        title: "Arsip",
        description: "Pencarian arsip lebih cepat.",
    },
];

export const FEATURE_ITEMS = [
    {
        icon: LayoutDashboard,
        title: "Beranda",
        description:
            "Lihat ringkasan antrian kerja sesuai peran: Admin, Sekdes, atau Kades.",
    },
    {
        icon: FileInput,
        title: "Kelola Surat Masuk",
        description:
            "Catat surat masuk, unggah berkas, dan pantau status review hingga arsip.",
    },
    {
        icon: FileOutput,
        title: "Kelola Surat Keluar",
        description:
            "Catat surat keluar beserta dokumen, tujuan, dan status pengiriman.",
    },
    {
        icon: Send,
        title: "Disposisi",
        description:
            "Salurkan instruksi ke Kaur atau Kasi secara tercatat dan terarah.",
    },
    {
        icon: Archive,
        title: "Arsip Surat",
        description:
            "Simpan surat selesai dan temukan kembali berdasarkan nomor surat.",
    },
    {
        icon: BarChart3,
        title: "Laporan PDF",
        description:
            "Unduh rekapitulasi surat untuk monitoring dan pelaporan desa.",
    },
    {
        icon: Users,
        title: "Manajemen User",
        description:
            "Kelola akun petugas: Admin, Sekretaris Desa, dan Kepala Desa.",
    },
];

export const WORKFLOW_STEPS = [
    {
        icon: UserCog,
        title: "Admin",
        description: "Mencatat surat dan mengunggah berkas.",
    },
    {
        icon: FileText,
        title: "Sekdes Review",
        description: "Menelaah surat dan menetapkan tingkat biasa atau penting.",
    },
    {
        icon: Shield,
        title: "Kades Verifikasi",
        description: "Memverifikasi surat penting sebelum disposisi.",
        note: "jika surat penting",
    },
    {
        icon: Send,
        title: "Disposisi",
        description: "Memberi instruksi ke perangkat desa terkait.",
    },
    {
        icon: Archive,
        title: "Arsip",
        description: "Admin mengarsipkan surat yang sudah selesai.",
    },
];

export const ADVANTAGE_ITEMS = [
    {
        icon: CheckCircle2,
        title: "Digital",
        description: "Pencatatan surat terpusat, tidak bergantung pada buku register.",
    },
    {
        icon: LayoutDashboard,
        title: "Terstruktur",
        description: "Alur mengikuti jabatan desa: Admin, Sekdes, lalu Kades.",
    },
    {
        icon: Search,
        title: "Cepat dicari",
        description: "Arsip dapat ditemukan kembali berdasarkan nomor surat.",
    },
    {
        icon: FileText,
        title: "Paperless",
        description: "Berkas digital tersimpan rapi bersama metadata surat.",
    },
    {
        icon: Shield,
        title: "Aman",
        description: "Akses terbatas akun petugas sesuai peran masing-masing.",
    },
    {
        icon: BarChart3,
        title: "Laporan PDF",
        description: "Rekapitulasi siap unduh untuk monitoring dan pelaporan.",
    },
];
