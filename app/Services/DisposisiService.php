<?php

namespace App\Services;

use App\Http\Requests\Disposisi\StoreFromSuratRequest;
use App\Http\Requests\Disposisi\StoreRequest;
use App\Models\Disposisi;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;

class DisposisiService
{
    /**
     * @var list<string>
     */
    private const SORTABLE = [
        'id',
        'tanggal',
        'status',
        'kepada',
        'created_at',
    ];

    /**
     * @return array{disposisi: LengthAwarePaginator, filters: array<string, mixed>}
     */
    public function index(Request $req): array
    {
        $validated = $req->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'max:64'],
            'sort_dir' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'in:10,20,50,100'],
            'status' => ['nullable', Rule::in(Disposisi::STATUSES)],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortBy = $validated['sort_by'] ?? 'tanggal';
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $status = $validated['status'] ?? null;

        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'tanggal';
        }

        /** @var User $user */
        $user = $req->user();

        $query = Disposisi::query()
            ->with([
                'suratMasuk:id,no_surat,pengirim,perihal',
                'user:id,name,role',
            ])
            ->when($user->isKades(), function ($q) {
                $q->where(function ($q) {
                    $q->where('kepada', 'like', '%Kepala Desa%')
                        ->orWhereHas('user', fn ($u) => $u->where('role', 'kades'));
                });
            })
            ->when($search !== '', function ($q) use ($search) {
                $like = '%'.$search.'%';
                $q->where(function ($q) use ($like) {
                    $q->where('kepada', 'like', $like)
                        ->orWhere('catatan', 'like', $like)
                        ->orWhereHas('suratMasuk', function ($q) use ($like) {
                            $q->where('no_surat', 'like', $like)
                                ->orWhere('pengirim', 'like', $like)
                                ->orWhere('perihal', 'like', $like);
                        })
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'like', $like));
                });
            })
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderBy($sortBy, $sortDir);

        $disposisi = $query->paginate($perPage)->withQueryString();
        $disposisi->getCollection()->transform(fn (Disposisi $d) => $this->formatListItem($d));

        return [
            'disposisi' => $disposisi,
            'filters' => [
                'search' => $search !== '' ? $search : null,
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
                'per_page' => $perPage,
                'status' => $status,
            ],
        ];
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function suratOptions(): Collection
    {
        return SuratMasuk::query()
            ->whereNull('diarsipkan_at')
            ->orderByDesc('tanggal_terima')
            ->get(['id', 'no_surat', 'pengirim', 'perihal'])
            ->map(fn (SuratMasuk $s) => [
                'id' => $s->id,
                'label' => "{$s->no_surat} — {$s->perihal}",
                'no_surat' => $s->no_surat,
                'pengirim' => $s->pengirim,
            ]);
    }

    public function store(StoreRequest $req, ?SuratMasuk $suratMasuk = null): Disposisi
    {
        $data = $req->validated();
        $letter = $suratMasuk ?? SuratMasuk::query()->findOrFail($data['surat_masuk_id']);

        $disposisi = Disposisi::create([
            'surat_masuk_id' => $letter->id,
            'user_id' => $req->user()->id,
            'kepada' => $data['kepada'],
            'catatan' => $data['catatan'],
            'tanggal' => $data['tanggal'],
            'status' => Disposisi::initialStatusFor($data['kepada']),
        ]);

        if ($letter->status === 'belum_diproses') {
            $letter->update(['status' => 'sedang_diproses']);
        }

        return $disposisi;
    }

    public function storeFromSurat(StoreFromSuratRequest $req, SuratMasuk $suratMasuk): Disposisi
    {
        $data = $req->validated();

        $disposisi = Disposisi::create([
            'surat_masuk_id' => $suratMasuk->id,
            'user_id' => $req->user()->id,
            'kepada' => $data['kepada'],
            'catatan' => $data['catatan'],
            'tanggal' => now()->toDateString(),
            'status' => Disposisi::initialStatusFor($data['kepada']),
        ]);

        if ($suratMasuk->status === 'belum_diproses') {
            $suratMasuk->update(['status' => 'sedang_diproses']);
        }

        return $disposisi;
    }

    public function updateStatus(Disposisi $disposisi, string $status): Disposisi
    {
        $disposisi->update(['status' => $status]);

        if ($status === Disposisi::STATUS_SELESAI && $disposisi->suratMasuk) {
            $letter = $disposisi->suratMasuk;
            if ($letter->status !== 'selesai') {
                $letter->update(['status' => 'selesai']);
            }
        }

        return $disposisi->fresh(['suratMasuk', 'user']);
    }

    /**
     * @return array<string, mixed>
     */
    public function formatDetail(Disposisi $disposisi): array
    {
        $disposisi->loadMissing(['suratMasuk', 'user']);

        return [
            'id' => $disposisi->id,
            'surat_masuk_id' => $disposisi->surat_masuk_id,
            'kepada' => $disposisi->kepada,
            'catatan' => $disposisi->catatan,
            'status' => $disposisi->status,
            'tanggal' => $disposisi->tanggal?->format('Y-m-d'),
            'created_at' => $disposisi->created_at?->toIso8601String(),
            'dari' => $disposisi->user?->name,
            'dari_role' => $disposisi->user?->role,
            'can_update_status' => $this->canUpdateStatus($disposisi),
            'surat_masuk' => $disposisi->suratMasuk ? [
                'id' => $disposisi->suratMasuk->id,
                'no_surat' => $disposisi->suratMasuk->no_surat,
                'pengirim' => $disposisi->suratMasuk->pengirim,
                'perihal' => $disposisi->suratMasuk->perihal,
                'tanggal_terima' => $disposisi->suratMasuk->tanggal_terima?->format('Y-m-d'),
                'status' => $disposisi->suratMasuk->status,
            ] : null,
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function formatTimelineForSurat(SuratMasuk $suratMasuk): array
    {
        return $suratMasuk->disposisi()
            ->with('user:id,name')
            ->get()
            ->map(fn (Disposisi $d) => [
                'id' => $d->id,
                'dari' => $d->user?->name,
                'kepada' => $d->kepada,
                'catatan' => $d->catatan,
                'status' => $d->status,
                'tanggal' => $d->tanggal?->format('Y-m-d'),
                'created_at' => $d->created_at?->toIso8601String(),
            ])
            ->all();
    }

    public function canUpdateStatus(Disposisi $disposisi): bool
    {
        $user = auth()->user();
        if (! $user?->isKades()) {
            return false;
        }

        if (! $disposisi->isForKades()) {
            return false;
        }

        return in_array($disposisi->status, [
            Disposisi::STATUS_MENUNGGU,
            Disposisi::STATUS_DIPROSES,
        ], true);
    }

    /**
     * @return array<string, mixed>
     */
    private function formatListItem(Disposisi $d): array
    {
        $d->loadMissing(['suratMasuk', 'user']);

        return [
            'id' => $d->id,
            'no_surat' => $d->suratMasuk?->no_surat,
            'surat_masuk_id' => $d->surat_masuk_id,
            'pengirim' => $d->user?->name,
            'kepada' => $d->kepada,
            'catatan' => $d->catatan,
            'tanggal' => $d->tanggal?->format('Y-m-d'),
            'status' => $d->status,
            'can_update_status' => $this->canUpdateStatus($d),
        ];
    }
}
