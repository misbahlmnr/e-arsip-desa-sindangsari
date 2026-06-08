<?php

namespace Tests\Feature;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_returns_summary_data(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-001',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas',
            'perihal' => 'Undangan',
            'status' => SuratMasuk::STATUS_DRAFT,
            'tujuan' => '-',
        ]);

        SuratKeluar::query()->create([
            'no_surat' => 'SK-001',
            'tanggal_kirim' => now()->toDateString(),
            'tujuan' => 'BPD',
            'perihal' => 'Laporan',
            'status' => 'draft',
            'file' => 'surat-keluar/test.pdf',
        ]);

        $this->actingAs($admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('summary')
                ->has('attention')
                ->has('monthly_trend')
                ->has('recent_surat_masuk')
                ->has('recent_surat_keluar')
                ->has('pending_disposisi')
                ->where('summary.surat_masuk', 1)
                ->where('summary.surat_keluar', 1)
                ->where('summary.surat_masuk_belum_diproses', 1)
            );
    }

    public function test_admin_dashboard_attention_includes_pending_items(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-002',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Edaran',
            'status' => SuratMasuk::STATUS_DRAFT,
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-003',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'BPD',
            'perihal' => 'Penting',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('summary.disposisi_menunggu', 1)
                ->has('attention', 3)
            );
    }
}
