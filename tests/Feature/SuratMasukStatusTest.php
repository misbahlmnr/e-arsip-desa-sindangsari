<?php

namespace Tests\Feature;

use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SuratMasukStatusTest extends TestCase
{
    use RefreshDatabase;

    private function createSurat(): SuratMasuk
    {
        return SuratMasuk::query()->create([
            'no_surat' => 'TEST/STATUS/2026',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas Test',
            'perihal' => 'Uji status',
            'status' => 'sedang_diproses',
            'tujuan' => '-',
            'file' => null,
        ]);
    }

    public function test_admin_can_mark_surat_masuk_as_selesai(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $surat = $this->createSurat();

        $this->actingAs($admin)
            ->patch(route('admin.surat-masuk.update-status', ['surat_masuk' => $surat->id]), [
                'status' => 'selesai',
            ])
            ->assertRedirect();

        $this->assertSame('selesai', $surat->fresh()->status);
    }

    public function test_sekdes_cannot_update_surat_masuk_status(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);
        $surat = $this->createSurat();

        $this->actingAs($sekdes)
            ->patch(route('admin.surat-masuk.update-status', ['surat_masuk' => $surat->id]), [
                'status' => 'selesai',
            ])
            ->assertForbidden();

        $this->assertSame('sedang_diproses', $surat->fresh()->status);
    }
}
