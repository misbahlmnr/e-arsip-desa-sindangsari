<?php

namespace App\Services;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Services\NomorAgendaService;
use App\Services\Search\SuratNomorSearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArsipSuratService
{
    /**
     * @var list<string>
     */
    private const SORTABLE = ['no_surat', 'tanggal_surat', 'diarsipkan_at'];

    public function __construct(
        private SuratNomorSearchService $nomorSearch,
        private NomorAgendaService $nomorAgenda,
    ) {}

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
            'tahun' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'bulan' => ['nullable', 'integer', 'min:1', 'max:12'],
            'tanggal' => ['nullable', 'date'],
            'perihal' => ['nullable', 'string', 'max:250'],
            'pihak' => ['nullable', 'string', 'max:191'],
            'nomor_agenda' => ['nullable', 'string', 'max:32'],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $jenis = $validated['jenis'] ?? 'all';
        $range = $validated['range'] ?? 'all';
        $tahun = isset($validated['tahun']) ? (int) $validated['tahun'] : null;
        $bulan = isset($validated['bulan']) ? (int) $validated['bulan'] : null;
        $tanggal = $validated['tanggal'] ?? null;
        $perihal = isset($validated['perihal']) ? trim($validated['perihal']) : '';
        $pihak = isset($validated['pihak']) ? trim($validated['pihak']) : '';
        $nomorAgenda = isset($validated['nomor_agenda']) ? trim($validated['nomor_agenda']) : '';
        $agendaSearchActive = $tahun !== null && in_array($jenis, ['masuk', 'keluar'], true);

        $sortBy = $validated['sort_by'] ?? 'diarsipkan_at';
        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'diarsipkan_at';
        }

        $query = $this->arsipBaseQuery($jenis);

        if ($agendaSearchActive) {
            $this->applyAgendaSearch($query, $jenis, $tahun);

            $kode = $jenis === 'masuk' ? NomorAgendaService::KODE_MASUK : NomorAgendaService::KODE_KELUAR;

            if ($bulan !== null) {
                $query->where('nomor_agenda', 'like', sprintf('%s/%d/%02d/%%', $kode, $tahun, $bulan));
            }

            if ($nomorAgenda !== '') {
                $query->where('nomor_agenda', $nomorAgenda);
            }
        }

        if ($tanggal) {
            $query->whereDate('tanggal_surat', $tanggal);
        }

        if ($perihal !== '') {
            $query->where('perihal', 'like', NomorAgendaService::contains($perihal));
        }

        if ($pihak !== '') {
            $query->where('pihak', 'like', NomorAgendaService::contains($pihak));
        }

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

        if ($search !== '') {
            $query->where('no_surat', 'like', NomorAgendaService::contains($search));
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
                'tahun' => $tahun,
                'bulan' => $bulan,
                'tanggal' => $tanggal,
                'perihal' => $perihal !== '' ? $perihal : null,
                'pihak' => $pihak !== '' ? $pihak : null,
                'nomor_agenda' => $agendaSearchActive && $nomorAgenda !== '' ? $nomorAgenda : null,
            ],
        ];
    }

    private function applyAgendaSearch($query, string $jenis, int $tahun): void
    {
        $model = $jenis === 'masuk' ? SuratMasuk::query() : SuratKeluar::query();
        $kode = $jenis === 'masuk' ? NomorAgendaService::KODE_MASUK : NomorAgendaService::KODE_KELUAR;

        $ids = $this->nomorSearch->matchingIds(
            $model->whereNotNull('diarsipkan_at'),
            $this->nomorAgenda->yearPrefix($kode, $tahun),
        ) ?? [];

        if ($ids === []) {
            $query->whereRaw('0 = 1');

            return;
        }

        $query->whereIn('id', $ids);
    }

    /**
     * @return \Illuminate\Database\Query\Builder
     */
    private function arsipBaseQuery(string $jenis)
    {
        $masuk = DB::table('surat_masuk')
            ->selectRaw("'masuk' as jenis, id, nomor_agenda, no_surat, perihal, pengirim as pihak, COALESCE(tanggal_surat, tanggal_terima) as tanggal_surat, diarsipkan_at")
            ->whereNotNull('diarsipkan_at');

        $keluar = DB::table('surat_keluar')
            ->selectRaw("'keluar' as jenis, id, nomor_agenda, no_surat, perihal, tujuan as pihak, tanggal_kirim as tanggal_surat, diarsipkan_at")
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
