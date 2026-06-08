<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JabatanTujuanDisposisi extends Model
{
    protected $table = 'jabatan_tujuan_disposisi';

    protected $fillable = [
        'nama_jabatan',
        'is_active',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function disposisi(): HasMany
    {
        return $this->hasMany(Disposisi::class, 'jabatan_tujuan_id');
    }

    /**
     * @return list<array{id: int, nama_jabatan: string}>
     */
    public static function activeOptions(): array
    {
        return static::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('nama_jabatan')
            ->get(['id', 'nama_jabatan'])
            ->map(fn (self $j) => [
                'id' => $j->id,
                'nama_jabatan' => $j->nama_jabatan,
            ])
            ->values()
            ->all();
    }
}
