<?php

namespace App\Services;

use App\Http\Requests\SuratMasuk\StoreRequest;
use App\Http\Requests\SuratMasuk\UpdateRequest;
use App\Models\SuratMasuk;
use App\Models\User;
use App\Services\NomorAgendaService;
use App\Services\Search\SuratNomorSearchService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class SuratMasukService
{
    public function __construct(
        private SuratNomorSearchService $nomorSearch,
        private SupportingDocumentService $supportingDocuments,
        private NomorAgendaService $nomorAgenda,
    ) {}

    /**
     * @var list<string>
     */
    private const SORTABLE = [
        'id',
        'nomor_registrasi',
        'no_surat',
        'nomor_agenda',
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
            'tingkat' => ['nullable', Rule::in(SuratMasuk::TINGKAT_OPTIONS)],
            'kades_aksi' => ['nullable', Rule::in(['menunggu_verifikasi', 'siap_disposisi'])],
            'disposisi' => ['nullable', Rule::in(['belum', 'sudah'])],
            'tahun' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'bulan' => ['nullable', 'integer', 'min:1', 'max:12'],
            'tanggal' => ['nullable', 'date'],
            'perihal' => ['nullable', 'string', 'max:250'],
            'pengirim' => ['nullable', 'string', 'max:120'],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortBy = $validated['sort_by'] ?? 'tanggal_terima';
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $status = $validated['status'] ?? null;
        $tingkat = $validated['tingkat'] ?? null;
        $kadesAksi = $validated['kades_aksi'] ?? null;
        $disposisi = $validated['disposisi'] ?? null;
        $tahun = isset($validated['tahun']) ? (int) $validated['tahun'] : null;
        $bulan = isset($validated['bulan']) ? (int) $validated['bulan'] : null;
        $tanggal = $validated['tanggal'] ?? null;
        $perihal = isset($validated['perihal']) ? trim($validated['perihal']) : '';
        $pengirim = isset($validated['pengirim']) ? trim($validated['pengirim']) : '';

        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'tanggal_terima';
        }

        $query = SuratMasuk::query()->whereNull('diarsipkan_at');

        if ($tahun !== null) {
            $this->nomorAgenda->restrictToYearPrefix(
                $query,
                NomorAgendaService::KODE_MASUK,
                $tahun,
                $this->nomorSearch,
            );
        }

        $this->applyWorkflowFilters($query, $status, $tingkat, $kadesAksi, $disposisi);

        if ($tahun !== null) {
            if ($bulan !== null) {
                $query->where(
                    'nomor_agenda',
                    'like',
                    sprintf('%s/%d/%02d/%%', NomorAgendaService::KODE_MASUK, $tahun, $bulan),
                );
            }

            if ($tanggal) {
                $query->whereDate('tanggal_terima', $tanggal);
            }

            if ($perihal !== '') {
                $query->where('perihal', 'like', NomorAgendaService::contains($perihal));
            }

            if ($pengirim !== '') {
                $query->where('pengirim', 'like', NomorAgendaService::contains($pengirim));
            }
        }

        if ($search !== '') {
            $like = NomorAgendaService::contains($search);
            $query->where(function ($inner) use ($like) {
                $inner->where('nomor_agenda', 'like', $like)
                    ->orWhere('no_surat', 'like', $like)
                    ->orWhere('perihal', 'like', $like)
                    ->orWhere('pengirim', 'like', $like)
                    ->orWhere('tujuan', 'like', $like);
            });
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
                'tingkat' => $tingkat,
                'kades_aksi' => $kadesAksi,
                'disposisi' => $disposisi,
                'tahun' => $tahun,
                'bulan' => $bulan,
                'tanggal' => $tanggal,
                'perihal' => $perihal !== '' ? $perihal : null,
                'pengirim' => $pengirim !== '' ? $pengirim : null,
            ],
        ];
    }

    private function applyWorkflowFilters($query, ?string $status, ?string $tingkat, ?string $kadesAksi, ?string $disposisi): void
    {
        if ($kadesAksi === 'menunggu_verifikasi') {
            $query->where('tingkat', SuratMasuk::TINGKAT_PENTING)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->whereNull('verified_kades_at');

            return;
        }

        if ($kadesAksi === 'siap_disposisi') {
            $query->where('tingkat', SuratMasuk::TINGKAT_PENTING)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->whereNotNull('verified_kades_at');

            return;
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($tingkat) {
            $query->where('tingkat', $tingkat);
        }

        if ($disposisi === 'belum') {
            $query->whereDoesntHave('disposisi');
            if (! $status) {
                $query->where('status', '!=', SuratMasuk::STATUS_DRAFT);
            }
        } elseif ($disposisi === 'sudah') {
            $query->whereHas('disposisi');
        }
    }

    private function handleFile(Request $req)
    {
        if ($req->hasFile('file')) {
            return $req->file('file')->store('surat-masuk', 'public');
        }

        return null;
    }

    /**
     * @return list<UploadedFile>
     */
    private function supportingUploads(Request $req): array
    {
        $files = $req->file('supporting_files', []);

        if ($files instanceof UploadedFile) {
            return [$files];
        }

        return is_array($files) ? array_values(array_filter($files)) : [];
    }

    public function store(StoreRequest $req)
    {
        $newMainPath = null;
        $supportingPaths = [];

        try {
            return DB::transaction(function () use ($req, &$newMainPath, &$supportingPaths) {
                $data = $req->validated();
                unset($data['supporting_files'], $data['remove_supporting_ids']);
                $data['tujuan'] = $data['tujuan'] ?? '-';
                $data['status'] = SuratMasuk::STATUS_DRAFT;
                unset($data['tingkat']);
                $filePath = $this->handleFile($req);
                $newMainPath = $filePath;
                $data['file'] = $filePath;

                $letter = SuratMasuk::create($data);
                $supportingPaths = $this->supportingDocuments->storeMany(
                    $letter,
                    $this->supportingUploads($req),
                    $req->user()?->id,
                );

                return $letter;
            });
        } catch (\Exception $e) {
            $this->supportingDocuments->deleteStoredPaths(array_filter([
                $newMainPath,
                ...$supportingPaths,
            ]));
            Log::error('Error storing surat masuk: '.$e->getMessage());
            throw $e;
        }
    }

    public function update(UpdateRequest $req, SuratMasuk $surat_masuk)
    {
        $newMainPath = null;
        $supportingPaths = [];
        $pathsToDeleteAfterCommit = [];

        try {
            $updated = DB::transaction(function () use (
                $req,
                $surat_masuk,
                &$newMainPath,
                &$supportingPaths,
                &$pathsToDeleteAfterCommit,
            ) {
                $data = $req->validated();
                unset($data['supporting_files'], $data['remove_supporting_ids']);
                $data['tujuan'] = $data['tujuan'] ?? '-';
                unset($data['status'], $data['tingkat']);
                $filePath = $this->handleFile($req);

                if ($filePath) {
                    $newMainPath = $filePath;
                    if ($surat_masuk->file) {
                        $pathsToDeleteAfterCommit[] = $surat_masuk->file;
                    }
                    $data['file'] = $filePath;
                } else {
                    unset($data['file']);
                }

                $surat_masuk->update($data);
                $pathsToDeleteAfterCommit = array_merge(
                    $pathsToDeleteAfterCommit,
                    $this->supportingDocuments->deleteMany(
                        $surat_masuk,
                        $req->input('remove_supporting_ids', []) ?? [],
                    ),
                );
                $supportingPaths = $this->supportingDocuments->storeMany(
                    $surat_masuk,
                    $this->supportingUploads($req),
                    $req->user()?->id,
                );

                return true;
            });
        } catch (\Exception $e) {
            $this->supportingDocuments->deleteStoredPaths(array_filter([
                $newMainPath,
                ...$supportingPaths,
            ]));
            Log::error('Error updating surat masuk: '.$e->getMessage());
            throw $e;
        }

        $this->supportingDocuments->deleteStoredPaths($pathsToDeleteAfterCommit);

        return $updated;
    }

    public function destroy(SuratMasuk $surat_masuk)
    {
        try {
            $paths = DB::transaction(function () use ($surat_masuk) {
                $paths = $this->supportingDocuments->deleteAllForLetter($surat_masuk);

                if ($surat_masuk->file) {
                    $paths[] = $surat_masuk->file;
                }

                $surat_masuk->delete();

                return $paths;
            });
        } catch (\Exception $e) {
            Log::error('Error deleting surat masuk: '.$e->getMessage());
            throw $e;
        }

        $this->supportingDocuments->deleteStoredPaths($paths);

        return true;
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
        $suratMasuk->loadMissing('supportingDocuments');
        $letter = $suratMasuk->toArray();
        $letter['can_review_by_sekdes'] = $user->isSekdes() && $suratMasuk->canReviewBySekdes();
        $letter['can_verify_by_kades'] = $user->isKades() && $suratMasuk->canVerifyByKades();
        $letter['can_create_disposisi'] = $suratMasuk->canCreateDisposisi($user);
        $letter['can_archive'] = $suratMasuk->canArchive();

        return $letter;
    }
}
