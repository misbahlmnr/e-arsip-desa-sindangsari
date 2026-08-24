<?php

namespace App\Services;

use App\Models\Disposisi;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

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
            'surat_masuk_draft' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_DRAFT)
                ->count(),
            'surat_masuk_terverifikasi' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->count(),
            'surat_masuk_didisposisikan' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_DIDISPOSISIKAN)
                ->count(),
            'surat_masuk_belum_diproses' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_DRAFT)
                ->count(),
            'surat_masuk_sedang_diproses' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->count(),
            'surat_masuk_selesai' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_DIDISPOSISIKAN)
                ->count(),
            'surat_masuk_tanpa_disposisi' => (clone $suratMasukAktif)
                ->where('tingkat', SuratMasuk::TINGKAT_BIASA)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
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
            'disposisi_menunggu' => (clone $suratMasukAktif)
                ->where('tingkat', SuratMasuk::TINGKAT_PENTING)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->whereNull('verified_kades_at')
                ->count(),
            'disposisi_diproses' => (clone $suratMasukAktif)
                ->where('tingkat', SuratMasuk::TINGKAT_PENTING)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->whereNotNull('verified_kades_at')
                ->count(),
            'disposisi_selesai' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_DIDISPOSISIKAN)
                ->count(),
            'arsip_masuk' => SuratMasuk::query()->whereNotNull('diarsipkan_at')->count(),
            'arsip_keluar' => SuratKeluar::query()->whereNotNull('diarsipkan_at')->count(),
            'arsip' => SuratMasuk::query()->whereNotNull('diarsipkan_at')->count()
                + SuratKeluar::query()->whereNotNull('diarsipkan_at')->count(),
            'siap_arsip' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_DIDISPOSISIKAN)
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
     * @return array<string, mixed>
     */
    public function sekdes(): array
    {
        $suratMasukAktif = SuratMasuk::query()->whereNull('diarsipkan_at');
        $disposisiQuery = Disposisi::query()->where('dari_jabatan', Disposisi::DARI_SEKDES);

        $summary = [
            'surat_masuk' => (clone $suratMasukAktif)->count(),
            'surat_masuk_draft' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_DRAFT)
                ->count(),
            'surat_masuk_belum_diproses' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_DRAFT)
                ->count(),
            'surat_masuk_menunggu_review' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_DRAFT)
                ->count(),
            'surat_masuk_terverifikasi' => (clone $suratMasukAktif)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->count(),
            'surat_masuk_tanpa_disposisi' => (clone $suratMasukAktif)
                ->where('tingkat', SuratMasuk::TINGKAT_BIASA)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->count(),
            'surat_masuk_bulan_ini' => SuratMasuk::query()
                ->whereMonth('tanggal_terima', now()->month)
                ->whereYear('tanggal_terima', now()->year)
                ->count(),
            'disposisi' => (clone $disposisiQuery)->count(),
            'disposisi_menunggu' => (clone $suratMasukAktif)
                ->where('tingkat', SuratMasuk::TINGKAT_PENTING)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->whereNull('verified_kades_at')
                ->count(),
            'disposisi_ke_kades' => (clone $suratMasukAktif)
                ->where('tingkat', SuratMasuk::TINGKAT_PENTING)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->count(),
            'disposisi_ke_kades_menunggu' => (clone $suratMasukAktif)
                ->where('tingkat', SuratMasuk::TINGKAT_PENTING)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->whereNull('verified_kades_at')
                ->count(),
            'arsip' => SuratMasuk::query()->whereNotNull('diarsipkan_at')->count()
                + SuratKeluar::query()->whereNotNull('diarsipkan_at')->count(),
            'surat_keluar' => SuratKeluar::query()->whereNull('diarsipkan_at')->count(),
        ];

        return [
            'summary' => $summary,
            'attention' => $this->buildSekdesAttention($summary),
            'monthly_trend' => $this->monthlyTrend(),
            'recent_surat_masuk' => $this->recentSuratMasuk(),
            'recent_disposisi' => $this->recentDisposisi(
                fn (Builder $q) => $q->where('dari_jabatan', Disposisi::DARI_SEKDES),
            ),
            'pending_disposisi' => $this->pendingSuratForSekdes(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function kades(): array
    {
        $disposisiQuery = $this->kadesDisposisiQuery();
        $suratMasukAktif = SuratMasuk::query()->whereNull('diarsipkan_at');

        $summary = [
            'disposisi' => (clone $disposisiQuery)->count(),
            'disposisi_menunggu' => (clone $suratMasukAktif)
                ->where('tingkat', SuratMasuk::TINGKAT_PENTING)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->whereNull('verified_kades_at')
                ->count(),
            'disposisi_diproses' => (clone $suratMasukAktif)
                ->where('tingkat', SuratMasuk::TINGKAT_PENTING)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->whereNotNull('verified_kades_at')
                ->count(),
            'disposisi_selesai' => (clone $disposisiQuery)->count(),
            'disposisi_bulan_ini' => (clone $disposisiQuery)
                ->whereMonth('tanggal', now()->month)
                ->whereYear('tanggal', now()->year)
                ->count(),
            'surat_masuk' => SuratMasuk::query()->whereNull('diarsipkan_at')->count(),
            'arsip' => SuratMasuk::query()->whereNotNull('diarsipkan_at')->count()
                + SuratKeluar::query()->whereNotNull('diarsipkan_at')->count(),
        ];

        return [
            'summary' => $summary,
            'attention' => $this->buildKadesAttention($summary),
            'monthly_trend' => $this->monthlyDisposisiTrend(
                fn (Builder $q) => $q->where('dari_jabatan', Disposisi::DARI_KADES),
            ),
            'recent_disposisi' => $this->recentDisposisi(
                fn (Builder $q) => $q->where('dari_jabatan', Disposisi::DARI_KADES),
            ),
            'pending_disposisi' => $this->pendingSuratForKades(),
        ];
    }

    /**
     * @param  array<string, int>  $summary
     * @return list<array{key: string, label: string, description: string, count: int, route: string, params: array<string, string>, severity: string}>
     */
    private function buildSekdesAttention(array $summary): array
    {
        $items = [
            [
                'key' => 'tanpa_disposisi',
                'label' => 'Surat biasa tanpa disposisi',
                'description' => 'Perlu dibuatkan instruksi disposisi',
                'count' => $summary['surat_masuk_tanpa_disposisi'],
                'route' => 'admin.surat-masuk.index',
                'params' => [
                    'status' => SuratMasuk::STATUS_TERVERIFIKASI,
                    'tingkat' => SuratMasuk::TINGKAT_BIASA,
                ],
                'severity' => 'warning',
            ],
            [
                'key' => 'penting_menunggu_kades',
                'label' => 'Surat penting menunggu Kades',
                'description' => 'Perlu verifikasi Kepala Desa',
                'count' => $summary['disposisi_ke_kades_menunggu'],
                'route' => 'admin.surat-masuk.index',
                'params' => ['kades_aksi' => 'menunggu_verifikasi'],
                'severity' => 'danger',
            ],
            [
                'key' => 'menunggu_review',
                'label' => 'Surat menunggu review',
                'description' => 'Perlu ditelaah dan ditetapkan tingkatnya',
                'count' => $summary['surat_masuk_draft'] ?? $summary['surat_masuk_belum_diproses'],
                'route' => 'admin.surat-masuk.index',
                'params' => ['status' => SuratMasuk::STATUS_DRAFT],
                'severity' => 'info',
            ],
        ];

        return array_values(array_filter(
            $items,
            fn (array $item) => $item['count'] > 0,
        ));
    }

    /**
     * @param  array<string, int>  $summary
     * @return list<array{key: string, label: string, description: string, count: int, route: string, params: array<string, string>, severity: string}>
     */
    private function buildKadesAttention(array $summary): array
    {
        $items = [
            [
                'key' => 'verifikasi_penting',
                'label' => 'Surat penting menunggu verifikasi',
                'description' => 'Perlu verifikasi sebelum disposisi',
                'count' => $summary['disposisi_menunggu'],
                'route' => 'admin.surat-masuk.index',
                'params' => ['kades_aksi' => 'menunggu_verifikasi'],
                'severity' => 'danger',
            ],
            [
                'key' => 'siap_disposisi',
                'label' => 'Surat penting siap disposisi',
                'description' => 'Sudah diverifikasi, menunggu disposisi',
                'count' => $summary['disposisi_diproses'],
                'route' => 'admin.surat-masuk.index',
                'params' => ['kades_aksi' => 'siap_disposisi'],
                'severity' => 'warning',
            ],
        ];

        return array_values(array_filter(
            $items,
            fn (array $item) => $item['count'] > 0,
        ));
    }

    /**
     * @param  array<string, int>  $summary
     * @return list<array{key: string, label: string, description: string, count: int, route: string, params: array<string, string>, severity: string}>
     */
    private function buildAttention(array $summary): array
    {
        $items = [
            [
                'key' => 'menunggu_review',
                'label' => 'Surat menunggu review Sekdes',
                'description' => 'Surat masuk baru belum ditelaah',
                'count' => $summary['surat_masuk_draft'] ?? $summary['surat_masuk_belum_diproses'],
                'route' => 'admin.surat-masuk.index',
                'params' => ['status' => SuratMasuk::STATUS_DRAFT],
                'severity' => 'warning',
            ],
            [
                'key' => 'tanpa_disposisi',
                'label' => 'Surat biasa tanpa disposisi',
                'description' => 'Menunggu disposisi Sekretaris Desa',
                'count' => $summary['surat_masuk_tanpa_disposisi'],
                'route' => 'admin.surat-masuk.index',
                'params' => [
                    'status' => SuratMasuk::STATUS_TERVERIFIKASI,
                    'tingkat' => SuratMasuk::TINGKAT_BIASA,
                ],
                'severity' => 'warning',
            ],
            [
                'key' => 'penting_menunggu_kades',
                'label' => 'Surat penting menunggu Kades',
                'description' => 'Menunggu verifikasi Kepala Desa',
                'count' => $summary['disposisi_menunggu'],
                'route' => 'admin.surat-masuk.index',
                'params' => ['kades_aksi' => 'menunggu_verifikasi'],
                'severity' => 'danger',
            ],
            [
                'key' => 'penting_siap_disposisi',
                'label' => 'Surat penting siap disposisi',
                'description' => 'Sudah diverifikasi Kades, menunggu disposisi',
                'count' => $summary['disposisi_diproses'],
                'route' => 'admin.surat-masuk.index',
                'params' => ['kades_aksi' => 'siap_disposisi'],
                'severity' => 'warning',
            ],
            [
                'key' => 'siap_arsip',
                'label' => 'Surat siap diarsipkan',
                'description' => 'Sudah didisposisikan, belum masuk arsip',
                'count' => $summary['siap_arsip'],
                'route' => 'admin.surat-masuk.index',
                'params' => ['status' => SuratMasuk::STATUS_DIDISPOSISIKAN],
                'severity' => 'info',
            ],
            [
                'key' => 'draft_keluar',
                'label' => 'Surat keluar masih draft',
                'description' => 'Belum dikirim atau difinalisasi',
                'count' => $summary['surat_keluar_draft'],
                'route' => 'admin.surat-keluar.index',
                'params' => ['status' => 'draft'],
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
     * @param  null|callable(Builder<Disposisi>): void  $scope
     * @return list<array{label: string, total: int}>
     */
    private function monthlyDisposisiTrend(?callable $scope = null): array
    {
        $result = [];

        for ($i = 5; $i >= 0; $i--) {
            $start = now()->subMonths($i)->startOfMonth();
            $end = now()->subMonths($i)->endOfMonth();

            $query = Disposisi::query();
            if ($scope) {
                $scope($query);
            }

            $result[] = [
                'label' => $start->translatedFormat('M Y'),
                'total' => (clone $query)
                    ->whereBetween('tanggal', [$start->toDateString(), $end->toDateString()])
                    ->count(),
            ];
        }

        return $result;
    }

    /**
     * @return Builder<Disposisi>
     */
    private function kadesDisposisiQuery(): Builder
    {
        return Disposisi::query()->where('dari_jabatan', Disposisi::DARI_KADES);
    }

    /**
     * Surat penting yang menunggu verifikasi Kepala Desa (tampilan dashboard Sekdes).
     *
     * @return list<array<string, mixed>>
     */
    private function pendingSuratForSekdes(): array
    {
        return SuratMasuk::query()
            ->whereNull('diarsipkan_at')
            ->where('tingkat', SuratMasuk::TINGKAT_PENTING)
            ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
            ->whereNull('verified_kades_at')
            ->orderByDesc('tanggal_terima')
            ->limit(5)
            ->get(['id', 'no_surat', 'pengirim', 'perihal', 'tanggal_terima', 'status', 'tingkat', 'verified_kades_at'])
            ->map(fn (SuratMasuk $s) => [
                'id' => $s->id,
                'no_surat' => $s->no_surat,
                'pengirim' => $s->pengirim,
                'perihal' => $s->perihal,
                'tanggal' => $s->tanggal_terima?->format('Y-m-d'),
                'status' => $s->status_tampil,
                'tingkat' => $s->tingkat,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function pendingSuratForKades(): array
    {
        return SuratMasuk::query()
            ->whereNull('diarsipkan_at')
            ->where('tingkat', SuratMasuk::TINGKAT_PENTING)
            ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
            ->orderByDesc('tanggal_terima')
            ->limit(5)
            ->get(['id', 'no_surat', 'pengirim', 'perihal', 'tanggal_terima', 'status', 'tingkat', 'verified_kades_at'])
            ->map(fn (SuratMasuk $s) => [
                'id' => $s->id,
                'no_surat' => $s->no_surat,
                'pengirim' => $s->pengirim,
                'perihal' => $s->perihal,
                'tanggal' => $s->tanggal_terima?->format('Y-m-d'),
                'status' => $s->status_tampil,
                'tingkat' => $s->tingkat,
            ])
            ->values()
            ->all();
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
            ->get(['id', 'no_surat', 'pengirim', 'perihal', 'tanggal_terima', 'status', 'tingkat', 'verified_kades_at'])
            ->map(fn (SuratMasuk $s) => [
                'id' => $s->id,
                'no_surat' => $s->no_surat,
                'pengirim' => $s->pengirim,
                'perihal' => $s->perihal,
                'tanggal_terima' => $s->tanggal_terima?->format('Y-m-d'),
                'status' => $s->status_tampil,
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
     * @param  null|callable(Builder<Disposisi>): void  $scope
     * @return list<array<string, mixed>>
     */
    private function recentDisposisi(?callable $scope = null): array
    {
        $query = Disposisi::query()
            ->with('suratMasuk:id,no_surat,perihal,pengirim,status,tingkat,verified_kades_at,diarsipkan_at')
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->limit(5);

        if ($scope) {
            $scope($query);
        }

        return $query
            ->get()
            ->map(fn (Disposisi $d) => $this->mapDisposisiRow($d))
            ->values()
            ->all();
    }

    /**
     * @param  null|callable(Builder<Disposisi>): void  $scope
     * @return list<array<string, mixed>>
     */
    private function pendingDisposisi(?callable $scope = null): array
    {
        $query = Disposisi::query()
            ->with('suratMasuk:id,no_surat,perihal,pengirim,status,tingkat,verified_kades_at,diarsipkan_at')
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->limit(5);

        if ($scope) {
            $scope($query);
        }

        return $query
            ->get()
            ->map(fn (Disposisi $d) => $this->mapDisposisiRow($d))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function mapDisposisiRow(Disposisi $d): array
    {
        return [
            'id' => $d->id,
            'kepada' => $d->kepada,
            'dari_jabatan' => $d->dari_jabatan,
            'tanggal' => $d->tanggal?->format('Y-m-d'),
            'surat_status' => $d->suratMasuk?->status_tampil,
            'surat_masuk' => $d->suratMasuk ? [
                'id' => $d->suratMasuk->id,
                'no_surat' => $d->suratMasuk->no_surat,
                'perihal' => $d->suratMasuk->perihal,
                'pengirim' => $d->suratMasuk->pengirim,
            ] : null,
        ];
    }
}
