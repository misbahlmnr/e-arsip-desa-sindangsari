<?php

namespace Database\Seeders;

use App\Models\Disposisi;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

/**
 * Seeder data demo Kantor Desa — mensimulasikan alur kerja pengarsipan surat nyata.
 *
 * Workflow Surat Masuk (50) — urutan kronologis (indeks 0 = paling lama, 49 = paling baru):
 *   E.  5 surat selesai & diarsipkan (terlama)
 *   D.  5 surat sedang ditindaklanjuti
 *   C. 15 surat sudah didisposisikan
 *   B. 15 surat dibaca Sekdes, belum didisposisikan
 *   A. 10 surat baru diterima (terbaru, belum diproses)
 *
 * Workflow Disposisi:
 *   Dibuat hanya untuk surat masuk bucket C–E; status menunggu / diproses / selesai
 *   mengikuti tahapan tindak lanjut. Tujuan disposisi memakai opsi resmi aplikasi.
 *
 * Workflow Surat Keluar (50):
 *   Status DB: draft | terkirim (arsip via diarsipkan_at).
 *   Tahapan bisnis tambahan (menunggu persetujuan, disetujui, selesai) dicatat di kolom catatan.
 *   ±12 surat keluar merupakan balasan / tindak lanjut surat masuk (surat_masuk_id).
 *
 * Arsip:
 *   Surat masuk bucket E + sebagian surat keluar terkirim yang diarsipkan.
 *   Tidak ada tabel arsip terpisah — flag diarsipkan_at pada surat sumber.
 */
class DesaWorkflowSeeder extends Seeder
{
    /** @var list<string> */
    private const PENGIRIM = [
        'Kecamatan Cikarang Utara',
        'Pemerintah Kabupaten Bekasi',
        'Dinas Pendidikan Kabupaten Bekasi',
        'Dinas Sosial Kabupaten Bekasi',
        'Dinas Kesehatan Kabupaten Bekasi',
        'Badan Permusyawaratan Desa (BPD)',
        'Karang Taruna Desa Mekarsari',
        'Ketua RT 03 / RW 05',
        'Sdr. Hendra Wijaya (Warga)',
        'PT Mitra Nusantara Sejahtera',
        'Kantor Camat Cikarang Utara',
        'Dinas Pemberdayaan Masyarakat Desa',
        'Puskesmas Desa Mekarsari',
        'Polsek Cikarang Utara',
        'Dinas Pekerjaan Umum dan Penataan Ruang',
        'Lembaga Pemberdayaan Perempuan Desa',
        'Koperasi Wanita Mekar Jaya',
        'Perwakilan Warga Dusun Krajan',
        'Dinas Lingkungan Hidup Kabupaten',
        'Balai Desa Tetangga — Desa Sukamaju',
    ];

    /** @var list<string> */
    private const PERIHAL_MASUK = [
        'Undangan Rapat Koordinasi Bulanan Kecamatan',
        'Permohonan Data Penduduk untuk Program Bantuan',
        'Permohonan Verifikasi Penerima Bantuan Sosial',
        'Surat Edaran Penyelenggaraan Pemilihan Serentak',
        'Permintaan Laporan Realisasi Anggaran Bulanan',
        'Undangan Musyawarah Perencanaan Pembangunan (Musrenbang)',
        'Permohonan Kerjasama Kegiatan Kemasyarakatan',
        'Pengajuan Proposal Kegiatan Desa',
        'Permohonan Informasi Publik terkait APBDes',
        'Monitoring dan Evaluasi Program Stunting',
        'Penyampaian Jadwal Imunisasi Rutin Balita',
        'Koordinasi Penanganan Bencana Banjir Rob',
        'Permohonan Izin Penggunaan Balai Desa',
        'Undangan Sosialisasi Pajak Bumi dan Bangunan',
        'Permintaan Data Ketenagakerjaan Desa',
        'Penyampaian Hasil Audit Internal Desa',
        'Permohonan Rekomendasi Pembangunan Jalan Lingkungan',
        'Undangan Pelatihan Aparatur Desa',
        'Laporan Pengaduan Masyarakat Bulan Berjalan',
        'Permohonan Data UMKM untuk Bazar Produk Lokal',
    ];

