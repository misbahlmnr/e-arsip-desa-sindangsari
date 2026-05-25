<?php

namespace Tests\Feature;

use App\Models\Disposisi;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DisposisiTest extends TestCase
{
    use RefreshDatabase;

    private function createSurat(): SuratMasuk
    {
        return SuratMasuk::query()->create([
            'no_surat' => 'TEST/001/2026',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas Test',
            'perihal' => 'Undangan rapat',
            'status' => 'belum_diproses',
            'tujuan' => '-',
            'file' => null,
        ]);
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

    public function test_sekdes_can_create_disposisi_to_kades(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);
        $surat = $this->createSurat();

        $this->actingAs($sekdes)
            ->post(route('admin.disposisi.store'), [
                'surat_masuk_id' => $surat->id,
                'kepada' => 'Kepala Desa',
                'catatan' => 'Mohon ditindaklanjuti segera.',
                'tanggal' => now()->toDateString(),
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('disposisi', [
            'surat_masuk_id' => $surat->id,
            'user_id' => $sekdes->id,
            'kepada' => 'Kepala Desa',
            'status' => 'menunggu',
        ]);

        $surat->refresh();
        $this->assertSame('sedang_diproses', $surat->status);
    }

    public function test_kades_can_update_disposisi_status(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);
        $kades = User::factory()->create(['role' => 'kades']);
        $surat = $this->createSurat();

        $disposisi = Disposisi::query()->create([
            'surat_masuk_id' => $surat->id,
            'user_id' => $sekdes->id,
            'kepada' => 'Kepala Desa',
            'catatan' => 'Perlu persetujuan.',
            'status' => 'menunggu',
            'tanggal' => now()->toDateString(),
        ]);

        $this->actingAs($kades)
            ->patch(route('admin.disposisi.update-status', ['disposisi' => $disposisi->id]), [
                'status' => 'selesai',
            ])
            ->assertRedirect();

        $disposisi->refresh();
        $this->assertSame('selesai', $disposisi->status);
        $this->assertSame('selesai', $surat->fresh()->status);
    }

    public function test_sekdes_can_store_disposisi_from_surat_masuk(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);
        $surat = $this->createSurat();

        $this->actingAs($sekdes)
            ->post(route('admin.surat-masuk.disposisi.store', ['surat_masuk' => $surat->id]), [
                'kepada' => 'Kepala Desa',
                'catatan' => 'Arahan dari sekdes.',
            ])
            ->assertRedirect();

        $this->assertDatabaseCount('disposisi', 1);
    }
}
