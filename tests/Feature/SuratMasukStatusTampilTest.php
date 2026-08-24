<?php

namespace Tests\Feature;

use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SuratMasukStatusTampilTest extends TestCase
{
    use RefreshDatabase;

    public function test_status_tampil_for_each_workflow_stage(): void
    {
        $draft = SuratMasuk::query()->create([
            'no_surat' => 'SM-ST-01',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Draft',
            'status' => SuratMasuk::STATUS_DRAFT,
            'tujuan' => '-',
        ]);
        $this->assertSame(
            SuratMasuk::STATUS_TAMPIL_MENUNGGU_REVIEW_SEKDES,
            $draft->status_tampil,
        );

        $biasa = SuratMasuk::query()->create([
            'no_surat' => 'SM-ST-02',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Biasa',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'tujuan' => '-',
        ]);
        $this->assertSame(
            SuratMasuk::STATUS_TAMPIL_DIREVIEW_SEKDES,
            $biasa->status_tampil,
        );

        $pentingMenunggu = SuratMasuk::query()->create([
            'no_surat' => 'SM-ST-03',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Penting menunggu',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'tujuan' => '-',
        ]);
        $this->assertSame(
            SuratMasuk::STATUS_TAMPIL_MENUNGGU_VERIFIKASI_KADES,
            $pentingMenunggu->status_tampil,
        );

        $kades = User::factory()->create(['role' => 'kades']);
        $pentingSiap = SuratMasuk::query()->create([
            'no_surat' => 'SM-ST-04',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Penting siap',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'verified_kades_at' => now(),
            'verified_kades_by' => $kades->id,
            'tujuan' => '-',
        ]);
        $this->assertSame(
            SuratMasuk::STATUS_TAMPIL_SIAP_DISPOSISI_KADES,
            $pentingSiap->status_tampil,
        );

        $didispos = SuratMasuk::query()->create([
            'no_surat' => 'SM-ST-05',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Didisposisi',
            'status' => SuratMasuk::STATUS_DIDISPOSISIKAN,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'tujuan' => '-',
        ]);
        $this->assertSame(
            SuratMasuk::STATUS_TAMPIL_DIDISPOSISIKAN,
            $didispos->status_tampil,
        );

        $arsip = SuratMasuk::query()->create([
            'no_surat' => 'SM-ST-06',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Arsip',
            'status' => SuratMasuk::STATUS_DIDISPOSISIKAN,
            'tingkat' => SuratMasuk::TINGKAT_BIASA,
            'diarsipkan_at' => now(),
            'tujuan' => '-',
        ]);
        $this->assertSame(
            SuratMasuk::STATUS_TAMPIL_DIARSIPKAN,
            $arsip->status_tampil,
        );
    }

    public function test_surat_masuk_index_includes_status_tampil(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => 'SM-ST-10',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Penting',
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'tingkat' => SuratMasuk::TINGKAT_PENTING,
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('letters.data', 1)
                ->where('letters.data.0.status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->where(
                    'letters.data.0.status_tampil',
                    SuratMasuk::STATUS_TAMPIL_MENUNGGU_VERIFIKASI_KADES,
                )
            );
    }
}
