<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
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
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_terima' => 'date:Y-m-d',
            'tanggal_surat' => 'date:Y-m-d',
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
}
