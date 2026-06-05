<?php

namespace App\Services;

use App\Models\Disposisi;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LaporanService
{
    /** @var list<string> */
    private const RANGES = ['all', '7d', '30d', '90d', '1y'];

    /** @var array<string, string> */
    private const SURAT_MASUK_STATUS_LABELS = [
        'belum_diproses' => 'Belum Diproses',
        'sedang_diproses' => 'Sedang Diproses',
        'selesai' => 'Selesai',
    ];

    /** @var array<string, string> */
    private const SURAT_KELUAR_STATUS_LABELS = [
        'draft' => 'Draft',
        'terkirim' => 'Terkirim',
    ];

    /** @var array<string, string> */
    private const DISPOSISI_STATUS_LABELS = [
        'menunggu' => 'Menunggu',
        'diproses' => 'Diproses',
        'selesai' => 'Selesai',
    ];

    /**
     * @return array<string, mixed>
     */
    public function index(Request $req): array
    {
        return $this->buildReport($req);
    }

    public function exportPdf(Request $req): Response
    {
        abort_unless($req->user()?->canExportLaporan(), 403);

        $report = $this->buildReport($req);

        return Pdf::loadView('pdf.laporan-surat', [
            ...$report,
            'range_label' => $this->rangeLabel($report['filters']['range']),
            'generated_at' => now()->translatedFormat('d F Y, H:i'),
            'generated_by' => $req->user()->name,
            'surat_masuk_status' => $this->withStatusLabels(
                $report['surat_masuk_status'],
                self::SURAT_MASUK_STATUS_LABELS,
            ),
            'surat_keluar_status' => $this->withStatusLabels(
                $report['surat_keluar_status'],
                self::SURAT_KELUAR_STATUS_LABELS,
            ),
            'disposisi_status' => $this->withStatusLabels(
                $report['disposisi_status'],
                self::DISPOSISI_STATUS_LABELS,
            ),
        ])
            ->setPaper('a4', 'portrait')
            ->download('laporan-surat-'.now()->format('Y-m-d-His').'.pdf');
    }

    /**
     * @return array<string, mixed>
     */
    private function buildReport(Request $req): array
    {
        $validated = $req->validate([
            'range' => ['nullable', 'in:'.implode(',', self::RANGES)],
        ]);

        $range = $validated['range'] ?? 'all';
        $dateFrom = $this->resolveDateFrom($range);

        /** @var User $user */
        $user = $req->user();

        return [
            'summary' => $this->buildSummary($dateFrom, $user),
            'surat_masuk_status' => $this->countSuratMasukByStatus($dateFrom),
            'surat_keluar_status' => $this->countSuratKeluarByStatus($dateFrom),
            'disposisi_status' => $this->countDisposisiByStatus($user, $dateFrom),
            'monthly_trend' => $this->monthlyTrend(),
            'top_pengirim' => $this->topPengirim($dateFrom),
            'disposisi_by_kepada' => $this->disposisiByKepada($user, $dateFrom),
            'filters' => [
                'range' => $range,
            ],
        ];
    }

    private function rangeLabel(string $range): string
    {
        return match ($range) {
            '7d' => '7 hari terakhir',
            '30d' => '30 hari terakhir',
            '90d' => '90 hari terakhir',
            '1y' => '1 tahun terakhir',
            default => 'Semua waktu',
        };
    }

    /**
     * @param  list<array{status: string, total: int}>  $rows
     * @param  array<string, string>  $labels
     * @return list<array{status: string, label: string, total: int}>
     */
    private function withStatusLabels(array $rows, array $labels): array
    {
        return collect($rows)
            ->map(fn (array $row) => [
                'status' => $row['status'],
                'label' => $labels[$row['status']] ?? $row['status'],
                'total' => $row['total'],
            ])
            ->values()
            ->all();
    }

    private function resolveDateFrom(string $range): ?Carbon
    {
        return match ($range) {
            '7d' => now()->subDays(7)->startOfDay(),
            '30d' => now()->subDays(30)->startOfDay(),
            '90d' => now()->subDays(90)->startOfDay(),
            '1y' => now()->subYear()->startOfDay(),
            default => null,
        };
    }

    /**
     * @return array<string, int>
     */
    private function buildSummary(?Carbon $dateFrom, User $user): array
    {
        $suratMasukQuery = $this->applyDateFilter(SuratMasuk::query(), $dateFrom, 'tanggal_terima');
        $suratKeluarQuery = $this->applyDateFilter(SuratKeluar::query(), $dateFrom, 'tanggal_kirim');

        $arsipMasukQuery = SuratMasuk::query()->whereNotNull('diarsipkan_at');
        $arsipKeluarQuery = SuratKeluar::query()->whereNotNull('diarsipkan_at');

        if ($dateFrom) {
            $arsipMasukQuery->where('diarsipkan_at', '>=', $dateFrom);
            $arsipKeluarQuery->where('diarsipkan_at', '>=', $dateFrom);
        }

        $disposisiQuery = $this->disposisiBaseQuery($user);
        $this->applyDateFilter($disposisiQuery, $dateFrom, 'tanggal');

        return [
            'surat_masuk' => (clone $suratMasukQuery)->count(),
            'surat_masuk_aktif' => (clone $suratMasukQuery)->whereNull('diarsipkan_at')->count(),
            'surat_masuk_belum_diproses' => (clone $suratMasukQuery)
                ->whereNull('diarsipkan_at')
                ->where('status', 'belum_diproses')
                ->count(),
            'surat_masuk_tanpa_disposisi' => (clone $suratMasukQuery)
                ->whereNull('diarsipkan_at')
                ->whereDoesntHave('disposisi')
                ->count(),
            'surat_keluar' => (clone $suratKeluarQuery)->count(),
            'surat_keluar_draft' => (clone $suratKeluarQuery)->where('status', 'draft')->count(),
            'arsip' => $arsipMasukQuery->count() + $arsipKeluarQuery->count(),
            'disposisi' => $disposisiQuery->count(),
            'disposisi_menunggu' => (clone $disposisiQuery)->where('status', Disposisi::STATUS_MENUNGGU)->count(),
        ];
    }

    /**
     * @return list<array{status: string, total: int}>
     */
    private function countSuratMasukByStatus(?Carbon $dateFrom): array
    {
        $statuses = ['belum_diproses', 'sedang_diproses', 'selesai'];

        return $this->countByStatuses(
            $this->applyDateFilter(SuratMasuk::query()->whereNull('diarsipkan_at'), $dateFrom, 'tanggal_terima'),
            'status',
            $statuses,
        );
    }

    /**
     * @return list<array{status: string, total: int}>
     */
    private function countSuratKeluarByStatus(?Carbon $dateFrom): array
    {
        $statuses = ['draft', 'terkirim'];

        return $this->countByStatuses(
            $this->applyDateFilter(SuratKeluar::query()->whereNull('diarsipkan_at'), $dateFrom, 'tanggal_kirim'),
            'status',
            $statuses,
        );
    }

    /**
     * @return list<array{status: string, total: int}>
     */
    private function countDisposisiByStatus(User $user, ?Carbon $dateFrom): array
    {
        $query = $this->disposisiBaseQuery($user);
        $this->applyDateFilter($query, $dateFrom, 'tanggal');

        return $this->countByStatuses($query, 'status', Disposisi::STATUSES);
    }

    /**
     * @param  Builder<\Illuminate\Database\Eloquent\Model>  $query
     * @param  list<string>  $statuses
     * @return list<array{status: string, total: int}>
     */
    private function countByStatuses(Builder $query, string $column, array $statuses): array
    {
        $counts = (clone $query)
            ->selectRaw("{$column}, COUNT(*) as total")
            ->groupBy($column)
            ->pluck('total', $column);

        return collect($statuses)
            ->map(fn (string $status) => [
                'status' => $status,
                'total' => (int) ($counts[$status] ?? 0),
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array{label: string, masuk: int, keluar: int}>
     */
    private function monthlyTrend(): array
    {
        $result = [];

        for ($i = 5; $i >= 0; $i--) {
            $start = now()->subMonths($i)->startOfMonth();
            $end = now()->subMonths($i)->endOfMonth();

            $result[] = [
                'label' => $start->translatedFormat('M Y'),
                'masuk' => SuratMasuk::query()
                    ->whereBetween('tanggal_terima', [$start->toDateString(), $end->toDateString()])
                    ->count(),
                'keluar' => SuratKeluar::query()
                    ->whereBetween('tanggal_kirim', [$start->toDateString(), $end->toDateString()])
                    ->count(),
            ];
        }

        return $result;
    }

    /**
     * @return list<array{pengirim: string, total: int}>
     */
    private function topPengirim(?Carbon $dateFrom, int $limit = 5): array
    {
        $query = $this->applyDateFilter(SuratMasuk::query(), $dateFrom, 'tanggal_terima');

        return $query
            ->selectRaw('pengirim, COUNT(*) as total')
            ->groupBy('pengirim')
            ->orderByDesc('total')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'pengirim' => $row->pengirim,
                'total' => (int) $row->total,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array{kepada: string, total: int}>
     */
    private function disposisiByKepada(User $user, ?Carbon $dateFrom): array
    {
        $query = $this->disposisiBaseQuery($user);
        $this->applyDateFilter($query, $dateFrom, 'tanggal');

        return $query
            ->selectRaw('kepada, COUNT(*) as total')
            ->groupBy('kepada')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'kepada' => $row->kepada,
                'total' => (int) $row->total,
            ])
            ->values()
            ->all();
    }

    /**
     * @param  Builder<\Illuminate\Database\Eloquent\Model>  $query
     * @return Builder<\Illuminate\Database\Eloquent\Model>
     */
    private function applyDateFilter(Builder $query, ?Carbon $dateFrom, string $column): Builder
    {
        if ($dateFrom) {
            $query->where($column, '>=', $dateFrom->toDateString());
        }

        return $query;
    }

    /**
     * @return Builder<Disposisi>
     */
    private function disposisiBaseQuery(User $user): Builder
    {
        return Disposisi::query()->when($user->isKades(), function (Builder $q) {
            $q->where('kepada', 'like', '%Kepala Desa%');
        });
    }
}