    /** @var list<string> */
    private const INSTRUKSI_DISPOSISI = [
        'Ditindaklanjuti sesuai ketentuan yang berlaku.',
        'Dipelajari dan laporkan hasilnya kepada Sekretaris Desa.',
        'Siapkan draf jawaban surat untuk ditandatangani Kepala Desa.',
        'Koordinasikan dengan pihak terkait di lingkungan desa.',
        'Arsipkan setelah kegiatan selesai dilaksanakan.',
        'Hadiri kegiatan dan sampaikan laporan singkat.',
        'Buat laporan tindak lanjut paling lambat 7 hari kerja.',
        'Tindaklanjuti bersama Kaur terkait dan konfirmasi ke pengirim.',
    ];

    /** @var list<string> */
    private const TUJUAN_DISPOSISI = [
        'Kepala Desa',
        'Sekretaris Desa',
        'Kaur Pemerintahan',
        'Kaur Keuangan',
        'Kaur Umum',
    ];

    /** @var list<string> */
    private const JENIS_SURAT_KELUAR = [
        'Surat Keterangan Domisili',
        'Surat Keterangan Usaha',
        'Surat Pengantar SKCK',
        'Surat Keterangan Tidak Mampu',
        'Surat Undangan Rapat',
        'Surat Balasan Permohonan Data',
        'Surat Tugas Perangkat Desa',
        'Surat Pemberitahuan Kegiatan Desa',
        'Surat Permohonan Bantuan ke Dinas',
        'Surat Rekomendasi Kegiatan Masyarakat',
        'Surat Konfirmasi Kehadiran',
        'Surat Balasan Kerjasama',
        'Surat Keterangan Belum Menikah',
        'Surat Pengantar Nikah',
        'Surat Keterangan Penghasilan',
    ];

    /** @var list<string> */
    private const TUJUAN_KELUAR = [
        'Kecamatan Cikarang Utara',
        'Dinas Pendidikan Kabupaten Bekasi',
        'Dinas Sosial Kabupaten Bekasi',
        'Kantor Camat Cikarang Utara',
        'BPD Desa Mekarsari',
        'Sdr. Rina Marlina',
        'Sdr. Budi Santoso',
        'PT Mitra Nusantara Sejahtera',
        'Puskesmas Desa Mekarsari',
        'Polsek Cikarang Utara',
        'Karang Taruna Desa Mekarsari',
        'Dinas Kesehatan Kabupaten Bekasi',
        'Desa Sukamaju',
        'Koperasi Wanita Mekar Jaya',
        'Ketua RT 02 / RW 04',
    ];

    /** @var Collection<int, SuratMasuk> */
    private Collection $suratMasuk;

    public function run(): void
    {
        $sekdes = User::query()->where('role', 'sekdes')->first();
        if (! $sekdes) {
            $this->command?->warn('Lewati DesaWorkflowSeeder: user sekdes belum ada. Jalankan UserSeeder terlebih dahulu.');

            return;
        }

        $this->resetDemoSurat();

        $this->command?->info('Menyemai 50 Surat Masuk dengan variasi workflow...');
        $this->suratMasuk = $this->seedSuratMasuk();

        $this->command?->info('Menyemai Disposisi terkait Surat Masuk...');
        $this->seedDisposisi($sekdes);

        $this->command?->info('Menyemai 50 Surat Keluar (termasuk balasan surat masuk)...');
        $this->seedSuratKeluar();

        $this->command?->info('Selesai. Arsip = surat dengan diarsipkan_at terisi.');
    }

    private function resetDemoSurat(): void
    {
        Disposisi::query()->delete();
        SuratKeluar::query()->delete();
        SuratMasuk::query()->delete();
    }

