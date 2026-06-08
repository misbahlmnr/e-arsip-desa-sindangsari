<?php

namespace Tests\Feature;

use App\Models\Disposisi;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SekdesKadesDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_sekdes_dashboard_returns_summary_data(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-010',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas',
            'perihal' => 'Undangan',
            'status' => 'belum_diproses',
            'tujuan' => '-',
        ]);

        $this->actingAs($sekdes)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('summary')
                ->has('attention')
                ->has('recent_surat_masuk')
                ->has('recent_disposisi')
                ->where('summary.surat_masuk', 1)
                ->where('summary.surat_masuk_tanpa_disposisi', 1)
            );
    }

    public function test_kades_dashboard_only_counts_kepala_desa_disposisi(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        $surat = SuratMasuk::query()->create([
            'no_surat' => 'SM-011',
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
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('summary.disposisi', 1)
                ->where('summary.disposisi_menunggu', 1)
                ->has('pending_disposisi', 1)
            );
    }
}
