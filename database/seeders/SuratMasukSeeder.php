<?php

namespace Database\Seeders;

use App\Models\SuratMasuk;
use Illuminate\Database\Seeder;

class SuratMasukSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['474.2/101/I/2026', 'Dinas Pendidikan Kabupaten', 'Undangan rapat koordinasi PAUD', 'belum_diproses'],
            ['474.2/102/I/2026', 'BPJS Kesehatan', 'Sosialisasi kepesertaan JKN desa', 'belum_diproses'],
            ['474.1/15/II/2026', 'Camat Kecamatan', 'Permintaan data bantuan sosial', 'belum_diproses'],
            ['800.1/8/II/2026', 'Badan Keuangan Daerah', 'Penyampaian DPA perubahan', 'sedang_diproses'],
            ['900.12/3/II/2026', 'Polsek Wilayah', 'Koordinasi keamanan pilkades', 'sedang_diproses'],
            ['474.4/22/II/2026', 'Dinas Kesehatan', 'Imunisasi balita bulan Februari', 'sedang_diproses'],
            ['474.3/7/II/2026', 'Kantor Pertanahan', 'Pengukuran bidang tanah kas desa', 'sedang_diproses'],
            ['474.2/45/II/2026', 'PT PLN UID', 'Pemadaman listrik terjadwal', 'sedang_diproses'],
            ['474.1/31/III/2026', 'Lurah RW 03', 'Permohonan surat keterangan domisili', 'sedang_diproses'],
            ['474.5/2/III/2026', 'Dinas PUPR', 'Penanganan jalan desa rusak', 'sedang_diproses'],
            ['474.2/88/III/2026', 'BUMDes Makmur', 'Laporan kinerja triwulan I', 'sedang_diproses'],
            ['474.1/12/III/2026', 'Karang Taruna', 'Permohonan izin kegiatan 17 Agustus', 'selesai'],
            ['474.4/5/III/2026', 'Puskesmas Desa', 'Laporan stok obat essential', 'selesai'],
            ['474.3/19/IV/2026', 'Dinas Sosial', 'Verifikasi penerima PKH', 'selesai'],
            ['474.2/201/IV/2026', 'Perangkat Desa Tigaraksa', 'Undangan studi banding', 'selesai'],
            ['900.5/11/IV/2026', 'Satpol PP Kabupaten', 'Penertiban bangunan liar', 'selesai'],
            ['474.1/44/IV/2026', 'Koperasi Simpan Pinjam', 'Permohonan legalitas RAT', 'selesai'],
            ['474.2/156/V/2026', 'Dinas Pertanian', 'Bantuan benih padi', 'selesai'],
            ['474.4/9/V/2026', 'Posyandu Melati', 'Jadwal penimbangan balita', 'selesai'],
            ['474.1/67/V/2026', 'PT Telkom Witel', 'Pemasangan infrastruktur fiber optik', 'selesai'],
        ];

        $baseTerima = now()->subMonths(3)->startOfMonth();

        foreach ($rows as $index => [$noSurat, $pengirim, $perihal, $status]) {
            $tanggalTerima = $baseTerima->copy()->addDays($index * 4);
            $tanggalSurat = $tanggalTerima->copy()->subDays(2);

            SuratMasuk::query()->updateOrCreate(
                ['no_surat' => $noSurat],
                [
                    'tanggal_terima' => $tanggalTerima->toDateString(),
                    'tanggal_surat' => $tanggalSurat->toDateString(),
                    'pengirim' => $pengirim,
                    'perihal' => $perihal,
                    'catatan' => $index % 3 === 0 ? 'Perlu ditindaklanjuti segera.' : null,
                    'status' => $status,
                    'tujuan' => 'Kantor Desa',
                    'file' => null,
                    'diarsipkan_at' => $status === 'selesai' && $index >= 17
                        ? $tanggalTerima->copy()->addDays(7)
                        : null,
                ],
            );
        }
    }
}