    /**
     * @return Collection<int, SuratMasuk>
     */
    private function seedSuratMasuk(): Collection
    {
        $created = collect();
        $startDate = now()->subMonths(6)->startOfMonth();

        // Indeks 0–49 = tanggal terima makin baru. Surat lama harus lebih jauh prosesnya.

        // Bucket E — 5 surat terlama: selesai & diarsipkan
        for ($i = 0; $i < 5; $i++) {
            $terima = $startDate->copy()->addDays($i * 3);
            $created->push($this->createSuratMasuk($i, $startDate, [
                'status' => 'selesai',
                'catatan' => 'Proses penanganan selesai. Surat telah diarsipkan.',
                'diarsipkan_at' => $terima->copy()->addDays(21),
                'bucket' => 'arsip',
            ]));
        }

        // Bucket D — 5 surat: tindak lanjut aktif (sudah lama di proses)
        for ($i = 5; $i < 10; $i++) {
            $created->push($this->createSuratMasuk($i, $startDate, [
                'status' => 'sedang_diproses',
                'catatan' => 'Tindak lanjut sedang berjalan; menunggu laporan akhir.',
                'diarsipkan_at' => null,
                'bucket' => 'tindak_lanjut',
            ]));
        }

        // Bucket C — 15 surat: sudah didisposisikan
        for ($i = 10; $i < 25; $i++) {
            $created->push($this->createSuratMasuk($i, $startDate, [
                'status' => 'sedang_diproses',
                'catatan' => 'Disposisi telah dikeluarkan ke perangkat desa terkait.',
                'diarsipkan_at' => null,
                'bucket' => 'didisposisikan',
            ]));
        }

        // Bucket B — 15 surat: dibaca, belum disposisi (relatif baru)
        for ($i = 25; $i < 40; $i++) {
            $created->push($this->createSuratMasuk($i, $startDate, [
                'status' => 'belum_diproses',
                'catatan' => 'Sudah dibaca Sekretaris Desa. Menunggu pembuatan disposisi.',
                'diarsipkan_at' => null,
                'bucket' => 'dibaca_belum_disposisi',
            ]));
        }

        // Bucket A — 10 surat terbaru: baru diterima
        for ($i = 40; $i < 50; $i++) {
            $created->push($this->createSuratMasuk($i, $startDate, [
                'status' => 'belum_diproses',
                'catatan' => null,
                'diarsipkan_at' => null,
                'bucket' => 'baru',
            ]));
        }

        return $created;
    }

    /**
     * @param  array{bucket: string, status: string, catatan: ?string, diarsipkan_at: ?Carbon}  $meta
     */
    private function createSuratMasuk(int $index, Carbon $startDate, array $meta): SuratMasuk
    {
        $tanggalTerima = $startDate->copy()->addDays($index * 3);
        $tanggalSurat = $tanggalTerima->copy()->subDays(($index % 5) + 1);
        $pengirim = self::PENGIRIM[$index % count(self::PENGIRIM)];
        $perihal = self::PERIHAL_MASUK[$index % count(self::PERIHAL_MASUK)];

        return SuratMasuk::query()->create([
            'no_surat' => $this->nomorSuratMasuk($index, $tanggalTerima),
            'tanggal_terima' => $tanggalTerima->toDateString(),
            'tanggal_surat' => $tanggalSurat->toDateString(),
            'pengirim' => $pengirim,
            'perihal' => $perihal,
            'catatan' => $meta['catatan'],
            'status' => $meta['status'],
            'tujuan' => 'Kantor Desa Mekarsari',
            'file' => null,
            'diarsipkan_at' => $meta['diarsipkan_at'],
        ]);
    }

