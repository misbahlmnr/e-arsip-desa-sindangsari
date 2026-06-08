<?php

namespace App\Services;

use App\Http\Requests\SuratKeluar\StoreRequest;
use App\Http\Requests\SuratKeluar\UpdateRequest;
use App\Models\SuratKeluar;
use App\Services\Search\SuratNomorSearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SuratKeluarService
{
    public function __construct(private SuratNomorSearchService $nomorSearch) {}

    /**
     * Sortable columns (whitelist) — prevents arbitrary ORDER BY injection.
     *
     * @var list<string>
     */
    private const SORTABLE = [
        'id',
        'no_surat',
        'tanggal_kirim',
        'tujuan',
        'perihal',
        'created_at',
        'diarsipkan_at',
    ];

    public function index(Request $req)
    {
        $validated = $req->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'max:64'],
            'sort_dir' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'in:10,20,50,100'],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortBy = $validated['sort_by'] ?? 'tanggal_kirim';
        $sortDir = $validated['sort_dir'] ?? 'desc';

        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'tanggal_kirim';
        }

        $query = SuratKeluar::query()->whereNull('diarsipkan_at');

        $matchingIds = $this->nomorSearch->matchingIds(clone $query, $search);

        if ($matchingIds !== null) {
            if ($matchingIds === []) {
                $query->whereRaw('0 = 1');
            } else {
                $query->whereIn('id', $matchingIds);
            }
        }

        $query->orderBy($sortBy, $sortDir);

        $letters = $query->paginate($perPage)->withQueryString();

        return [
            'letters' => $letters,
            'filters' => [
                'search' => $search !== '' ? $search : null,
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
                'per_page' => $perPage,
            ],
        ];
    }

    private function handleFile(Request $req)
    {
        if ($req->hasFile('file')) {
            return $req->file('file')->store('surat-keluar', 'public');
        }

        return null;
    }

    public function store(StoreRequest $req)
    {
        try {
            $data = $req->validated();
            $filePath = $this->handleFile($req);

            if ($filePath) {
                $data['file'] = $filePath;
            }

            return SuratKeluar::create($data);
        } catch (\Exception $e) {
            Log::error('Error storing surat keluar: '.$e->getMessage());
            throw $e;
        }
    }

    public function update(UpdateRequest $req, SuratKeluar $surat_keluar)
    {
        try {
            $data = $req->validated();
            $filePath = $this->handleFile($req);

            if ($filePath) {
                if ($surat_keluar->file && Storage::disk('public')->exists($surat_keluar->file)) {
                    Storage::disk('public')->delete($surat_keluar->file);
                }
                $data['file'] = $filePath;
            } else {
                unset($data['file']);
            }

            return $surat_keluar->update($data);
        } catch (\Exception $e) {
            Log::error('Error updating surat keluar: '.$e->getMessage());
            throw $e;
        }
    }

    public function destroy(SuratKeluar $surat_keluar)
    {
        try {
            if ($surat_keluar->file && Storage::disk('public')->exists($surat_keluar->file)) {
                Storage::disk('public')->delete($surat_keluar->file);
            }

            return $surat_keluar->delete();
        } catch (\Exception $e) {
            Log::error('Error deleting surat keluar: '.$e->getMessage());
            throw $e;
        }
    }

    public function archive(SuratKeluar $surat_keluar): void
    {
        $surat_keluar->update(['diarsipkan_at' => now()]);
    }

    public function unarchive(SuratKeluar $surat_keluar): void
    {
        $surat_keluar->update(['diarsipkan_at' => null]);
    }
}
