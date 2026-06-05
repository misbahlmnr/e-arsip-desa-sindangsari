<?php

namespace App\Services;

use App\Models\Disposisi;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;

class DashboardService
{
    /**
     * @return array<string, mixed>
     */
    public function admin(): array
    {
        $suratMasukAktif = SuratMasuk::query()->whereNull('diarsipkan_at');
        $suratKeluarAktif = SuratKeluar::query()->whereNull('diarsipkan_at');

        $summary = [
            'surat_masuk' => (clone $suratMasukAktif)->count(),
            'surat_masuk_belum_diproses' => (clone $suratMasukAktif)
                ->where('status', 'belum_diproses')
                ->count(),
            'surat_masuk_sedang_diproses' => (clone $suratMasukAktif)
                ->where('status', 'sedang_diproses')
                ->count(),
            'surat_masuk_selesai' => (clone $suratMasukAktif)
                ->where('status', 'selesai')
                ->count(),
            'surat_masuk_tanpa_disposisi' => (clone $suratMasukAktif)
                ->whereDoesntHave('disposisi')
                ->count(),
            'surat_masuk_bulan_ini' => SuratMasuk::query()
                ->whereMonth('tanggal_terima', now()->month)
                ->whereYear('tanggal_terima', now()->year)
                ->count(),
            'surat_keluar' => (clone $suratKeluarAktif)->count(),
            'surat_keluar_draft' => (clone $suratKeluarAktif)
                ->where('status', 'draft')
                ->count(),
            'surat_keluar_terkirim' => (clone $suratKeluarAktif)
                ->where('status', 'terkirim')
                ->count(),
            'surat_keluar_bulan_ini' => SuratKeluar::query()
                ->whereMonth('tanggal_kirim', now()->month)
                ->whereYear('tanggal_kirim', now()->year)
                ->count(),
            'disposisi' => Disposisi::query()->count(),
            'disposisi_menunggu' => Disposisi::query()
                ->where('status', Disposisi::STATUS_MENUNGGU)
                ->count(),
            'disposisi_diproses' => Disposisi::query()
                ->where('status', Disposisi::STATUS_DIPROSES)
                ->count(),
            'disposisi_selesai' => Disposisi::query()
                ->where('status', Disposisi::STATUS_SELESAI)
                ->count(),
            'arsip_masuk' => SuratMasuk::query()->whereNotNull('diarsipkan_at')->count(),
            'arsip_keluar' => SuratKeluar::query()->whereNotNull('diarsipkan_at')->count(),
            'arsip' => SuratMasuk::query()->whereNotNull('diarsipkan_at')->count()
                + SuratKeluar::query()->whereNotNull('diarsipkan_at')->count(),
            'siap_arsip' => (clone $suratMasukAktif)
                ->where('status', 'selesai')
                ->count(),
            'users' => User::query()->count(),
            'users_admin' => User::query()->where('role', 'admin')->count(),
            'users_sekdes' => User::query()->where('role', 'sekdes')->count(),
            'users_kades' => User::query()->where('role', 'kades')->count(),
        ];

        return [
            'summary' => $summary,
            'attention' => $this->buildAttention($summary),
            'monthly_trend' => $this->monthlyTrend(),
            'recent_surat_masuk' => $this->recentSuratMasuk(),
            'recent_surat_keluar' => $this->recentSuratKeluar(),
            'pending_disposisi' => $this->pendingDisposisi(),
        ];
    }

    /**
     * @param  array<string, int>  $summary
     * @return list<array{key: string, label: string, description: string, count: int, route: string, severity: string}>
     */
    private function buildAttention(array $summary): array
    {
        $items = [
            [
                'key' => 'belum_diproses',
                'label' => 'Surat belum diproses',
                'description' => 'Surat masuk yang belum ditindaklanjuti',
                'count' => $summary['surat_masuk_belum_diproses'],
                'route' => 'admin.surat-masuk.index',
                'severity' => 'warning',
            ],
            [
                'key' => 'tanpa_disposisi',
                'label' => 'Surat tanpa disposisi',
                'description' => 'Belum ada instruksi disposisi',
                'count' => $summary['surat_masuk_tanpa_disposisi'],
                'route' => 'admin.surat-masuk.index',
                'severity' => 'warning',
            ],
            [
                'key' => 'disposisi_menunggu',
                'label' => 'Disposisi menunggu Kepala Desa',
                'description' => 'Menunggu persetujuan atau arahan',
                'count' => $summary['disposisi_menunggu'],
                'route' => 'admin.laporan.index',
                'severity' => 'danger',
            ],
            [
                'key' => 'siap_arsip',
                'label' => 'Surat siap diarsipkan',
                'description' => 'Status selesai, belum masuk arsip',
                'count' => $summary['siap_arsip'],
                'route' => 'admin.surat-masuk.index',
                'severity' => 'info',
            ],
            [
                'key' => 'draft_keluar',
                'label' => 'Surat keluar masih draft',
                'description' => 'Belum dikirim atau difinalisasi',
                'count' => $summary['surat_keluar_draft'],
                'route' => 'admin.surat-keluar.index',
                'severity' => 'info',
            ],
        ];

        return array_values(array_filter(
            $items,
            fn (array $item) => $item['count'] > 0,
        ));
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
     * @return list<array<string, mixed>>
     */
    private function recentSuratMasuk(): array
    {
        return SuratMasuk::query()
            ->whereNull('diarsipkan_at')
            ->orderByDesc('tanggal_terima')
            ->orderByDesc('id')
            ->limit(5)
            ->get(['id', 'no_surat', 'pengirim', 'perihal', 'tanggal_terima', 'status'])
            ->map(fn (SuratMasuk $s) => [
                'id' => $s->id,
                'no_surat' => $s->no_surat,
                'pengirim' => $s->pengirim,
                'perihal' => $s->perihal,
                'tanggal_terima' => $s->tanggal_terima?->format('Y-m-d'),
                'status' => $s->status,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function recentSuratKeluar(): array
    {
        return SuratKeluar::query()
            ->whereNull('diarsipkan_at')
            ->orderByDesc('tanggal_kirim')
            ->orderByDesc('id')
            ->limit(5)
            ->get(['id', 'no_surat', 'tujuan', 'perihal', 'tanggal_kirim', 'status'])
            ->map(fn (SuratKeluar $s) => [
                'id' => $s->id,
                'no_surat' => $s->no_surat,
                'tujuan' => $s->tujuan,
                'perihal' => $s->perihal,
                'tanggal_kirim' => $s->tanggal_kirim?->format('Y-m-d'),
                'status' => $s->status,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function pendingDisposisi(): array
    {
        return Disposisi::query()
            ->with('suratMasuk:id,no_surat,perihal,pengirim')
            ->where('status', Disposisi::STATUS_MENUNGGU)
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn (Disposisi $d) => [
                'id' => $d->id,
                'kepada' => $d->kepada,
                'tanggal' => $d->tanggal?->format('Y-m-d'),
                'status' => $d->status,
                'surat_masuk' => $d->suratMasuk ? [
                    'id' => $d->suratMasuk->id,
                    'no_surat' => $d->suratMasuk->no_surat,
                    'perihal' => $d->suratMasuk->perihal,
                    'pengirim' => $d->suratMasuk->pengirim,
                ] : null,
            ])
            ->values()
            ->all();
    }
}
