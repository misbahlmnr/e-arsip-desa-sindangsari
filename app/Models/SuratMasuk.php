<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class SuratMasuk extends Model
{
    public const STATUS_DRAFT = 'draft';

    public const STATUS_TERVERIFIKASI = 'terverifikasi';

    public const STATUS_DIDISPOSISIKAN = 'didisposisikan';

    public const STATUS_DIARSIPKAN = 'diarsipkan';

    /** @var list<string> */
    public const STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_TERVERIFIKASI,
        self::STATUS_DIDISPOSISIKAN,
        self::STATUS_DIARSIPKAN,
    ];

    public const TINGKAT_BIASA = 'biasa';

    public const TINGKAT_PENTING = 'penting';

    /** @var list<string> */
    public const TINGKAT_OPTIONS = [
        self::TINGKAT_BIASA,
        self::TINGKAT_PENTING,
    ];

    protected $table = 'surat_masuk';

    protected $fillable = [
        'no_surat',
        'tanggal_terima',
        'tanggal_surat',
        'pengirim',
        'perihal',
        'catatan',
        'status',
        'tingkat',
        'tujuan',
        'file',
        'diarsipkan_at',
        'verified_sekdes_at',
        'verified_sekdes_by',
        'verified_kades_at',
        'verified_kades_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_terima' => 'date:Y-m-d',
            'tanggal_surat' => 'date:Y-m-d',
            'diarsipkan_at' => 'datetime',
            'verified_sekdes_at' => 'datetime',
            'verified_kades_at' => 'datetime',
        ];
    }

    /**
     * @var list<string>
     */
    protected $appends = [
        'file_url',
    ];

    public function getFileUrlAttribute(): ?string
    {
        if (! $this->file) {
            return null;
        }

        return Storage::disk('public')->url($this->file);
    }

    public function disposisi(): HasMany
    {
        return $this->hasMany(Disposisi::class)->latest();
    }

    public function suratKeluar(): HasMany
    {
        return $this->hasMany(SuratKeluar::class);
    }

    public function verifiedSekdesBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_sekdes_by');
    }

    public function verifiedKadesBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_kades_by');
    }

    public function hasDisposisi(): bool
    {
        if ($this->relationLoaded('disposisi')) {
            return $this->disposisi->isNotEmpty();
        }

        return $this->disposisi()->exists();
    }

    public function isArchived(): bool
    {
        return $this->diarsipkan_at !== null || $this->status === self::STATUS_DIARSIPKAN;
    }

    public function canReviewBySekdes(): bool
    {
        return $this->status === self::STATUS_DRAFT && ! $this->isArchived();
    }

    public function canVerifyByKades(): bool
    {
        return $this->tingkat === self::TINGKAT_PENTING
            && $this->status === self::STATUS_TERVERIFIKASI
            && $this->verified_kades_at === null
            && ! $this->isArchived();
    }

    public function canCreateDisposisi(User $user): bool
    {
        if ($this->isArchived()) {
            return false;
        }

        if ($user->isSekdes()) {
            return $this->tingkat === self::TINGKAT_BIASA
                && $this->status === self::STATUS_TERVERIFIKASI;
        }

        if ($user->isKades()) {
            return $this->tingkat === self::TINGKAT_PENTING
                && $this->verified_kades_at !== null
                && $this->status === self::STATUS_TERVERIFIKASI;
        }

        return false;
    }

    public function canArchive(): bool
    {
        return $this->status === self::STATUS_DIDISPOSISIKAN && ! $this->isArchived();
    }
}
