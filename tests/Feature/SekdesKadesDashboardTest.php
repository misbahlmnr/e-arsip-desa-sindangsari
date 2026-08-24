<?php

namespace Tests\Feature;

use App\Models\Disposisi;
use App\Models\SuratMasuk;
use App\Models\User;
use Database\Seeders\JabatanTujuanDisposisiSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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
                ->has('attention', 1)
                ->where('attention.0.key', 'menunggu_review')
                ->where('attention.0.route', 'admin.surat-masuk.index')
                ->where('attention.0.params.status', 'draft')
            );
    }

    public function test_sekdes_dashboard_pending_lists_penting_menunggu_kades(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-030',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Penting menunggu',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $sekdes->id,
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-031',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas',
            'perihal' => 'Biasa siap disposisi',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $sekdes->id,
            'tujuan' => '-',
        ]);

        $this->actingAs($sekdes)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('summary.disposisi_ke_kades_menunggu', 1)
                ->has('pending_disposisi', 1)
                ->where('pending_disposisi.0.no_surat', 'SM-030')
                ->where('pending_disposisi.0.status', 'menunggu_verifikasi_kades')
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
            ->assertInertia(fn (Assert $page) => $page
                ->where('summary.disposisi', 1)
                ->where('summary.disposisi_menunggu', 1)
                ->where('summary.disposisi_diproses', 0)
                ->has('pending_disposisi', 1)
                ->has('attention', 1)
                ->where('attention.0.key', 'verifikasi_penting')
                ->where('attention.0.route', 'admin.surat-masuk.index')
                ->where('attention.0.params.kades_aksi', 'menunggu_verifikasi')
                ->where('attention.0.count', 1)
            );
    }

    public function test_kades_attention_includes_siap_disposisi_when_verified(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-013',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Sudah diverifikasi Kades',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $sekdes->id,
            'verified_kades_at' => now(),
            'verified_kades_by' => $kades->id,
            'tujuan' => '-',
        ]);

        $this->actingAs($kades)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('summary.disposisi_menunggu', 0)
                ->where('summary.disposisi_diproses', 1)
                ->has('attention', 1)
                ->where('attention.0.key', 'siap_disposisi')
                ->where('attention.0.route', 'admin.surat-masuk.index')
                ->where('attention.0.params.kades_aksi', 'siap_disposisi')
                ->where('attention.0.count', 1)
            );
    }

    public function test_kades_attention_empty_when_no_penting_pending(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-014',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas',
            'perihal' => 'Biasa saja',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $sekdes->id,
            'tujuan' => '-',
        ]);

        $this->actingAs($kades)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('summary.disposisi_menunggu', 0)
                ->where('summary.disposisi_diproses', 0)
                ->has('attention', 0)
            );
    }

    public function test_surat_masuk_index_filters_by_kades_aksi_menunggu_verifikasi(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        $menunggu = SuratMasuk::query()->create([
            'no_surat' => 'SM-015',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Menunggu verifikasi',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $sekdes->id,
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-016',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Siap disposisi',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $sekdes->id,
            'verified_kades_at' => now(),
            'verified_kades_by' => $kades->id,
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-017',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas',
            'perihal' => 'Biasa',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $sekdes->id,
            'tujuan' => '-',
        ]);

        $this->actingAs($kades)
            ->get(route('admin.surat-masuk.index', ['kades_aksi' => 'menunggu_verifikasi']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.kades_aksi', 'menunggu_verifikasi')
                ->has('letters.data', 1)
                ->where('letters.data.0.id', $menunggu->id)
            );
    }

    public function test_surat_masuk_index_filters_by_kades_aksi_siap_disposisi(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-018',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Menunggu verifikasi',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $sekdes->id,
            'tujuan' => '-',
        ]);

        $siap = SuratMasuk::query()->create([
            'no_surat' => 'SM-019',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Siap disposisi',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $sekdes->id,
            'verified_kades_at' => now(),
            'verified_kades_by' => $kades->id,
            'tujuan' => '-',
        ]);

        $this->actingAs($kades)
            ->get(route('admin.surat-masuk.index', ['kades_aksi' => 'siap_disposisi']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.kades_aksi', 'siap_disposisi')
                ->has('letters.data', 1)
                ->where('letters.data.0.id', $siap->id)
            );
    }
}
