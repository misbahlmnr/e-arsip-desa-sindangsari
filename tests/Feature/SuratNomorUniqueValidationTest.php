<?php

namespace Tests\Feature;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SuratNomorUniqueValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_surat_keluar_store_allows_missing_file(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('admin.surat-keluar.store'), [
                'nomor_surat' => '145/099/IX/2026',
                'tanggal_kirim' => now()->toDateString(),
                'tujuan' => 'Kecamatan Cimerak',
                'perihal' => 'Surat tanpa lampiran',
            ])
            ->assertRedirect(route('admin.surat-keluar.index'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('surat_keluar', [
            'no_surat' => '145/099/IX/2026',
            'file' => null,
        ]);
    }

    public function test_surat_keluar_store_rejects_duplicate_no_surat_with_error(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);

        SuratKeluar::query()->create([
            'no_surat' => '145/001/I/2026',
            'tanggal_kirim' => now()->toDateString(),
            'tujuan' => 'Camat',
            'perihal' => 'Sudah ada',
            'file' => 'surat-keluar/existing.pdf',
        ]);

        $this->actingAs($admin)
            ->post(route('admin.surat-keluar.store'), [
                'nomor_surat' => '145/001/I/2026',
                'tanggal_kirim' => now()->toDateString(),
                'tujuan' => 'BPD',
                'perihal' => 'Duplikat',
                'file' => UploadedFile::fake()->create('baru.pdf', 100, 'application/pdf'),
            ])
            ->assertSessionHasErrors('no_surat');
    }

    public function test_surat_masuk_store_rejects_duplicate_no_surat_with_error(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => '470.1/001/I/2026',
            'tanggal_terima' => now()->toDateString(),
            'tanggal_surat' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Sudah ada',
            'status' => SuratMasuk::STATUS_DRAFT,
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->post(route('admin.surat-masuk.store'), [
                'nomor_surat' => '470.1/001/I/2026',
                'tanggal_diterima' => now()->toDateString(),
                'tanggal_surat' => now()->toDateString(),
                'pengirim' => 'Dinas',
                'perihal' => 'Duplikat',
                'tujuan' => '-',
            ])
            ->assertSessionHasErrors('no_surat');
    }

    public function test_surat_keluar_unarchive_redirects_to_show(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $surat = SuratKeluar::query()->create([
            'no_surat' => '145/002/I/2026',
            'tanggal_kirim' => now()->toDateString(),
            'tujuan' => 'Camat',
            'perihal' => 'Arsip',
            'file' => 'surat-keluar/arsip.pdf',
            'diarsipkan_at' => now(),
        ]);

        $this->actingAs($admin)
            ->from(route('admin.arsip-surat.show', ['jenis' => 'keluar', 'id' => $surat->id]))
            ->patch(route('admin.surat-keluar.unarchive', ['surat_keluar' => $surat->id]))
            ->assertRedirect(route('admin.surat-keluar.show', $surat))
            ->assertSessionHas('success');

        $this->assertNull($surat->fresh()->diarsipkan_at);
    }
}
