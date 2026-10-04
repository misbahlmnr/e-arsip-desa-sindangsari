<?php

namespace Tests\Feature;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BulkArchiveTest extends TestCase
{
    use RefreshDatabase;

    private function suratMasuk(array $overrides = []): SuratMasuk
    {
        return SuratMasuk::query()->create(array_merge([
            'no_surat' => 'TEST/'.uniqid(),
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Dinas Test',
            'perihal' => 'Uji arsip massal',
            'status' => SuratMasuk::STATUS_DIDISPOSISIKAN,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'tujuan' => '-',
            'file' => null,
        ], $overrides));
    }

    private function suratKeluar(array $overrides = []): SuratKeluar
    {
        return SuratKeluar::query()->create(array_merge([
            'no_surat' => 'SK/'.uniqid(),
            'nomor_agenda' => 'K/'.uniqid(),
            'tanggal_kirim' => now()->toDateString(),
            'tujuan' => 'Camat',
            'perihal' => 'Uji arsip massal',
            'file' => null,
        ], $overrides));
    }

    public function test_bulk_archive_surat_masuk_matches_detail_archive(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $viaDetail = $this->suratMasuk();
        $viaBulk = $this->suratMasuk();
        $blocked = $this->suratMasuk([
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.surat-masuk.archive', ['surat_masuk' => $viaDetail->id]))
            ->assertRedirect()
            ->assertSessionHas('success', 'Surat masuk berhasil diarsipkan.');

        $this->actingAs($admin)
            ->patch(route('admin.surat-masuk.archive-selected'), [
                'ids' => [$viaBulk->id, $blocked->id],
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $summary = session('success');
        $this->assertStringContainsString('1 surat berhasil diarsipkan.', $summary);
        $this->assertStringContainsString('1 surat dilewati:', $summary);
        $this->assertStringContainsString(
            'Surat harus didisposisikan terlebih dahulu sebelum diarsipkan.',
            $summary,
        );

        $detail = $viaDetail->fresh();
        $bulk = $viaBulk->fresh();
        $this->assertNotNull($detail->diarsipkan_at);
        $this->assertNotNull($bulk->diarsipkan_at);
        $this->assertSame(SuratMasuk::STATUS_DIARSIPKAN, $detail->status);
        $this->assertSame(SuratMasuk::STATUS_DIARSIPKAN, $bulk->status);
        $this->assertSame($detail->status, $bulk->status);
        $this->assertNull($blocked->fresh()->diarsipkan_at);
        $this->assertSame(SuratMasuk::STATUS_TERVERIFIKASI, $blocked->fresh()->status);
    }

    public function test_bulk_archive_surat_masuk_skips_with_detail_reason_when_none_succeed(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $alreadyArchived = $this->suratMasuk([
            'status' => SuratMasuk::STATUS_DIARSIPKAN,
            'diarsipkan_at' => now(),
        ]);
        $notReady = $this->suratMasuk([
            'status' => SuratMasuk::STATUS_DRAFT,
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.surat-masuk.archive-selected'), [
                'ids' => [$alreadyArchived->id, $notReady->id],
            ])
            ->assertRedirect()
            ->assertSessionHas('error');

        $summary = session('error');
        $this->assertStringContainsString('2 surat dilewati:', $summary);
        $this->assertStringContainsString('Surat ini sudah berada di arsip.', $summary);
        $this->assertStringContainsString(
            'Surat harus didisposisikan terlebih dahulu sebelum diarsipkan.',
            $summary,
        );
        $this->assertNull($notReady->fresh()->diarsipkan_at);
    }

    public function test_sekdes_cannot_bulk_archive_surat_masuk(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);
        $surat = $this->suratMasuk();

        $this->actingAs($sekdes)
            ->patch(route('admin.surat-masuk.archive-selected'), [
                'ids' => [$surat->id],
            ])
            ->assertForbidden();

        $this->assertNull($surat->fresh()->diarsipkan_at);
    }

    public function test_bulk_archive_surat_keluar_matches_detail_archive(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $viaDetail = $this->suratKeluar();
        $viaBulk = $this->suratKeluar();
        $alreadyArchived = $this->suratKeluar([
            'diarsipkan_at' => now(),
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.surat-keluar.archive', ['surat_keluar' => $viaDetail->id]))
            ->assertRedirect()
            ->assertSessionHas('success', 'Surat keluar berhasil diarsipkan.');

        $this->actingAs($admin)
            ->patch(route('admin.surat-keluar.archive-selected'), [
                'ids' => [$viaBulk->id, $alreadyArchived->id],
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $summary = session('success');
        $this->assertStringContainsString('1 surat berhasil diarsipkan.', $summary);
        $this->assertStringContainsString('1 surat dilewati:', $summary);
        $this->assertStringContainsString('Surat ini sudah berada di arsip.', $summary);

        $this->assertNotNull($viaDetail->fresh()->diarsipkan_at);
        $this->assertNotNull($viaBulk->fresh()->diarsipkan_at);
        $this->assertNotNull($alreadyArchived->fresh()->diarsipkan_at);
    }
}
