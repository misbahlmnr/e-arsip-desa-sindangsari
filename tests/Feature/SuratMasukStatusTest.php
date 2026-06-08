<?php

namespace Tests\Feature;

use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SuratMasukStatusTest extends TestCase
{
    use RefreshDatabase;

    private function createDidisposisikanSurat(): SuratMasuk
    {
        return SuratMasuk::query()->create([
            'no_surat' => 'TEST/STATUS/2026',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas Test',
            'perihal' => 'Uji status',
            'status' => SuratMasuk::STATUS_DIDISPOSISIKAN,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'tujuan' => '-',
            'file' => null,
        ]);
    }

    public function test_admin_cannot_archive_surat_before_didisposisikan(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $surat = SuratMasuk::query()->create([
            'no_surat' => 'TEST/DRAFT/2026',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas Test',
            'perihal' => 'Uji status',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'tujuan' => '-',
            'file' => null,
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.surat-masuk.archive', ['surat_masuk' => $surat->id]))
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->assertNull($surat->fresh()->diarsipkan_at);
    }

    public function test_admin_can_archive_surat_when_didisposisikan(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $surat = $this->createDidisposisikanSurat();

        $this->actingAs($admin)
            ->patch(route('admin.surat-masuk.archive', ['surat_masuk' => $surat->id]))
            ->assertRedirect()
            ->assertSessionHas('success');

        $fresh = $surat->fresh();
        $this->assertNotNull($fresh->diarsipkan_at);
        $this->assertSame(SuratMasuk::STATUS_DIARSIPKAN, $fresh->status);
    }

    public function test_sekdes_can_review_surat_and_set_tingkat(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);
        $surat = SuratMasuk::query()->create([
            'no_surat' => 'TEST/REVIEW/2026',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas Test',
            'perihal' => 'Uji review',
            'status' => SuratMasuk::STATUS_DRAFT,
            'tujuan' => '-',
            'file' => null,
        ]);

        $this->actingAs($sekdes)
            ->patch(route('admin.surat-masuk.review-sekdes', ['surat_masuk' => $surat->id]), [
                'tingkat' => 'penting',
            ])
            ->assertRedirect();

        $fresh = $surat->fresh();
        $this->assertSame(SuratMasuk::STATUS_TERVERIFIKASI, $fresh->status);
        $this->assertSame(SuratMasuk::TINGKAT_PENTING, $fresh->tingkat);
        $this->assertNotNull($fresh->verified_sekdes_at);
    }
}
