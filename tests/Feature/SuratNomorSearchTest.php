<?php

namespace Tests\Feature;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SuratNomorSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_surat_masuk_search_matches_no_surat_prefix_only(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => '145/001/I/2026',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas Pendidikan',
            'perihal' => 'Undangan rapat koordinasi',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => '470.1/002/V/2026',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => '145/001/I/2026',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index', ['search' => '145/']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 1)
                ->where('letters.data.0.no_surat', '145/001/I/2026')
            );
    }

    public function test_surat_masuk_search_ignores_perihal_match(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => '470.1/002/V/2026',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Undangan rapat',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index', ['search' => 'Undangan']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 0)
            );
    }

    public function test_surat_keluar_search_matches_no_surat_prefix(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratKeluar::query()->create([
            'no_surat' => '145/010/I/2026',
            'tanggal_kirim' => now()->toDateString(),
            'tujuan' => 'BPD',
            'perihal' => 'Laporan keuangan',
            'status' => 'terkirim',
            'file' => 'surat-keluar/test.pdf',
        ]);

        SuratKeluar::query()->create([
            'no_surat' => '200/001/II/2026',
            'tanggal_kirim' => now()->toDateString(),
            'tujuan' => 'Camat',
            'perihal' => 'Surat tugas',
            'status' => 'draft',
            'file' => 'surat-keluar/test2.pdf',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-keluar.index', ['search' => '145/']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 1)
                ->where('letters.data.0.no_surat', '145/010/I/2026')
            );
    }

    public function test_arsip_search_matches_archived_no_surat(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => '474.1/022/V/2024',
            'tanggal_terima' => now()->subMonths(2)->toDateString(),
            'pengirim' => 'Dinas',
            'perihal' => 'Edaran',
            'status' => 'diarsipkan',
            'tujuan' => '-',
            'diarsipkan_at' => now()->subMonth(),
        ]);

        SuratKeluar::query()->create([
            'no_surat' => '474.1/099/X/2024',
            'tanggal_kirim' => now()->subMonths(2)->toDateString(),
            'tujuan' => 'BPD',
            'perihal' => 'Balasan',
            'status' => 'terkirim',
            'file' => 'surat-keluar/test.pdf',
            'diarsipkan_at' => now()->subMonth(),
        ]);

        $this->actingAs($admin)
            ->get(route('admin.arsip-surat.index', ['search' => '474.1/', 'jenis' => 'all']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 2)
            );
    }

    public function test_search_without_term_returns_all_active_records(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-A/001',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'A',
            'perihal' => 'A',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-B/002',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'B',
            'perihal' => 'B',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 2)
            );
    }
}
