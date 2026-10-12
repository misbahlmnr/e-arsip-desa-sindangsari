<?php

namespace Tests\Feature;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SuratIndexOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_surat_masuk_with_the_same_sort_value_orders_newer_id_first(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $older = $this->createSuratMasuk('SM-ORDER-1', '2026-10-11');
        $newer = $this->createSuratMasuk('SM-ORDER-2', '2026-10-11');
        $earlierDate = $this->createSuratMasuk('SM-ORDER-3', '2026-10-01');

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index', [
                'sort_by' => 'tanggal_terima',
                'sort_dir' => 'desc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('letters.data.0.id', $newer->id)
                ->where('letters.data.1.id', $older->id)
                ->where('letters.data.2.id', $earlierDate->id)
            );
    }

    public function test_surat_keluar_with_the_same_sort_value_orders_newer_id_first(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $older = $this->createSuratKeluar('SK-ORDER-1', '2026-10-11');
        $newer = $this->createSuratKeluar('SK-ORDER-2', '2026-10-11');
        $earlierDate = $this->createSuratKeluar('SK-ORDER-3', '2026-10-01');

        $this->actingAs($admin)
            ->get(route('admin.surat-keluar.index', [
                'sort_by' => 'tanggal_kirim',
                'sort_dir' => 'desc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('letters.data.0.id', $newer->id)
                ->where('letters.data.1.id', $older->id)
                ->where('letters.data.2.id', $earlierDate->id)
            );
    }

    private function createSuratMasuk(string $noSurat, string $tanggal): SuratMasuk
    {
        return SuratMasuk::query()->create([
            'no_surat' => $noSurat,
            'tanggal_terima' => $tanggal,
            'pengirim' => 'Dinas Test',
            'perihal' => 'Uji urutan',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'tujuan' => '-',
        ]);
    }

    private function createSuratKeluar(string $noSurat, string $tanggal): SuratKeluar
    {
        return SuratKeluar::query()->create([
            'no_surat' => $noSurat,
            'tanggal_kirim' => $tanggal,
            'tujuan' => 'BPD',
            'perihal' => 'Uji urutan',
            'file' => 'surat-keluar/uji.pdf',
        ]);
    }
}
