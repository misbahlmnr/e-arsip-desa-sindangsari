<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class SuratMasuk extends Model
{
    protected $table = 'surat_masuk';

    protected $fillable = [
        'no_surat',
        'tanggal_terima',
        'tanggal_surat',
        'pengirim',
        'perihal',
        'catatan',
        'status',
        'tujuan',
        'file',
        'diarsipkan_at',
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

    public function hasDisposisi(): bool
    {
        if ($this->relationLoaded('disposisi')) {
            return $this->disposisi->isNotEmpty();
        }

        return $this->disposisi()->exists();
    }
}
