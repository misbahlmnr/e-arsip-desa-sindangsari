<?php

namespace Tests\Feature;

use App\Models\Disposisi;
use App\Models\JabatanTujuanDisposisi;
use App\Models\SuratMasuk;
use App\Models\User;
use Database\Seeders\JabatanTujuanDisposisiSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DisposisiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(JabatanTujuanDisposisiSeeder::class);
    }

    private function jabatanId(): int
    {
        return JabatanTujuanDisposisi::query()->value('id');
    }

    private function createDraftSurat(): SuratMasuk
    {
        return SuratMasuk::query()->create([
            'no_surat' => 'TEST/001/2026',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas Test',
            'perihal' => 'Undangan rapat',
            'status' => SuratMasuk::STATUS_DRAFT,
            'tujuan' => '-',
            'file' => null,
        ]);
    }

    private function reviewAsBiasa(SuratMasuk $surat, User $sekdes): SuratMasuk
    {
        $this->actingAs($sekdes)
            ->patch(route('admin.surat-masuk.review-sekdes', ['surat_masuk' => $surat->id]), [
                'tingkat' => 'biasa',
            ])
            ->assertRedirect();

        return $surat->fresh();
    }

    public function test_sekdes_can_access_disposisi_index(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        $this->actingAs($sekdes)
            ->get(route('admin.disposisi.index'))
            ->assertOk();
    }

    public function test_kades_can_access_disposisi_index(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);

        $this->actingAs($kades)
            ->get(route('admin.disposisi.index'))
            ->assertOk();
    }

    public function test_admin_cannot_access_disposisi_index(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('admin.disposisi.index'))
            ->assertForbidden();
    }

    public function test_sekdes_can_review_and_create_disposisi_for_biasa(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);
        $surat = $this->createDraftSurat();

        $this->reviewAsBiasa($surat, $sekdes);

        $this->actingAs($sekdes)
            ->post(route('admin.disposisi.store'), [
                'surat_masuk_id' => $surat->id,
                'jabatan_tujuan_id' => $this->jabatanId(),
                'catatan' => 'Mohon ditindaklanjuti segera.',
                'tanggal' => now()->toDateString(),
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('disposisi', [
            'surat_masuk_id' => $surat->id,
            'user_id' => $sekdes->id,
            'dari_jabatan' => Disposisi::DARI_SEKDES,
        ]);

        $this->assertSame(SuratMasuk::STATUS_DIDISPOSISIKAN, $surat->fresh()->status);
    }

    public function test_disposisi_index_hides_archived_surat(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);
        $admin = User::factory()->create(['role' => 'admin']);
        $surat = $this->createDraftSurat();
        $this->reviewAsBiasa($surat, $sekdes);

        $this->actingAs($sekdes)
            ->post(route('admin.disposisi.store'), [
                'surat_masuk_id' => $surat->id,
                'jabatan_tujuan_id' => $this->jabatanId(),
                'catatan' => 'Mohon ditindaklanjuti segera.',
                'tanggal' => now()->toDateString(),
            ])
            ->assertRedirect();

        $this->actingAs($sekdes)
            ->get(route('admin.disposisi.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('disposisi.data', 1)
                ->where('disposisi.data.0.no_surat', $surat->no_surat)
            );

        $this->actingAs($admin)
            ->patch(route('admin.surat-masuk.archive', ['surat_masuk' => $surat->id]))
            ->assertRedirect();

        $this->actingAs($sekdes)
            ->get(route('admin.disposisi.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('disposisi.data', 0)
            );
    }

    public function test_sekdes_cannot_create_disposisi_before_review(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);
        $surat = $this->createDraftSurat();

        $this->actingAs($sekdes)
            ->post(route('admin.disposisi.store'), [
                'surat_masuk_id' => $surat->id,
                'jabatan_tujuan_id' => $this->jabatanId(),
                'catatan' => 'Tidak boleh.',
                'tanggal' => now()->toDateString(),
            ])
            ->assertForbidden();
    }

    public function test_kades_must_verify_penting_before_disposisi(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);
        $kades = User::factory()->create(['role' => 'kades']);
        $surat = $this->createDraftSurat();

        $this->actingAs($sekdes)
            ->patch(route('admin.surat-masuk.review-sekdes', ['surat_masuk' => $surat->id]), [
                'tingkat' => 'penting',
            ])
            ->assertRedirect();

        $this->actingAs($kades)
            ->post(route('admin.disposisi.store'), [
                'surat_masuk_id' => $surat->id,
                'jabatan_tujuan_id' => $this->jabatanId(),
                'catatan' => 'Belum diverifikasi.',
                'tanggal' => now()->toDateString(),
            ])
            ->assertForbidden();
    }

    public function test_kades_can_verify_and_create_disposisi_for_penting(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);
        $kades = User::factory()->create(['role' => 'kades']);
        $surat = $this->createDraftSurat();

        $this->actingAs($sekdes)
            ->patch(route('admin.surat-masuk.review-sekdes', ['surat_masuk' => $surat->id]), [
                'tingkat' => 'penting',
            ]);

        $this->actingAs($kades)
            ->patch(route('admin.surat-masuk.verifikasi-kades', ['surat_masuk' => $surat->id]))
            ->assertRedirect();

        $this->actingAs($kades)
            ->post(route('admin.disposisi.store'), [
                'surat_masuk_id' => $surat->id,
                'jabatan_tujuan_id' => $this->jabatanId(),
                'catatan' => 'Disposisi Kepala Desa.',
                'tanggal' => now()->toDateString(),
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('disposisi', [
            'surat_masuk_id' => $surat->id,
            'dari_jabatan' => Disposisi::DARI_KADES,
        ]);

        $this->assertSame(SuratMasuk::STATUS_DIDISPOSISIKAN, $surat->fresh()->status);
    }
}
