<?php

namespace App\Services;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Services\Search\SuratNomorSearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArsipSuratService
{
    /**
     * @var list<string>
     */
    private const SORTABLE = ['no_surat', 'tanggal_surat', 'diarsipkan_at'];

    public function __construct(private SuratNomorSearchService $nomorSearch) {}

    /**
     * @return array{letters: \Illuminate\Contracts\Pagination\LengthAwarePaginator, filters: array<string, mixed>}
     */
    public function index(Request $request): array
    {
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'max:64'],
            'sort_dir' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'in:8,10,20,50,100'],
            'jenis' => ['nullable', 'in:all,masuk,keluar'],
            'range' => ['nullable', 'in:all,7d,30d,90d'],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $jenis = $validated['jenis'] ?? 'all';
        $range = $validated['range'] ?? 'all';

        $sortBy = $validated['sort_by'] ?? 'diarsipkan_at';
        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'diarsipkan_at';
        }

        $query = $this->arsipBaseQuery($jenis);

        $this->applyNomorSearch($query, $search, $jenis);

        if ($range !== 'all') {
            $days = match ($range) {
                '7d' => 7,
                '30d' => 30,
                '90d' => 90,
                default => null,
            };
            if ($days !== null) {
                $query->where('diarsipkan_at', '>=', now()->subDays($days));
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
                'jenis' => $jenis,
                'range' => $range,
            ],
        ];
    }

    /**
     * @param  \Illuminate\Database\Query\Builder  $query
     */
    private function applyNomorSearch($query, string $search, string $jenis): void
    {
        if ($search === '') {
            return;
        }

        if ($jenis === 'masuk') {
            $ids = $this->nomorSearch->matchingIds(
                SuratMasuk::query()->whereNotNull('diarsipkan_at'),
                $search,
            ) ?? [];

            if ($ids === []) {
                $query->whereRaw('0 = 1');

                return;
            }

            $query->whereIn('id', $ids);

            return;
        }

        if ($jenis === 'keluar') {
            $ids = $this->nomorSearch->matchingIds(
                SuratKeluar::query()->whereNotNull('diarsipkan_at'),
                $search,
            ) ?? [];

            if ($ids === []) {
                $query->whereRaw('0 = 1');

                return;
            }

            $query->whereIn('id', $ids);

            return;
        }

        $masukIds = $this->nomorSearch->matchingIds(
            SuratMasuk::query()->whereNotNull('diarsipkan_at'),
            $search,
        ) ?? [];

        $keluarIds = $this->nomorSearch->matchingIds(
            SuratKeluar::query()->whereNotNull('diarsipkan_at'),
            $search,
        ) ?? [];

        if ($masukIds === [] && $keluarIds === []) {
            $query->whereRaw('0 = 1');

            return;
        }

        $query->where(function ($q) use ($masukIds, $keluarIds) {
            if ($masukIds !== []) {
                $q->where(function ($q) use ($masukIds) {
                    $q->where('jenis', 'masuk')->whereIn('id', $masukIds);
                });
            }

            if ($keluarIds !== []) {
                $method = $masukIds !== [] ? 'orWhere' : 'where';
                $q->{$method}(function ($q) use ($keluarIds) {
                    $q->where('jenis', 'keluar')->whereIn('id', $keluarIds);
                });
            }
        });
    }

    /**
     * @return \Illuminate\Database\Query\Builder
     */
    private function arsipBaseQuery(string $jenis)
    {
        $masuk = DB::table('surat_masuk')
            ->selectRaw("'masuk' as jenis, id, no_surat, perihal, pengirim as pihak, COALESCE(tanggal_surat, tanggal_terima) as tanggal_surat, diarsipkan_at")
            ->whereNotNull('diarsipkan_at');

        $keluar = DB::table('surat_keluar')
            ->selectRaw("'keluar' as jenis, id, no_surat, perihal, tujuan as pihak, tanggal_kirim as tanggal_surat, diarsipkan_at")
            ->whereNotNull('diarsipkan_at');

        if ($jenis === 'masuk') {
            return DB::query()->fromSub($masuk, 'arsip');
        }

        if ($jenis === 'keluar') {
            return DB::query()->fromSub($keluar, 'arsip');
        }

        $union = $masuk->unionAll($keluar);

        return DB::query()->fromSub($union, 'arsip');
    }
}