    private function seedDisposisi(User $sekdes): void
    {
        $bucketC = $this->suratMasuk->slice(10, 15)->values();
        $bucketD = $this->suratMasuk->slice(5, 5)->values();
        $bucketE = $this->suratMasuk->slice(0, 5)->values();

        // Bucket C: surat cukup lama — disposisi lama; yang lebih baru dalam bucket cenderung menunggu
        foreach ($bucketC as $idx => $surat) {
            $hariSetelahTerima = 2 + (int) ($idx / 3);
            $tanggal = Carbon::parse($surat->tanggal_terima)->addDays($hariSetelahTerima);
            $kepada = self::TUJUAN_DISPOSISI[$idx % count(self::TUJUAN_DISPOSISI)];
            $status = $idx >= 10
                ? Disposisi::STATUS_MENUNGGU
                : Disposisi::STATUS_DIPROSES;

            if (stripos($kepada, 'Kepala Desa') !== false && $idx >= 8) {
                $status = Disposisi::STATUS_MENUNGGU;
            }

            $this->createDisposisi($surat, $sekdes, $kepada, $status, $tanggal, $idx);

            // Beberapa surat didisposisikan ke dua perangkat sekaligus
            if ($idx % 4 === 0) {
                $kepada2 = self::TUJUAN_DISPOSISI[($idx + 2) % count(self::TUJUAN_DISPOSISI)];
                if ($kepada2 !== $kepada) {
                    $this->createDisposisi(
                        $surat,
                        $sekdes,
                        $kepada2,
                        Disposisi::STATUS_DIPROSES,
                        $tanggal->copy()->addDay(),
                        $idx + 100,
                    );
                }
            }
        }

        // Bucket D: surat lama — hampir selesai, mayoritas disposisi sudah diproses
        foreach ($bucketD as $idx => $surat) {
            $tanggal = Carbon::parse($surat->tanggal_terima)->addDays(4);
            $this->createDisposisi(
                $surat,
                $sekdes,
                'Kepala Desa',
                $idx === 0 ? Disposisi::STATUS_MENUNGGU : Disposisi::STATUS_DIPROSES,
                $tanggal,
                $idx + 200,
            );
            $this->createDisposisi(
                $surat,
                $sekdes,
                'Kaur Pemerintahan',
                Disposisi::STATUS_DIPROSES,
                $tanggal->copy()->addDay(),
                $idx + 300,
            );
        }

        // Bucket E: semua disposisi selesai sebelum diarsipkan
        foreach ($bucketE as $idx => $surat) {
            $tanggal = Carbon::parse($surat->tanggal_terima)->addDays(3);
            $this->createDisposisi(
                $surat,
                $sekdes,
                'Kepala Desa',
                Disposisi::STATUS_SELESAI,
                $tanggal,
                $idx + 400,
            );
            $this->createDisposisi(
                $surat,
                $sekdes,
                'Kaur Umum',
                Disposisi::STATUS_SELESAI,
                $tanggal->copy()->addDays(2),
                $idx + 500,
            );
        }
    }

    private function createDisposisi(
        SuratMasuk $surat,
        User $sekdes,
        string $kepada,
        string $status,
        Carbon $tanggal,
        int $instruksiIndex,
    ): void {
        Disposisi::query()->create([
            'surat_masuk_id' => $surat->id,
            'user_id' => $sekdes->id,
            'kepada' => $kepada,
            'catatan' => self::INSTRUKSI_DISPOSISI[$instruksiIndex % count(self::INSTRUKSI_DISPOSISI)],
            'status' => $status,
            'tanggal' => $tanggal->toDateString(),
        ]);
    }

    private function seedSuratKeluar(): void
    {
        $startDate = now()->subMonths(5)->startOfMonth();
        $balasanCandidates = $this->suratMasuk
            ->filter(fn (SuratMasuk $s) => in_array(
                $s->status,
                ['sedang_diproses', 'selesai'],
                true,
            ))
            ->sortBy('tanggal_terima')
            ->values();

        $balasanIndex = 0;

        for ($i = 0; $i < 50; $i++) {
            $tanggalKirim = $startDate->copy()->addDays($i * 3 + 1);
            $jenis = self::JENIS_SURAT_KELUAR[$i % count(self::JENIS_SURAT_KELUAR)];
            $tujuan = self::TUJUAN_KELUAR[$i % count(self::TUJUAN_KELUAR)];

            [$status, $catatan, $diarsipkanAt, $suratMasukId, $perihal] = $this->resolveSuratKeluarWorkflow(
                $i,
                $jenis,
                $balasanCandidates,
                $balasanIndex,
                $tanggalKirim,
            );

            if ($suratMasukId !== null) {
                $balasanIndex++;
                $sumber = $balasanCandidates->firstWhere('id', $suratMasukId);
                if ($sumber) {
                    $offsetHari = match (true) {
                        $status === 'draft' => 7,
                        $diarsipkanAt !== null => 25,
                        default => 14,
                    };
                    $tanggalKirim = Carbon::parse($sumber->tanggal_terima)->addDays($offsetHari);
                }
            }

            SuratKeluar::query()->create([
                'surat_masuk_id' => $suratMasukId,
                'no_surat' => $this->nomorSuratKeluar($i, $tanggalKirim),
                'tanggal_kirim' => $tanggalKirim->toDateString(),
                'tujuan' => $tujuan,
                'perihal' => $perihal,
                'catatan' => $catatan,
                'status' => $status,
                'file' => 'surat-keluar/arsip-digital/'.$this->nomorSuratKeluar($i, $tanggalKirim).'.pdf',
                'diarsipkan_at' => $diarsipkanAt,
            ]);
        }
    }

