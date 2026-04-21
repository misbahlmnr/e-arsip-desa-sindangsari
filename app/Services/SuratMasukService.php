<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use App\Http\Requests\SuratMasuk\{StoreRequest, UpdateRequest};
use Illuminate\Http\Request;
use App\Models\SuratMasuk;
use Illuminate\Support\Facades\Storage;

class SuratMasukService
{
    /**
     * Sortable columns (whitelist) — prevents arbitrary ORDER BY injection.
     *
     * @var list<string>
     */
    private const SORTABLE = [
        'id',
        'nomor_registrasi',
        'no_surat',
        'tanggal_terima',
        'pengirim',
        'perihal',
        'status',
        'tujuan',
        'created_at',
    ];

    public function index(Request $req) {
        $validated = $req->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'max:64'],
            'sort_dir' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'in:10,20,50,100'],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortBy = $validated['sort_by'] ?? 'tanggal_terima';
        $sortDir = $validated['sort_dir'] ?? 'desc';

        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'tanggal_terima';
        }

        $query = SuratMasuk::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $like = '%'.$search.'%';
                    $q->where('no_surat', 'like', $like)
                    ->orWhere('pengirim', 'like', $like)
                    ->orWhere('perihal', 'like', $like);
                });
            })
            ->orderBy($sortBy, $sortDir);

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

    private function handleFile(Request $req) {
        if ($req->hasFile('file')) {
            return $req->file('file')->store('surat-masuk', 'public');
        }
        return null;
    }
    
    public function store(StoreRequest $req) {
        try {
            $data = $req->validated();
            $filePath = $this->handleFile($req);
    
            if ($filePath) {
                $data['file'] = $filePath;
            }
    
            return SuratMasuk::create($data);
        } catch (\Exception $e) {
            Log::error('Error storing surat masuk: ' . $e->getMessage());
            throw $e;
        }
    }

    public function update(UpdateRequest $req, SuratMasuk $surat_masuk) {
        try {
            $data = $req->validated();
            $filePath = $this->handleFile($req);

            if ($filePath) {
                if ($surat_masuk->file && Storage::disk('public')->exists($surat_masuk->file)) {
                    Storage::disk('public')->delete($surat_masuk->file);
                }
                $data['file'] = $filePath;
            } else {
                unset($data['file']);
            }

            return $surat_masuk->update($data);
        } catch (\Exception $e) {
            Log::error('Error updating surat masuk: ' . $e->getMessage());
            throw $e;
        }
    }

    public function destroy(SuratMasuk $surat_masuk) {
        try {
            if ($surat_masuk->file && Storage::disk('public')->exists($surat_masuk->file)) {
                Storage::disk('public')->delete($surat_masuk->file);
            }
            return $surat_masuk->delete();
        } catch (\Exception $e) {
            Log::error('Error deleting surat masuk: ' . $e->getMessage());
            throw $e;
        }
    }
}