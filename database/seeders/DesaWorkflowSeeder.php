<?php

namespace Database\Seeders;

use App\Models\Disposisi;
use App\Models\JabatanTujuanDisposisi;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

/**
 * Seeder data demo Kantor Desa — alur: draft → review Sekdes → (verifikasi Kades) → disposisi → arsip.
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

    /** @var list<array{id: int, nama_jabatan: string}> */
    private array $jabatanOptions = [];

    public function run(): void
    {
        $sekdes = User::query()->where('role', 'sekdes')->first();
        $kades = User::query()->where('role', 'kades')->first();

        if (! $sekdes || ! $kades) {
            $this->command?->warn('Lewati DesaWorkflowSeeder: user sekdes/kades belum ada.');

            return;
        }

        $this->jabatanOptions = JabatanTujuanDisposisi::activeOptions();
        if ($this->jabatanOptions === []) {
            $this->call(JabatanTujuanDisposisiSeeder::class);
            $this->jabatanOptions = JabatanTujuanDisposisi::activeOptions();
        }

        $this->resetDemoSurat();

        $this->command?->info('Menyemai 50 Surat Masuk dengan variasi workflow...');
        $this->suratMasuk = $this->seedSuratMasuk($sekdes, $kades);

        $this->command?->info('Menyemai Disposisi terkait Surat Masuk...');
        $this->seedDisposisi($sekdes, $kades);

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
    private function seedSuratMasuk(User $sekdes, User $kades): Collection
    {
        $created = collect();
        $startDate = now()->subMonths(6)->startOfMonth();

        for ($i = 0; $i < 5; $i++) {
            $terima = $startDate->copy()->addDays($i * 3);
            $created->push($this->createSuratMasuk($i, $startDate, $sekdes, $kades, [
                'status' => SuratMasuk::STATUS_DIARSIPKAN,
                'tingkat' => $i % 2 === 0 ? SuratMasuk::TINGKAT_BIASA : SuratMasuk::TINGKAT_PENTING,
                'catatan' => 'Proses penanganan selesai. Surat telah diarsipkan.',
                'diarsipkan_at' => $terima->copy()->addDays(21),
                'verified_kades' => $i % 2 !== 0,
            ]));
        }

        for ($i = 5; $i < 20; $i++) {
            $isPenting = $i % 3 === 0;
            $created->push($this->createSuratMasuk($i, $startDate, $sekdes, $kades, [
                'status' => SuratMasuk::STATUS_DIDISPOSISIKAN,
                'tingkat' => $isPenting ? SuratMasuk::TINGKAT_PENTING : SuratMasuk::TINGKAT_BIASA,
                'catatan' => 'Disposisi telah dikeluarkan ke perangkat desa terkait.',
                'diarsipkan_at' => null,
                'verified_kades' => $isPenting,
            ]));
        }

        for ($i = 20; $i < 30; $i++) {
            $created->push($this->createSuratMasuk($i, $startDate, $sekdes, $kades, [
                'status' => SuratMasuk::STATUS_TERVERIFIKASI,
                'tingkat' => SuratMasuk::TINGKAT_BIASA,
                'catatan' => 'Sudah direview Sekdes. Menunggu pembuatan disposisi.',
                'diarsipkan_at' => null,
                'verified_kades' => false,
            ]));
        }

        for ($i = 30; $i < 35; $i++) {
            $created->push($this->createSuratMasuk($i, $startDate, $sekdes, $kades, [
                'status' => SuratMasuk::STATUS_TERVERIFIKASI,
                'tingkat' => SuratMasuk::TINGKAT_PENTING,
                'catatan' => 'Surat penting menunggu verifikasi Kepala Desa.',
                'diarsipkan_at' => null,
                'verified_kades' => false,
            ]));
        }

        for ($i = 35; $i < 40; $i++) {
            $created->push($this->createSuratMasuk($i, $startDate, $sekdes, $kades, [
                'status' => SuratMasuk::STATUS_TERVERIFIKASI,
                'tingkat' => SuratMasuk::TINGKAT_PENTING,
                'catatan' => 'Sudah diverifikasi Kades. Menunggu disposisi.',
                'diarsipkan_at' => null,
                'verified_kades' => true,
            ]));
        }

        for ($i = 40; $i < 50; $i++) {
            $created->push($this->createSuratMasuk($i, $startDate, $sekdes, $kades, [
                'status' => SuratMasuk::STATUS_DRAFT,
                'tingkat' => null,
                'catatan' => null,
                'diarsipkan_at' => null,
                'verified_kades' => false,
            ]));
        }

        return $created;
    }

    /**
     * @param  array{status: string, tingkat: ?string, catatan: ?string, diarsipkan_at: ?Carbon, verified_kades: bool}  $meta
     */
    private function createSuratMasuk(int $index, Carbon $startDate, User $sekdes, User $kades, array $meta): SuratMasuk
    {
        $tanggalTerima = $startDate->copy()->addDays($index * 3);
        $tanggalSurat = $tanggalTerima->copy()->subDays(($index % 5) + 1);
        $reviewAt = $meta['tingkat'] ? $tanggalTerima->copy()->addDay() : null;

        return SuratMasuk::query()->create([
            'no_surat' => $this->nomorSuratMasuk($index, $tanggalTerima),
            'tanggal_terima' => $tanggalTerima->toDateString(),
            'tanggal_surat' => $tanggalSurat->toDateString(),
            'pengirim' => self::PENGIRIM[$index % count(self::PENGIRIM)],
            'perihal' => self::PERIHAL_MASUK[$index % count(self::PERIHAL_MASUK)],
            'catatan' => $meta['catatan'],
            'status' => $meta['status'],
            'tingkat' => $meta['tingkat'],
            'tujuan' => 'Kantor Desa Mekarsari',
            'file' => null,
            'diarsipkan_at' => $meta['diarsipkan_at'],
            'verified_sekdes_at' => $reviewAt,
            'verified_sekdes_by' => $reviewAt ? $sekdes->id : null,
            'verified_kades_at' => $meta['verified_kades'] && $meta['tingkat'] === SuratMasuk::TINGKAT_PENTING
                ? $reviewAt?->copy()->addDays(2)
                : null,
            'verified_kades_by' => $meta['verified_kades'] && $meta['tingkat'] === SuratMasuk::TINGKAT_PENTING
                ? $kades->id
                : null,
        ]);
    }

    private function seedDisposisi(User $sekdes, User $kades): void
    {
        $didispos = $this->suratMasuk->slice(5, 15)->values();
        $arsip = $this->suratMasuk->slice(0, 5)->values();

        foreach ($didispos->merge($arsip) as $idx => $surat) {
            $isPenting = $surat->tingkat === SuratMasuk::TINGKAT_PENTING;
            $user = $isPenting ? $kades : $sekdes;
            $dari = $isPenting ? Disposisi::DARI_KADES : Disposisi::DARI_SEKDES;
            $tanggal = Carbon::parse($surat->tanggal_terima)->addDays(3);

            $this->createDisposisi($surat, $user, $dari, $tanggal, $idx);

            if ($idx % 4 === 0) {
                $this->createDisposisi(
                    $surat,
                    $user,
                    $dari,
                    $tanggal->copy()->addDay(),
                    $idx + 100,
                );
            }
        }
    }

    private function createDisposisi(
        SuratMasuk $surat,
        User $user,
        string $dariJabatan,
        Carbon $tanggal,
        int $instruksiIndex,
    ): void {
        $jabatan = $this->jabatanOptions[$instruksiIndex % count($this->jabatanOptions)];

        Disposisi::query()->create([
            'surat_masuk_id' => $surat->id,
            'user_id' => $user->id,
            'jabatan_tujuan_id' => $jabatan['id'],
            'dari_jabatan' => $dariJabatan,
            'kepada' => $jabatan['nama_jabatan'],
            'catatan' => self::INSTRUKSI_DISPOSISI[$instruksiIndex % count(self::INSTRUKSI_DISPOSISI)],
            'tanggal' => $tanggal->toDateString(),
        ]);
    }

    private function seedSuratKeluar(): void
    {
        $startDate = now()->subMonths(5)->startOfMonth();
        $balasanCandidates = $this->suratMasuk
            ->filter(fn (SuratMasuk $s) => in_array(
                $s->status,
                [SuratMasuk::STATUS_DIDISPOSISIKAN, SuratMasuk::STATUS_DIARSIPKAN],
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
