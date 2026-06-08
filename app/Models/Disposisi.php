<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disposisi extends Model
{
    public const DARI_SEKDES = 'Sekretaris Desa';

    public const DARI_KADES = 'Kepala Desa';

    protected $table = 'disposisi';

    protected $fillable = [
        'surat_masuk_id',
        'user_id',
        'jabatan_tujuan_id',
        'dari_jabatan',
        'kepada',
        'catatan',
        'tanggal',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal' => 'date:Y-m-d',
        ];
    }

    public function suratMasuk(): BelongsTo
    {
        return $this->belongsTo(SuratMasuk::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jabatanTujuan(): BelongsTo
    {
        return $this->belongsTo(JabatanTujuanDisposisi::class, 'jabatan_tujuan_id');
    }
}
