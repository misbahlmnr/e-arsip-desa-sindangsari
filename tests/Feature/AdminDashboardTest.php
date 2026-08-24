<?php

namespace Tests\Feature;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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
            ->assertInertia(fn (Assert $page) => $page
                ->where('summary.disposisi_menunggu', 1)
                ->where('summary.surat_masuk_tanpa_disposisi', 0)
                ->has('attention', 2)
                ->where('attention.0.key', 'menunggu_review')
                ->where('attention.0.route', 'admin.surat-masuk.index')
                ->where('attention.0.params.status', 'draft')
                ->where('attention.1.key', 'penting_menunggu_kades')
                ->where('attention.1.params.kades_aksi', 'menunggu_verifikasi')
            );
    }

    public function test_admin_tanpa_disposisi_counts_only_biasa_terverifikasi(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-020',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Biasa siap disposisi',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-021',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'BPD',
            'perihal' => 'Penting menunggu Kades',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-022',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas',
            'perihal' => 'Penting siap disposisi',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'verified_kades_at' => now(),
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('summary.surat_masuk_tanpa_disposisi', 1)
                ->where('summary.disposisi_menunggu', 1)
                ->where('summary.disposisi_diproses', 1)
                ->has('attention', 3)
                ->where('attention.0.key', 'tanpa_disposisi')
                ->where('attention.0.params.tingkat', 'biasa')
                ->where('attention.1.key', 'penting_menunggu_kades')
                ->where('attention.2.key', 'penting_siap_disposisi')
            );
    }

    public function test_surat_masuk_index_filters_by_status_draft(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $draft = SuratMasuk::query()->create([
            'no_surat' => 'SM-010',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Draft',
            'status' => SuratMasuk::STATUS_DRAFT,
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-011',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'BPD',
            'perihal' => 'Terverifikasi',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index', ['status' => 'draft']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.status', 'draft')
                ->has('letters.data', 1)
                ->where('letters.data.0.id', $draft->id)
            );
    }

    public function test_surat_masuk_index_filters_by_disposisi_belum(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-012',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Draft diabaikan',
            'status' => SuratMasuk::STATUS_DRAFT,
            'tujuan' => '-',
        ]);

        $tanpaDisposisi = SuratMasuk::query()->create([
            'no_surat' => 'SM-013',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'BPD',
            'perihal' => 'Tanpa disposisi',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index', ['disposisi' => 'belum']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.disposisi', 'belum')
                ->has('letters.data', 1)
                ->where('letters.data.0.id', $tanpaDisposisi->id)
            );
    }

    public function test_surat_keluar_index_filters_by_status_draft(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $draft = SuratKeluar::query()->create([
            'no_surat' => 'SK-010',
            'tanggal_kirim' => now()->toDateString(),
            'tujuan' => 'BPD',
            'perihal' => 'Draft',
            'status' => 'draft',
            'file' => 'surat-keluar/draft.pdf',
        ]);

        SuratKeluar::query()->create([
            'no_surat' => 'SK-011',
            'tanggal_kirim' => now()->toDateString(),
            'tujuan' => 'Camat',
            'perihal' => 'Terkirim',
            'status' => 'terkirim',
            'file' => 'surat-keluar/terkirim.pdf',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-keluar.index', ['status' => 'draft']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.status', 'draft')
                ->has('letters.data', 1)
                ->where('letters.data.0.id', $draft->id)
            );
    }
}
