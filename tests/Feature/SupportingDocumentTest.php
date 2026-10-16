<?php

namespace Tests\Feature;

use App\Models\SupportingDocument;
use App\Models\SuratMasuk;
use App\Models\User;
use App\Services\Search\SuratNomorSearchService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Tests\TestCase;

class SupportingDocumentTest extends TestCase
{
    use RefreshDatabase;

    private static bool $failSupportingCreate = false;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        SupportingDocument::creating(function () {
            if (self::$failSupportingCreate) {
                throw new RuntimeException('gagal simpan');
            }
        });
    }

    public function test_admin_can_upload_many_supporting_documents(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('admin.surat-masuk.store'), $this->payload([
                'supporting_files' => [
                    UploadedFile::fake()->create('ba.pdf', 100, 'application/pdf'),
                    UploadedFile::fake()->create('foto.jpg', 80, 'image/jpeg'),
                    UploadedFile::fake()->create('draft.docx', 90, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
                ],
            ]))
            ->assertRedirect(route('admin.surat-masuk.index'));

        $letter = SuratMasuk::query()->firstOrFail();
        $documents = $letter->supportingDocuments()->orderBy('sort_order')->get();

        $this->assertCount(3, $documents);
        $this->assertSame([1, 2, 3], $documents->pluck('sort_order')->all());
        $this->assertSame('ba.pdf', $documents[0]->original_name);
        $documents->each(fn (SupportingDocument $document) => Storage::disk('public')->assertExists($document->file_path));
    }

    public function test_edit_can_add_supporting_documents(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $letter = $this->createLetter();

        $this->actingAs($admin)
            ->put(route('admin.surat-masuk.update', $letter), $this->updatePayload($letter, [
                'supporting_files' => [
                    UploadedFile::fake()->create('tambahan.pdf', 50, 'application/pdf'),
                ],
            ]))
            ->assertRedirect(route('admin.surat-masuk.index'));

        $this->assertSame(1, $letter->supportingDocuments()->count());
    }

    public function test_removing_one_supporting_document_keeps_main_file(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $letter = $this->createLetter([
            'file' => UploadedFile::fake()->create('utama.pdf', 40, 'application/pdf')->store('surat-masuk', 'public'),
        ]);
        $document = SupportingDocument::query()->create([
            'surat_masuk_id' => $letter->id,
            'sort_order' => 1,
            'original_name' => 'dukung.pdf',
            'file_name' => 'dukung.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 100,
            'file_path' => UploadedFile::fake()->create('dukung.pdf', 20, 'application/pdf')->store('supporting-documents', 'public'),
            'uploaded_by' => $admin->id,
        ]);
        $mainPath = $letter->file;

        $this->actingAs($admin)
            ->put(route('admin.surat-masuk.update', $letter), $this->updatePayload($letter, [
                'remove_supporting_ids' => [$document->id],
            ]))
            ->assertRedirect(route('admin.surat-masuk.index'));

        $letter->refresh();
        $this->assertSame($mainPath, $letter->file);
        Storage::disk('public')->assertExists($mainPath);
        Storage::disk('public')->assertMissing($document->file_path);
        $this->assertDatabaseMissing('supporting_documents', ['id' => $document->id]);
    }

    public function test_deleting_letter_removes_supporting_records_and_files(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $mainPath = UploadedFile::fake()->create('utama.pdf', 40, 'application/pdf')->store('surat-masuk', 'public');
        $supportPath = UploadedFile::fake()->create('dukung.pdf', 20, 'application/pdf')->store('supporting-documents', 'public');
        $letter = $this->createLetter(['file' => $mainPath]);
        SupportingDocument::query()->create([
            'surat_masuk_id' => $letter->id,
            'sort_order' => 1,
            'original_name' => 'dukung.pdf',
            'file_name' => 'dukung.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 100,
            'file_path' => $supportPath,
            'uploaded_by' => $admin->id,
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.surat-masuk.destroy', $letter))
            ->assertRedirect(route('admin.surat-masuk.index'));

        $this->assertDatabaseMissing('surat_masuk', ['id' => $letter->id]);
        $this->assertDatabaseCount('supporting_documents', 0);
        Storage::disk('public')->assertMissing($mainPath);
        Storage::disk('public')->assertMissing($supportPath);
    }

    public function test_failed_save_rolls_back_and_deletes_new_files(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        self::$failSupportingCreate = true;

        try {
            $this->actingAs($admin)
                ->post(route('admin.surat-masuk.store'), $this->payload([
                    'file' => UploadedFile::fake()->create('utama.pdf', 40, 'application/pdf'),
                    'supporting_files' => [
                        UploadedFile::fake()->create('dukung.pdf', 20, 'application/pdf'),
                    ],
                ]))
                ->assertStatus(500);
        } finally {
            self::$failSupportingCreate = false;
        }

        $this->assertDatabaseCount('surat_masuk', 0);
        $this->assertDatabaseCount('supporting_documents', 0);
        $this->assertSame([], Storage::disk('public')->allFiles());
    }

    public function test_cannot_remove_supporting_document_from_another_letter(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $letter = $this->createLetter();
        $other = $this->createLetter(['no_surat' => '470.1/099/I/2026']);
        $document = SupportingDocument::query()->create([
            'surat_masuk_id' => $other->id,
            'sort_order' => 1,
            'original_name' => 'milik-lain.pdf',
            'file_name' => 'milik-lain.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 100,
            'file_path' => 'supporting-documents/milik-lain.pdf',
            'uploaded_by' => $admin->id,
        ]);

        $this->actingAs($admin)
            ->from(route('admin.surat-masuk.edit', $letter))
            ->put(route('admin.surat-masuk.update', $letter), $this->updatePayload($letter, [
                'remove_supporting_ids' => [$document->id],
            ]))
            ->assertSessionHasErrors('remove_supporting_ids');

        $this->assertDatabaseHas('supporting_documents', ['id' => $document->id]);
    }

    public function test_eleventh_file_in_one_request_is_rejected(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $files = [];
        for ($i = 0; $i < 11; $i++) {
            $files[] = UploadedFile::fake()->create("file-{$i}.pdf", 10, 'application/pdf');
        }

        $this->actingAs($admin)
            ->from(route('admin.surat-masuk.create'))
            ->post(route('admin.surat-masuk.store'), $this->payload([
                'supporting_files' => $files,
            ]))
            ->assertSessionHasErrors('supporting_files');

        $this->assertDatabaseCount('supporting_documents', 0);
    }

    public function test_file_beyond_ten_existing_documents_is_rejected(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $letter = $this->createLetter();

        for ($i = 1; $i <= 10; $i++) {
            SupportingDocument::query()->create([
                'surat_masuk_id' => $letter->id,
                'sort_order' => $i,
                'original_name' => "ada-{$i}.pdf",
                'file_name' => "ada-{$i}.pdf",
                'mime_type' => 'application/pdf',
                'file_size' => 10,
                'file_path' => "supporting-documents/ada-{$i}.pdf",
                'uploaded_by' => $admin->id,
            ]);
        }

        $this->actingAs($admin)
            ->from(route('admin.surat-masuk.edit', $letter))
            ->put(route('admin.surat-masuk.update', $letter), $this->updatePayload($letter, [
                'supporting_files' => [
                    UploadedFile::fake()->create('kelebihan.pdf', 10, 'application/pdf'),
                ],
            ]))
            ->assertSessionHasErrors('supporting_files');

        $this->assertSame(10, $letter->supportingDocuments()->count());
    }

    public function test_prefix_search_matches_agenda_year(): void
    {
        $letter = $this->createLetter([
            'no_surat' => '470.1/022/IX/2026',
            'tanggal_terima' => '2026-09-01',
        ]);

        $ids = app(SuratNomorSearchService::class)->matchingIds(
            SuratMasuk::query(),
            'SM/2026',
        );

        $this->assertSame([$letter->id], $ids);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'no_surat' => '470.1/001/I/2026',
            'tanggal_terima' => now()->toDateString(),
            'tanggal_surat' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Undangan',
            'tujuan' => '-',
        ], $overrides);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createLetter(array $overrides = []): SuratMasuk
    {
        return SuratMasuk::query()->create(array_merge([
            'no_surat' => '470.1/001/I/2026',
            'tanggal_terima' => now()->toDateString(),
            'tanggal_surat' => now()->toDateString(),
            'pengirim' => 'Camat',
            'perihal' => 'Undangan',
            'status' => SuratMasuk::STATUS_DRAFT,
            'tujuan' => '-',
        ], $overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function updatePayload(SuratMasuk $letter, array $overrides = []): array
    {
        return array_merge([
            'no_surat' => $letter->no_surat,
            'tanggal_terima' => $letter->tanggal_terima->toDateString(),
            'tanggal_surat' => $letter->tanggal_surat?->toDateString(),
            'pengirim' => $letter->pengirim,
            'perihal' => $letter->perihal,
            'tujuan' => $letter->tujuan ?? '-',
        ], $overrides);
    }
}
