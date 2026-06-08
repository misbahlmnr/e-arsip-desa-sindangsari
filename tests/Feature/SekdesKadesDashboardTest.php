<?php

namespace Tests\Feature;

use App\Models\Disposisi;
use App\Models\SuratMasuk;
use App\Models\User;
use Database\Seeders\JabatanTujuanDisposisiSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SekdesKadesDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(JabatanTujuanDisposisiSeeder::class);
    }

    public function test_sekdes_dashboard_returns_summary_data(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-010',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas',
            'perihal' => 'Undangan',
            'status' => SuratMasuk::STATUS_DRAFT,
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
                ->where('summary.surat_masuk_draft', 1)
            );
    }

    public function test_kades_dashboard_counts_penting_surat_awaiting_action(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        $suratPenting = SuratMasuk::query()->create([
            'no_surat' => 'SM-011',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Edaran penting',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $sekdes->id,
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-012',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas',
            'perihal' => 'Biasa',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $sekdes->id,
            'tujuan' => '-',
        ]);

        Disposisi::query()->create([
            'surat_masuk_id' => $suratPenting->id,
            'user_id' => $kades->id,
            'jabatan_tujuan_id' => 1,
            'dari_jabatan' => Disposisi::DARI_KADES,
            'kepada' => 'Kaur Pemerintahan',
            'catatan' => 'Tindaklanjuti',
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
