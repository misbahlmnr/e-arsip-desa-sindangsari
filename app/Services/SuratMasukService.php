<?php

namespace App\Services;

use App\Http\Requests\SuratMasuk\StoreRequest;
use App\Http\Requests\SuratMasuk\UpdateRequest;
use App\Models\SuratMasuk;
use App\Models\User;
use App\Services\Search\SuratNomorSearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class SuratMasukService
{
    public function __construct(private SuratNomorSearchService $nomorSearch) {}

    /**
     * @var list<string>
     */
    private const SORTABLE = [
        'id',
        'nomor_registrasi',
        'no_surat',
        'tanggal_terima',
        'tanggal_surat',
        'pengirim',
        'perihal',
        'status',
        'tingkat',
        'tujuan',
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
            'status' => ['nullable', Rule::in(SuratMasuk::STATUSES)],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortBy = $validated['sort_by'] ?? 'tanggal_terima';
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $status = $validated['status'] ?? null;

        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'tanggal_terima';
        }

        $query = SuratMasuk::query()->whereNull('diarsipkan_at');

        if ($status) {
            $query->where('status', $status);
        }

        $matchingIds = $this->nomorSearch->matchingIds(clone $query, $search);

        if ($matchingIds !== null) {
            if ($matchingIds === []) {
                $query->whereRaw('0 = 1');
            } else {
                $query->whereIn('id', $matchingIds);
            }
        }

        $query->orderBy($sortBy, $sortDir);

        $letters = $query
            ->withCount('disposisi')
            ->paginate($perPage)
            ->withQueryString();

        $letters->getCollection()->transform(function (SuratMasuk $letter) {
            $arr = $letter->toArray();
            $arr['disposisi'] = ($letter->disposisi_count ?? 0) > 0 ? 'sudah' : 'belum';

            return $arr;
        });

        return [
            'letters' => $letters,
            'filters' => [
                'search' => $search !== '' ? $search : null,
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
                'per_page' => $perPage,
                'status' => $status,
            ],
        ];
    }

    private function handleFile(Request $req)
    {
        if ($req->hasFile('file')) {
            return $req->file('file')->store('surat-masuk', 'public');
        }

        return null;
    }

    public function store(StoreRequest $req)
    {
        try {
            $data = $req->validated();
            $data['tujuan'] = $data['tujuan'] ?? '-';
            $data['status'] = SuratMasuk::STATUS_DRAFT;
            unset($data['tingkat']);
            $filePath = $this->handleFile($req);

            if ($filePath) {
                $data['file'] = $filePath;
            } else {
                $data['file'] = null;
            }

            return SuratMasuk::create($data);
        } catch (\Exception $e) {
            Log::error('Error storing surat masuk: '.$e->getMessage());
            throw $e;
        }
    }

    public function update(UpdateRequest $req, SuratMasuk $surat_masuk)
    {
        try {
            $data = $req->validated();
            $data['tujuan'] = $data['tujuan'] ?? '-';
            unset($data['status'], $data['tingkat']);
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
            Log::error('Error updating surat masuk: '.$e->getMessage());
            throw $e;
        }
    }

    public function destroy(SuratMasuk $surat_masuk)
    {
        try {
            if ($surat_masuk->file && Storage::disk('public')->exists($surat_masuk->file)) {
                Storage::disk('public')->delete($surat_masuk->file);
            }

            return $surat_masuk->delete();
        } catch (\Exception $e) {
            Log::error('Error deleting surat masuk: '.$e->getMessage());
            throw $e;
        }
    }

    public function reviewBySekdes(SuratMasuk $suratMasuk, string $tingkat, User $user): SuratMasuk
    {
        $suratMasuk->update([
            'tingkat' => $tingkat,
            'status' => SuratMasuk::STATUS_TERVERIFIKASI,
            'verified_sekdes_at' => now(),
            'verified_sekdes_by' => $user->id,
        ]);

        return $suratMasuk->fresh();
    }

    public function verifyByKades(SuratMasuk $suratMasuk, User $user): SuratMasuk
    {
        $suratMasuk->update([
            'verified_kades_at' => now(),
            'verified_kades_by' => $user->id,
        ]);

        return $suratMasuk->fresh();
    }

    public function archive(SuratMasuk $surat_masuk): void
    {
        $surat_masuk->update([
            'status' => SuratMasuk::STATUS_DIARSIPKAN,
            'diarsipkan_at' => now(),
        ]);
    }

    public function unarchive(SuratMasuk $surat_masuk): void
    {
        $surat_masuk->update([
            'status' => SuratMasuk::STATUS_DIDISPOSISIKAN,
            'diarsipkan_at' => null,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function formatShowPayload(SuratMasuk $suratMasuk, User $user): array
    {
        $letter = $suratMasuk->toArray();
        $letter['can_review_by_sekdes'] = $user->isSekdes() && $suratMasuk->canReviewBySekdes();
        $letter['can_verify_by_kades'] = $user->isKades() && $suratMasuk->canVerifyByKades();
        $letter['can_create_disposisi'] = $suratMasuk->canCreateDisposisi($user);
        $letter['can_archive'] = $suratMasuk->canArchive();

        return $letter;
    }
}
