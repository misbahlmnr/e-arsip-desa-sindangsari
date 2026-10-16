<?php

namespace App\Models;

use App\Services\NomorAgendaService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class SuratKeluar extends Model
{
    protected $table = 'surat_keluar';

    protected $fillable = [
        'surat_masuk_id',
        'no_surat',
        'nomor_agenda',
        'tanggal_kirim',
        'tujuan',
        'perihal',
        'catatan',
        'file',
        'diarsipkan_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (SuratKeluar $letter): void {
            if (filled($letter->nomor_agenda) || $letter->tanggal_kirim === null) {
                return;
            }

            $letter->nomor_agenda = app(NomorAgendaService::class)->next(
                NomorAgendaService::KODE_KELUAR,
                $letter->tanggal_kirim,
                self::class,
            );
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_kirim' => 'date:Y-m-d',
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

    public function suratMasuk(): BelongsTo
    {
        return $this->belongsTo(SuratMasuk::class);
    }

    public function supportingDocuments(): HasMany
    {
        return $this->hasMany(SupportingDocument::class)
            ->orderBy('sort_order')
            ->orderBy('id');
    }
}
