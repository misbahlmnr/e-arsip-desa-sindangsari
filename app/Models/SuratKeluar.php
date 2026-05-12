<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SuratKeluar extends Model
{
    protected $table = 'surat_keluar';

    protected $fillable = [
        'no_surat',
        'tanggal_kirim',
        'tujuan',
        'perihal',
        'catatan',
        'status',
        'file',
        'diarsipkan_at',
    ];

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
}
