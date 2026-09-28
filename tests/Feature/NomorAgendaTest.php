<?php

namespace Tests\Feature;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NomorAgendaTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_assigns_monthly_agenda_number(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->post(route('admin.surat-masuk.store'), [
            'no_surat' => '470.1/001/I/2026',
            'tanggal_terima' => '2026-01-15',
            'tanggal_surat' => '2026-01-10',
            'pengirim' => 'Camat',
            'perihal' => 'Undangan',
            'tujuan' => '-',
        ])->assertRedirect();

        $this->actingAs($admin)->post(route('admin.surat-masuk.store'), [
            'no_surat' => '470.1/002/I/2026',
            'tanggal_terima' => '2026-01-20',
            'tanggal_surat' => '2026-01-18',
            'pengirim' => 'Dinas',
            'perihal' => 'Edaran',
            'tujuan' => '-',
        ])->assertRedirect();

        $this->actingAs($admin)->post(route('admin.surat-masuk.store'), [
            'no_surat' => '470.1/003/II/2026',
            'tanggal_terima' => '2026-02-02',
            'tanggal_surat' => '2026-02-01',
            'pengirim' => 'BPD',
            'perihal' => 'Laporan',
            'tujuan' => '-',
        ])->assertRedirect();

        $numbers = SuratMasuk::query()->orderBy('id')->pluck('nomor_agenda')->all();

        $this->assertSame([
            'SM/2026/01/0001',
            'SM/2026/01/0002',
            'SM/2026/02/0001',
        ], $numbers);
    }

    public function test_create_page_previews_next_agenda_number_without_inserting(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $prefix = now()->format('Y/m');

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('nomorAgendaPreview', "SM/{$prefix}/0001"));

        $this->assertSame(0, SuratMasuk::query()->count());

        SuratMasuk::query()->create([
            'no_surat' => 'PREVIEW/1',
            'tanggal_terima' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Pertama',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('nomorAgendaPreview', "SM/{$prefix}/0002"));

        $this->assertSame(1, SuratMasuk::query()->count());
    }

    public function test_create_preview_follows_the_selected_receipt_month(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => 'JAN/1',
            'tanggal_terima' => '2026-01-10',
            'pengirim' => 'Camat',
            'perihal' => 'Januari',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        $before = SuratMasuk::query()->count();

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.create', ['tanggal_terima' => '2026-01-20']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('nomorAgendaPreview', 'SM/2026/01/0002'));

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.create', ['tanggal_terima' => '2026-03-02']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('nomorAgendaPreview', 'SM/2026/03/0001'));

        $this->assertSame($before, SuratMasuk::query()->count());
    }

    public function test_store_uses_next_when_preview_is_already_taken(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.create', ['tanggal_terima' => '2026-09-01']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('nomorAgendaPreview', 'SM/2026/09/0001'));

        SuratMasuk::query()->create([
            'no_surat' => 'LAIN/1',
            'tanggal_terima' => '2026-09-02',
            'pengirim' => 'Dinas',
            'perihal' => 'Lebih dulu',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)->post(route('admin.surat-masuk.store'), [
            'no_surat' => 'BARU/1',
            'tanggal_terima' => '2026-09-10',
            'tanggal_surat' => '2026-09-09',
            'pengirim' => 'Camat',
            'perihal' => 'Setelah preview',
            'tujuan' => '-',
        ])->assertRedirect();

        $this->assertSame(
            'SM/2026/09/0002',
            SuratMasuk::query()->where('no_surat', 'BARU/1')->value('nomor_agenda'),
        );
    }

    public function test_year_prefix_binary_search_returns_the_whole_year_before_month_filter(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => 'A/2025',
            'tanggal_terima' => '2025-12-01',
            'pengirim' => 'Camat',
            'perihal' => 'Lama',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => 'B/2026-01',
            'tanggal_terima' => '2026-01-05',
            'pengirim' => 'Kecamatan Cimerak',
            'perihal' => 'Undangan',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => 'C/2026-03',
            'tanggal_terima' => '2026-03-05',
            'pengirim' => 'Dinas',
            'perihal' => 'Edaran',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index', ['tahun' => 2026]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 2)
            );

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index', ['tahun' => 2026, 'bulan' => 1]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 1)
                ->where('letters.data.0.nomor_agenda', 'SM/2026/01/0001')
            );

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index', [
                'tahun' => 2026,
                'pengirim' => 'Kecamatan',
            ]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 1)
                ->where('letters.data.0.no_surat', 'B/2026-01')
            );
    }

    public function test_nomor_surat_like_without_year_does_not_run_as_agenda_search(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => '145/001/I/2026',
            'tanggal_terima' => '2026-01-05',
            'pengirim' => 'Camat',
            'perihal' => 'Undangan rapat',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index', ['search' => '145/']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('letters.data', 1));

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index', ['search' => 'Undangan']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 1)
                ->where('letters.data.0.no_surat', '145/001/I/2026')
            );
    }

    public function test_nomor_surat_like_with_year_only_filters_binary_search_results(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SuratMasuk::query()->create([
            'no_surat' => '145/001/I/2025',
            'tanggal_terima' => '2025-01-05',
            'pengirim' => 'Camat',
            'perihal' => 'Lama',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        SuratMasuk::query()->create([
            'no_surat' => '145/009/I/2026',
            'tanggal_terima' => '2026-01-05',
            'pengirim' => 'Camat',
            'perihal' => 'Baru',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.index', ['tahun' => 2026, 'search' => '145/']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 1)
                ->where('letters.data.0.nomor_agenda', 'SM/2026/01/0001')
            );
    }

    public function test_surat_keluar_uses_separate_sequence(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->post(route('admin.surat-keluar.store'), [
            'nomor_surat' => '145/001/I/2026',
            'tanggal_kirim' => '2026-03-04',
            'tujuan' => 'Camat',
            'perihal' => 'Tugas',
        ])->assertRedirect();

        $this->assertSame('SK/2026/03/0001', SuratKeluar::query()->value('nomor_agenda'));
    }

    public function test_update_does_not_change_agenda_number_when_date_changes(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $letter = SuratMasuk::query()->create([
            'no_surat' => '470.1/010/I/2026',
            'tanggal_terima' => '2026-01-05',
            'tanggal_surat' => '2026-01-04',
            'pengirim' => 'Camat',
            'perihal' => 'Undangan',
            'status' => 'draft',
            'tujuan' => '-',
        ]);

        $this->actingAs($admin)->put(route('admin.surat-masuk.update', $letter), [
            'no_surat' => $letter->no_surat,
            'tanggal_terima' => '2026-05-01',
            'tanggal_surat' => '2026-01-04',
            'pengirim' => 'Camat',
            'perihal' => 'Undangan diubah',
            'tujuan' => '-',
        ])->assertRedirect();

        $this->assertSame('SM/2026/01/0001', $letter->fresh()->nomor_agenda);
    }

    public function test_full_agenda_number_matches_exactly_inside_binary_search_results(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $archived = [
            ['no_surat' => 'A/2026-08-01', 'nomor_agenda' => 'SM/2026/08/0001', 'tanggal_terima' => '2026-08-01', 'perihal' => 'Awal'],
            ['no_surat' => 'B/2026-08-05', 'nomor_agenda' => 'SM/2026/08/0005', 'tanggal_terima' => '2026-08-05', 'perihal' => 'Target'],
            ['no_surat' => 'C/2025-08-05', 'nomor_agenda' => 'SM/2025/08/0005', 'tanggal_terima' => '2025-08-05', 'perihal' => 'Tahun lain'],
        ];

        foreach ($archived as $row) {
            SuratMasuk::query()->create([
                ...$row,
                'pengirim' => 'Camat',
                'status' => 'diarsipkan',
                'tujuan' => '-',
                'diarsipkan_at' => '2026-09-01 08:00:00',
            ]);
        }

        $this->actingAs($admin)
            ->get(route('admin.arsip-surat.index', [
                'jenis' => 'masuk',
                'tahun' => 2026,
                'bulan' => 8,
                'nomor_agenda' => 'SM/2026/08/0005',
            ]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 1)
                ->where('letters.data.0.nomor_agenda', 'SM/2026/08/0005')
                ->where('filters.nomor_agenda', 'SM/2026/08/0005')
            );

        $this->actingAs($admin)
            ->get(route('admin.arsip-surat.index', [
                'jenis' => 'masuk',
                'tahun' => 2026,
                'nomor_agenda' => 'SM/2026/08/000',
            ]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('letters.data', 0));

        $this->actingAs($admin)
            ->get(route('admin.arsip-surat.index', [
                'nomor_agenda' => 'SM/2026/08/0005',
            ]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 3)
                ->where('filters.nomor_agenda', null)
            );
    }

    public function test_metadata_filters_without_year_do_not_run_binary_search(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $rows = [
            [
                'no_surat' => 'META/2026',
                'nomor_agenda' => 'SM/2026/03/0001',
                'tanggal_terima' => '2026-03-04',
                'tanggal_surat' => '2026-03-04',
                'pengirim' => 'Kecamatan Cimerak',
                'perihal' => 'Undangan rapat',
                'diarsipkan_at' => '2026-04-01 08:00:00',
            ],
            [
                'no_surat' => 'META/2025',
                'nomor_agenda' => 'SM/2025/03/0001',
                'tanggal_terima' => '2025-03-04',
                'tanggal_surat' => '2025-03-04',
                'pengirim' => 'Dinas',
                'perihal' => 'Undangan rapat',
                'diarsipkan_at' => '2025-04-01 08:00:00',
            ],
            [
                'no_surat' => 'META/LAIN',
                'nomor_agenda' => 'SM/2026/03/0002',
                'tanggal_terima' => '2026-03-10',
                'tanggal_surat' => '2026-03-10',
                'pengirim' => 'BPD',
                'perihal' => 'Laporan',
                'diarsipkan_at' => '2026-04-02 08:00:00',
            ],
        ];

        foreach ($rows as $row) {
            SuratMasuk::query()->create([
                ...$row,
                'status' => 'diarsipkan',
                'tujuan' => '-',
            ]);
        }

        $this->actingAs($admin)
            ->get(route('admin.arsip-surat.index', ['perihal' => 'Undangan']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 2)
                ->where('filters.tahun', null)
            );

        $this->actingAs($admin)
            ->get(route('admin.arsip-surat.index', ['pihak' => 'Kecamatan']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 1)
                ->where('letters.data.0.no_surat', 'META/2026')
            );

        $this->actingAs($admin)
            ->get(route('admin.arsip-surat.index', ['tanggal' => '2026-03-04']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 1)
                ->where('letters.data.0.no_surat', 'META/2026')
            );

        $this->actingAs($admin)
            ->get(route('admin.arsip-surat.index', ['bulan' => 3]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('letters.data', 3));
    }

    public function test_metadata_narrows_binary_search_results_without_changing_sort_order(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $rows = [
            [
                'no_surat' => 'URUT/LAMA',
                'nomor_agenda' => 'SM/2025/01/0001',
                'tanggal_terima' => '2025-01-05',
                'perihal' => 'Undangan',
                'diarsipkan_at' => '2026-09-03 08:00:00',
            ],
            [
                'no_surat' => 'URUT/AWAL',
                'nomor_agenda' => 'SM/2026/01/0001',
                'tanggal_terima' => '2026-01-05',
                'perihal' => 'Undangan',
                'diarsipkan_at' => '2026-02-01 08:00:00',
            ],
            [
                'no_surat' => 'URUT/AKHIR',
                'nomor_agenda' => 'SM/2026/06/0001',
                'tanggal_terima' => '2026-06-05',
                'perihal' => 'Undangan',
                'diarsipkan_at' => '2026-07-01 08:00:00',
            ],
            [
                'no_surat' => 'URUT/LAIN',
                'nomor_agenda' => 'SM/2026/06/0002',
                'tanggal_terima' => '2026-06-06',
                'perihal' => 'Laporan',
                'diarsipkan_at' => '2026-08-01 08:00:00',
            ],
        ];

        foreach ($rows as $row) {
            SuratMasuk::query()->create([
                ...$row,
                'pengirim' => 'Camat',
                'status' => 'diarsipkan',
                'tujuan' => '-',
            ]);
        }

        $this->actingAs($admin)
            ->get(route('admin.arsip-surat.index', [
                'jenis' => 'masuk',
                'tahun' => 2026,
                'perihal' => 'Undangan',
            ]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('letters.data', 2)
                ->where('letters.data.0.no_surat', 'URUT/AKHIR')
                ->where('letters.data.1.no_surat', 'URUT/AWAL')
            );
    }
}
