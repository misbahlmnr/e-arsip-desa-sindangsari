import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { DataTable } from "@/Components/DataTable/Index";
import { columns } from "./columns";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import FormModalSuratMasuk from "./FormModalSuratMasuk";

export default function SuratMasuk() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mockDataSuratMasuk = [
        {
            id: 1,
            nomor_registrasi: "001/DS-SDG/SM/I/2026",
            no_surat: "005/DISDUKCAPIL/2026",
            tanggal_terima: "2026-01-05",
            pengirim: "Dinas Dukcapil Kab. Pangandaran",
            perihal: "Permohonan Data Penduduk",
            status: "belum_diproses",
            tujuan: "-",
        },
        {
            id: 2,
            nomor_registrasi: "002/DS-SDG/SM/I/2026",
            no_surat: "010/DINKES/2026",
            tanggal_terima: "2026-01-08",
            pengirim: "Dinas Kesehatan",
            perihal: "Undangan Sosialisasi Kesehatan",
            status: "sedang_diproses",
            tujuan: "Kasi Pelayanan",
        },
        {
            id: 3,
            nomor_registrasi: "003/DS-SDG/SM/I/2026",
            no_surat: "015/BPS/2026",
            tanggal_terima: "2026-01-10",
            pengirim: "Badan Pusat Statistik",
            perihal: "Permintaan Data Statistik Desa",
            status: "selesai",
            tujuan: "Sekretaris Desa",
        },
        {
            id: 4,
            nomor_registrasi: "004/DS-SDG/SM/I/2026",
            no_surat: "020/DISPERKIM/2026",
            tanggal_terima: "2026-01-12",
            pengirim: "Dinas Perumahan dan Permukiman",
            perihal: "Program Bantuan Rumah Layak Huni",
            status: "sedang_diproses",
            tujuan: "Kasi Pembangunan",
        },
        {
            id: 5,
            nomor_registrasi: "005/DS-SDG/SM/I/2026",
            no_surat: "022/KEC-CMR/2026",
            tanggal_terima: "2026-01-15",
            pengirim: "Kecamatan Cimerak",
            perihal: "Laporan Kegiatan Bulanan",
            status: "selesai",
            tujuan: "Kepala Desa",
        },
        {
            id: 6,
            nomor_registrasi: "006/DS-SDG/SM/I/2026",
            no_surat: "030/DINSOS/2026",
            tanggal_terima: "2026-01-18",
            pengirim: "Dinas Sosial",
            perihal: "Verifikasi Data Penerima Bantuan",
            status: "belum_diproses",
            tujuan: "-",
        },
        {
            id: 7,
            nomor_registrasi: "007/DS-SDG/SM/I/2026",
            no_surat: "035/POLSEK/2026",
            tanggal_terima: "2026-01-20",
            pengirim: "Polsek Cimerak",
            perihal: "Himbauan Keamanan Lingkungan",
            status: "sedang_diproses",
            tujuan: "Kasi Pemerintahan",
        },
        {
            id: 8,
            nomor_registrasi: "008/DS-SDG/SM/I/2026",
            no_surat: "040/DISDIK/2026",
            tanggal_terima: "2026-01-22",
            pengirim: "Dinas Pendidikan",
            perihal: "Pendataan Siswa Tidak Mampu",
            status: "selesai",
            tujuan: "Kasi Pelayanan",
        },
        {
            id: 9,
            nomor_registrasi: "009/DS-SDG/SM/I/2026",
            no_surat: "045/BANK-BJB/2026",
            tanggal_terima: "2026-01-25",
            pengirim: "Bank BJB",
            perihal: "Penawaran Kerjasama Layanan Keuangan",
            status: "belum_diproses",
            tujuan: "-",
        },
        {
            id: 10,
            nomor_registrasi: "010/DS-SDG/SM/I/2026",
            no_surat: "050/PLN/2026",
            tanggal_terima: "2026-01-28",
            pengirim: "PLN Area Pangandaran",
            perihal: "Pemberitahuan Pemadaman Listrik",
            status: "sedang_diproses",
            tujuan: "Kasi Pelayanan",
        },
        {
            id: 11,
            nomor_registrasi: "011/DS-SDG/SM/I/2026",
            no_surat: "055/DISPERKIM/2026",
            tanggal_terima: "2026-01-30",
            pengirim: "Dinas Perumahan dan Permukiman",
            perihal: "Program Bantuan Rumah Layak Huni",
            status: "belum_diproses",
            tujuan: "-",
        },
        {
            id: 12,
            nomor_registrasi: "012/DS-SDG/SM/I/2026",
            no_surat: "060/DISPERKIM/2026",
            tanggal_terima: "2026-02-02",
            pengirim: "Dinas Perumahan dan Permukiman",
            perihal: "Program Bantuan Rumah Layak Huni",
            status: "belum_diproses",
            tujuan: "-",
        },
        {
            id: 13,
            nomor_registrasi: "013/DS-SDG/SM/I/2026",
            no_surat: "065/DISPERKIM/2026",
            tanggal_terima: "2026-02-05",
            pengirim: "Dinas Perumahan dan Permukiman",
            perihal: "Program Bantuan Rumah Layak Huni",
            status: "belum_diproses",
            tujuan: "-",
        },
        {
            id: 14,
            nomor_registrasi: "014/DS-SDG/SM/I/2026",
            no_surat: "070/DISPERKIM/2026",
            tanggal_terima: "2026-02-08",
            pengirim: "Dinas Perumahan dan Permukiman",
            perihal: "Program Bantuan Rumah Layak Huni",
            status: "belum_diproses",
            tujuan: "-",
        },
        {
            id: 15,
            nomor_registrasi: "015/DS-SDG/SM/I/2026",
            no_surat: "075/DISPERKIM/2026",
            tanggal_terima: "2026-02-10",
            pengirim: "Dinas Perumahan dan Permukiman",
            perihal: "Program Bantuan Rumah Layak Huni",
            status: "belum_diproses",
            tujuan: "-",
        },
        {
            id: 16,
            nomor_registrasi: "016/DS-SDG/SM/I/2026",
            no_surat: "080/DISPERKIM/2026",
            tanggal_terima: "2026-02-12",
            pengirim: "Dinas Perumahan dan Permukiman",
            perihal: "Program Bantuan Rumah Layak Huni",
            status: "belum_diproses",
            tujuan: "-",
        },
    ];

    return (
        <AppLayout>
            <Head title="Surat Masuk" />

            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Surat Masuk
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelola dan pantau semua surat masuk dengan mudah
                        </p>
                    </div>

                    <Button onClick={() => setIsModalOpen(true)}>
                        Tambah Surat
                    </Button>
                </motion.div>

                {/* Surat Terbaru */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <DataTable columns={columns} data={mockDataSuratMasuk} />
                </motion.div>
            </div>
            <FormModalSuratMasuk
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </AppLayout>
    );
}
