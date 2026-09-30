<?php

namespace App\Services;

use App\Models\SupportingDocument;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class SupportingDocumentService
{
    public const MAX_PER_LETTER = 10;

    /**
     * @param  list<UploadedFile|null>  $files
     * @return list<string> path file yang baru tersimpan
     */
    public function storeMany(Model $letter, array $files, ?int $uploadedBy): array
    {
        $files = array_values(array_filter($files));

        if ($files === []) {
            return [];
        }

        $paths = [];

        try {
            $sortOrder = (int) $this->queryFor($letter)->max('sort_order');

            foreach ($files as $file) {
                $path = $file->store('supporting-documents', 'public');
                $paths[] = $path;
                $sortOrder++;

                SupportingDocument::query()->create([
                    'surat_masuk_id' => $letter instanceof SuratMasuk ? $letter->id : null,
                    'surat_keluar_id' => $letter instanceof SuratKeluar ? $letter->id : null,
                    'sort_order' => $sortOrder,
                    'original_name' => $file->getClientOriginalName(),
                    'file_name' => basename($path),
                    'mime_type' => $file->getClientMimeType(),
                    'file_size' => (int) $file->getSize(),
                    'file_path' => $path,
                    'uploaded_by' => $uploadedBy,
                ]);
            }

            return $paths;
        } catch (\Throwable $e) {
            $this->deleteStoredPaths($paths);

            throw $e;
        }
    }

    /**
     * Hapus record dokumen. Path file dikembalikan agar dihapus setelah transaksi berhasil.
     *
     * @param  list<int>  $ids
     * @return list<string>
     */
    public function deleteMany(Model $letter, array $ids): array
    {
        $ids = array_values(array_unique(array_map('intval', array_filter($ids))));

        if ($ids === []) {
            return [];
        }

        $documents = $this->queryFor($letter)->whereIn('id', $ids)->get();

        if ($documents->count() !== count($ids)) {
            throw ValidationException::withMessages([
                'remove_supporting_ids' => 'Dokumen pendukung tidak ditemukan pada surat ini.',
            ]);
        }

        $paths = $documents->pluck('file_path')->filter()->values()->all();
        $this->queryFor($letter)->whereIn('id', $ids)->delete();

        return $paths;
    }

    /**
     * @return list<string>
     */
    public function deleteAllForLetter(Model $letter): array
    {
        $documents = $this->queryFor($letter)->get();
        $paths = $documents->pluck('file_path')->filter()->values()->all();
        $this->queryFor($letter)->delete();

        return $paths;
    }

    /**
     * @return Collection<int, SupportingDocument>
     */
    public function getForLetter(Model $letter): Collection
    {
        return $this->queryFor($letter)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    /**
     * @param  list<string|null>  $paths
     */
    public function deleteStoredPaths(array $paths): void
    {
        foreach ($paths as $path) {
            if (! is_string($path) || $path === '') {
                continue;
            }

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }
    }

    /**
     * @return Builder<SupportingDocument>
     */
    private function queryFor(Model $letter): Builder
    {
        if ($letter instanceof SuratMasuk) {
            return SupportingDocument::query()
                ->where('surat_masuk_id', $letter->id)
                ->whereNull('surat_keluar_id');
        }

        if ($letter instanceof SuratKeluar) {
            return SupportingDocument::query()
                ->where('surat_keluar_id', $letter->id)
                ->whereNull('surat_masuk_id');
        }

        throw new InvalidArgumentException('Surat tidak dikenali.');
    }
}
