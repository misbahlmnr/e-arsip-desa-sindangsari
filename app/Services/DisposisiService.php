<?php

namespace App\Services;

use App\Http\Requests\Disposisi\StoreFromSuratRequest;
use App\Http\Requests\Disposisi\StoreRequest;
use App\Models\Disposisi;
use App\Models\JabatanTujuanDisposisi;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class DisposisiService
{
    /**
     * @var list<string>
     */
    private const SORTABLE = [
        'id',
        'tanggal',
        'kepada',
        'dari_jabatan',
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
            'surat_status' => ['nullable', 'in:'.implode(',', SuratMasuk::STATUSES)],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortBy = $validated['sort_by'] ?? 'tanggal';
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $suratStatus = $validated['surat_status'] ?? null;

        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'tanggal';
        }

        /** @var User $user */
        $user = $req->user();
        $dariJabatan = $user->isKades() ? Disposisi::DARI_KADES : Disposisi::DARI_SEKDES;

        $query = Disposisi::query()
            ->with([
                'suratMasuk:id,no_surat,pengirim,perihal,status,tingkat,verified_kades_at,diarsipkan_at',
                'user:id,name,role',
            ])
            ->where('dari_jabatan', $dariJabatan)
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
            ->when($suratStatus, fn ($q) => $q->whereHas(
                'suratMasuk',
                fn ($s) => $s->where('status', $suratStatus),
            ))
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
                'surat_status' => $suratStatus,
            ],
        ];
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function suratOptions(User $user): Collection
    {
        $query = SuratMasuk::query()
            ->whereNull('diarsipkan_at')
            ->orderByDesc('tanggal_terima');

        if ($user->isSekdes()) {
            $query->where('tingkat', SuratMasuk::TINGKAT_BIASA)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI);
        } elseif ($user->isKades()) {
            $query->where('tingkat', SuratMasuk::TINGKAT_PENTING)
                ->where('status', SuratMasuk::STATUS_TERVERIFIKASI)
                ->whereNotNull('verified_kades_at');
        }

        return $query
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
        /** @var User $user */
        $user = $req->user();
        $letter = $suratMasuk ?? SuratMasuk::query()->findOrFail($data['surat_masuk_id']);

        $this->assertCanCreate($letter, $user);

        $jabatan = JabatanTujuanDisposisi::query()->findOrFail($data['jabatan_tujuan_id']);

        $disposisi = Disposisi::create([
            'surat_masuk_id' => $letter->id,
            'user_id' => $user->id,
            'jabatan_tujuan_id' => $jabatan->id,
            'dari_jabatan' => $this->dariJabatanFor($user),
            'kepada' => $jabatan->nama_jabatan,
            'catatan' => $data['catatan'],
            'tanggal' => $data['tanggal'],
        ]);

        $this->advanceSuratStatus($letter);

        return $disposisi;
    }

    public function storeFromSurat(StoreFromSuratRequest $req, SuratMasuk $suratMasuk): Disposisi
    {
        /** @var User $user */
        $user = $req->user();
        $data = $req->validated();

        $this->assertCanCreate($suratMasuk, $user);

        $jabatan = JabatanTujuanDisposisi::query()->findOrFail($data['jabatan_tujuan_id']);

        $disposisi = Disposisi::create([
            'surat_masuk_id' => $suratMasuk->id,
            'user_id' => $user->id,
            'jabatan_tujuan_id' => $jabatan->id,
            'dari_jabatan' => $this->dariJabatanFor($user),
            'kepada' => $jabatan->nama_jabatan,
            'catatan' => $data['catatan'],
            'tanggal' => now()->toDateString(),
        ]);

        $this->advanceSuratStatus($suratMasuk);

        return $disposisi;
    }

    /**
     * @return array<string, mixed>
     */
    public function formatDetail(Disposisi $disposisi): array
    {
        $disposisi->loadMissing(['suratMasuk', 'user', 'jabatanTujuan']);

        return [
            'id' => $disposisi->id,
            'surat_masuk_id' => $disposisi->surat_masuk_id,
            'jabatan_tujuan_id' => $disposisi->jabatan_tujuan_id,
            'kepada' => $disposisi->kepada,
            'dari_jabatan' => $disposisi->dari_jabatan,
            'catatan' => $disposisi->catatan,
            'tanggal' => $disposisi->tanggal?->format('Y-m-d'),
            'created_at' => $disposisi->created_at?->toIso8601String(),
            'dari' => $disposisi->user?->name,
            'dari_role' => $disposisi->user?->role,
            'surat_masuk' => $disposisi->suratMasuk ? [
                'id' => $disposisi->suratMasuk->id,
                'no_surat' => $disposisi->suratMasuk->no_surat,
                'pengirim' => $disposisi->suratMasuk->pengirim,
                'perihal' => $disposisi->suratMasuk->perihal,
                'tanggal_terima' => $disposisi->suratMasuk->tanggal_terima?->format('Y-m-d'),
                'status' => $disposisi->suratMasuk->status,
                'status_tampil' => $disposisi->suratMasuk->status_tampil,
                'tingkat' => $disposisi->suratMasuk->tingkat,
                'verified_kades_at' => $disposisi->suratMasuk->verified_kades_at?->toISOString(),
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
                'dari' => $d->dari_jabatan ?? $d->user?->name,
                'kepada' => $d->kepada,
                'catatan' => $d->catatan,
                'tanggal' => $d->tanggal?->format('Y-m-d'),
                'created_at' => $d->created_at?->toIso8601String(),
            ])
            ->all();
    }

    private function assertCanCreate(SuratMasuk $letter, User $user): void
    {
        if (! $letter->canCreateDisposisi($user)) {
            throw ValidationException::withMessages([
                'surat_masuk_id' => 'Surat belum memenuhi syarat untuk dibuatkan disposisi.',
            ]);
        }
    }

    private function advanceSuratStatus(SuratMasuk $letter): void
    {
        if ($letter->status === SuratMasuk::STATUS_TERVERIFIKASI) {
            $letter->update(['status' => SuratMasuk::STATUS_DIDISPOSISIKAN]);
        }
    }

    private function dariJabatanFor(User $user): string
    {
        return $user->isKades() ? Disposisi::DARI_KADES : Disposisi::DARI_SEKDES;
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
            'surat_status' => $d->suratMasuk?->status,
            'surat_status_tampil' => $d->suratMasuk?->status_tampil,
            'surat_tingkat' => $d->suratMasuk?->tingkat,
            'surat_verified_kades_at' => $d->suratMasuk?->verified_kades_at?->toISOString(),
            'pengirim' => $d->user?->name,
            'dari_jabatan' => $d->dari_jabatan,
            'kepada' => $d->kepada,
            'catatan' => $d->catatan,
            'tanggal' => $d->tanggal?->format('Y-m-d'),
        ];
    }
}
