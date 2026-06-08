<?php

namespace Tests\Feature;

use App\Models\Disposisi;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LaporanTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_laporan(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('admin.laporan.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('summary')
                ->has('monthly_trend')
            );
    }

    public function test_sekdes_can_view_laporan(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        $this->actingAs($sekdes)
            ->get(route('admin.laporan.index'))
            ->assertOk();
    }

    public function test_kades_can_view_laporan(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);

        $this->actingAs($kades)
            ->get(route('admin.laporan.index'))
            ->assertOk();
    }

    public function test_laporan_summary_reflects_surat_data(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-001',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas Pendidikan',
            'perihal' => 'Undangan rapat',
            'status' => 'belum_diproses',
            'tujuan' => '-',
        ]);

        SuratKeluar::query()->create([
            'no_surat' => 'SK-001',
            'tanggal_kirim' => now()->toDateString(),
            'tujuan' => 'BPD',
            'perihal' => 'Laporan keuangan',
            'status' => 'terkirim',
            'file' => 'surat-keluar/test.pdf',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.laporan.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('summary.surat_masuk', 1)
                ->where('summary.surat_keluar', 1)
            );
    }

    public function test_admin_can_export_laporan_pdf(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('admin.laporan.export', ['range' => '30d']))
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf');
    }

    public function test_kades_can_export_laporan_pdf(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);

        $this->actingAs($kades)
            ->get(route('admin.laporan.export'))
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf');
    }

    public function test_sekdes_can_export_laporan_pdf(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        $this->actingAs($sekdes)
            ->get(route('admin.laporan.export'))
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf');
    }

    public function test_kades_disposisi_stats_only_include_kepala_desa(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        $surat = SuratMasuk::query()->create([
            'no_surat' => 'SM-002',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Edaran',
            'status' => 'sedang_diproses',
            'tujuan' => '-',
        ]);

        Disposisi::query()->create([
            'surat_masuk_id' => $surat->id,
            'user_id' => $sekdes->id,
            'kepada' => 'Kepala Desa',
            'catatan' => 'Mohon ditindaklanjuti',
            'status' => Disposisi::STATUS_MENUNGGU,
            'tanggal' => now()->toDateString(),
        ]);

        Disposisi::query()->create([
            'surat_masuk_id' => $surat->id,
            'user_id' => $sekdes->id,
            'kepada' => 'Sekretaris Desa',
            'catatan' => 'Koordinasi',
            'status' => Disposisi::STATUS_DIPROSES,
            'tanggal' => now()->toDateString(),
        ]);

        $this->actingAs($kades)
            ->get(route('admin.laporan.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('summary.disposisi', 1)
            );
    }
}
