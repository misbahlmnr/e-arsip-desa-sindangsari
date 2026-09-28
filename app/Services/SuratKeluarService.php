<?php

namespace App\Services;

use App\Http\Requests\SuratKeluar\StoreRequest;
use App\Http\Requests\SuratKeluar\UpdateRequest;
use App\Models\SuratKeluar;
use App\Services\NomorAgendaService;
use App\Services\Search\SuratNomorSearchService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SuratKeluarService
{
    public function __construct(
        private SuratNomorSearchService $nomorSearch,
        private SupportingDocumentService $supportingDocuments,
        private NomorAgendaService $nomorAgenda,
    ) {}

    /**
     * Sortable columns (whitelist) — prevents arbitrary ORDER BY injection.
     *
     * @var list<string>
     */
    private const SORTABLE = [
        'id',
        'no_surat',
        'nomor_agenda',
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
            'tahun' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'bulan' => ['nullable', 'integer', 'min:1', 'max:12'],
            'tanggal' => ['nullable', 'date'],
            'perihal' => ['nullable', 'string', 'max:250'],
            'tujuan' => ['nullable', 'string', 'max:191'],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortBy = $validated['sort_by'] ?? 'tanggal_kirim';
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $tahun = isset($validated['tahun']) ? (int) $validated['tahun'] : null;
        $bulan = isset($validated['bulan']) ? (int) $validated['bulan'] : null;
        $tanggal = $validated['tanggal'] ?? null;
        $perihal = isset($validated['perihal']) ? trim($validated['perihal']) : '';
        $tujuan = isset($validated['tujuan']) ? trim($validated['tujuan']) : '';

        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'tanggal_kirim';
        }

        $query = SuratKeluar::query()->whereNull('diarsipkan_at');

        if ($tahun !== null) {
            $this->nomorAgenda->restrictToYearPrefix(
                $query,
                NomorAgendaService::KODE_KELUAR,
                $tahun,
                $this->nomorSearch,
            );
        }

        if ($tahun !== null) {
            if ($bulan !== null) {
                $query->where(
                    'nomor_agenda',
                    'like',
                    sprintf('%s/%d/%02d/%%', NomorAgendaService::KODE_KELUAR, $tahun, $bulan),
                );
            }

            if ($tanggal) {
                $query->whereDate('tanggal_kirim', $tanggal);
            }

            if ($perihal !== '') {
                $query->where('perihal', 'like', NomorAgendaService::contains($perihal));
            }

            if ($tujuan !== '') {
                $query->where('tujuan', 'like', NomorAgendaService::contains($tujuan));
            }
        }

        if ($search !== '') {
            $like = NomorAgendaService::contains($search);
            $query->where(function ($inner) use ($like) {
                $inner->where('nomor_agenda', 'like', $like)
                    ->orWhere('no_surat', 'like', $like)
                    ->orWhere('perihal', 'like', $like)
                    ->orWhere('tujuan', 'like', $like);
            });
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
                'tahun' => $tahun,
                'bulan' => $bulan,
                'tanggal' => $tanggal,
                'perihal' => $perihal !== '' ? $perihal : null,
                'tujuan' => $tujuan !== '' ? $tujuan : null,
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
                $filePath = $this->handleFile($req);
                $newMainPath = $filePath;
                $data['file'] = $filePath;

                $letter = SuratKeluar::create($data);
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
            Log::error('Error storing surat keluar: '.$e->getMessage());
            throw $e;
        }
    }

    public function update(UpdateRequest $req, SuratKeluar $surat_keluar)
    {
        $newMainPath = null;
        $supportingPaths = [];
        $pathsToDeleteAfterCommit = [];

        try {
            $updated = DB::transaction(function () use (
                $req,
                $surat_keluar,
                &$newMainPath,
                &$supportingPaths,
                &$pathsToDeleteAfterCommit,
            ) {
                $data = $req->validated();
                unset($data['supporting_files'], $data['remove_supporting_ids']);
                $filePath = $this->handleFile($req);

                if ($filePath) {
                    $newMainPath = $filePath;
                    if ($surat_keluar->file) {
                        $pathsToDeleteAfterCommit[] = $surat_keluar->file;
                    }
                    $data['file'] = $filePath;
                } else {
                    unset($data['file']);
                }

                $surat_keluar->update($data);
                $pathsToDeleteAfterCommit = array_merge(
                    $pathsToDeleteAfterCommit,
                    $this->supportingDocuments->deleteMany(
                        $surat_keluar,
                        $req->input('remove_supporting_ids', []) ?? [],
                    ),
                );
                $supportingPaths = $this->supportingDocuments->storeMany(
                    $surat_keluar,
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
            Log::error('Error updating surat keluar: '.$e->getMessage());
            throw $e;
        }

        $this->supportingDocuments->deleteStoredPaths($pathsToDeleteAfterCommit);

        return $updated;
    }

    public function destroy(SuratKeluar $surat_keluar)
    {
        try {
            $paths = DB::transaction(function () use ($surat_keluar) {
                $paths = $this->supportingDocuments->deleteAllForLetter($surat_keluar);

                if ($surat_keluar->file) {
                    $paths[] = $surat_keluar->file;
                }

                $surat_keluar->delete();

                return $paths;
            });
        } catch (\Exception $e) {
            Log::error('Error deleting surat keluar: '.$e->getMessage());
            throw $e;
        }

        $this->supportingDocuments->deleteStoredPaths($paths);

        return true;
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