    /**
     * @param  Collection<int, SuratMasuk>  $balasanCandidates
     * @return array{0: string, 1: ?string, 2: ?Carbon, 3: ?int, 4: string}
     */
    private function resolveSuratKeluarWorkflow(
        int $index,
        string $jenis,
        Collection $balasanCandidates,
        int $balasanIndex,
        Carbon $tanggalKirim,
    ): array {
        $suratMasukId = null;
        $perihal = $jenis.' — Desa Mekarsari';

        // 12 surat keluar pertama merupakan tindak lanjut surat masuk
        if ($index < 12 && $balasanCandidates->isNotEmpty()) {
            /** @var SuratMasuk $sumber */
            $sumber = $balasanCandidates[$balasanIndex % $balasanCandidates->count()];
            $suratMasukId = $sumber->id;
            $tujuanBalasan = $sumber->pengirim;
            $perihal = $this->perihalBalasan($sumber->perihal, $jenis);

            if ($index < 4) {
                return ['draft', 'Draf awal; belum direview Sekretaris Desa.', null, $suratMasukId, $perihal];
            }
            if ($index < 7) {
                return ['draft', '[Menunggu Persetujuan] Menunggu paraf Kepala Desa sebelum dikirim ke '.$tujuanBalasan.'.', null, $suratMasukId, $perihal];
            }
            if ($index < 9) {
                return ['draft', '[Disetujui] Kepala Desa menyetujui draf. Siap dikirim ke '.$tujuanBalasan.'.', null, $suratMasukId, $perihal];
            }
            if ($index < 11) {
                return ['terkirim', 'Surat balasan telah dikirim ke '.$tujuanBalasan.'.', null, $suratMasukId, $perihal];
            }

            return [
                'terkirim',
                '[Selesai] Tindak lanjut surat masuk '.$sumber->no_surat.' telah rampung.',
                $tanggalKirim->copy()->addDays(10),
                $suratMasukId,
                $perihal,
            ];
        }

        // Surat keluar layanan warga / administrasi desa (tanpa surat masuk sumber)
        if ($index < 17) {
            return ['draft', 'Draf surat layanan; menunggu kelengkapan berkas warga.', null, null, $perihal];
        }
        if ($index < 22) {
            return ['draft', '[Menunggu Persetujuan] Draf menunggu tanda tangan Kepala Desa.', null, null, $perihal];
        }
        if ($index < 27) {
            return ['draft', '[Disetujui] Draf disetujui dan siap diserahkan / dikirim.', null, null, $perihal];
        }
        if ($index < 37) {
            return ['terkirim', 'Surat telah diserahkan kepada pemohon / pihak tujuan.', null, null, $perihal];
        }
        if ($index < 45) {
            return ['terkirim', '[Selesai] Layanan surat menyelesaikan permohonan pemohon.', null, null, $perihal];
        }

        return [
            'terkirim',
            '[Selesai] Surat telah diarsipkan sesuai ketentuan penyimpanan dokumen desa.',
            $tanggalKirim->copy()->addDays(7),
            null,
            $perihal,
        ];
    }

    private function perihalBalasan(string $perihalMasuk, string $jenis): string
    {
        if (str_contains(strtolower($perihalMasuk), 'undangan')) {
            return 'Surat Konfirmasi Kehadiran — '.$perihalMasuk;
        }
        if (str_contains(strtolower($perihalMasuk), 'permohonan')) {
            return 'Surat Balasan — '.$perihalMasuk;
        }
        if (str_contains(strtolower($perihalMasuk), 'kerjasama')) {
            return 'Surat Balasan Kerjasama — '.$perihalMasuk;
        }

        return $jenis.' — Tindak Lanjut '.$perihalMasuk;
    }

    private function nomorSuratMasuk(int $seq, Carbon $date): string
    {
        $kode = 470 + ($seq % 5);

        return sprintf(
            '%d.%d/%03d/%s/%d',
            $kode,
            ($seq % 9) + 1,
            $seq + 1,
            $this->bulanRomawi($date->month),
            $date->year,
        );
    }

    private function nomorSuratKeluar(int $seq, Carbon $date): string
    {
        return sprintf(
            '145/%03d/%s/%d',
            $seq + 1,
            $this->bulanRomawi($date->month),
            $date->year,
        );
    }

    private function bulanRomawi(int $month): string
    {
        $romawi = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

        return $romawi[$month] ?? (string) $month;
    }
}
