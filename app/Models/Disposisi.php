<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disposisi extends Model
{
    protected $table = 'disposisi';

    public const STATUS_MENUNGGU = 'menunggu';

    public const STATUS_DIPROSES = 'diproses';

    public const STATUS_SELESAI = 'selesai';

    /** @var list<string> */
    public const STATUSES = [
        self::STATUS_MENUNGGU,
        self::STATUS_DIPROSES,
        self::STATUS_SELESAI,
    ];

    /** @var list<string> */
    public const TUJUAN_OPTIONS = [
        'Kepala Desa',
        'Sekretaris Desa',
        'Kaur Pemerintahan',
        'Kaur Keuangan',
        'Kaur Umum',
    ];

    protected $fillable = [
        'surat_masuk_id',
        'user_id',
        'kepada',
        'catatan',
        'status',
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

    public function isForKades(): bool
    {
        return stripos($this->kepada, 'Kepala Desa') !== false;
    }

    public static function initialStatusFor(string $kepada): string
    {
        return stripos($kepada, 'Kepala Desa') !== false
            ? self::STATUS_MENUNGGU
            : self::STATUS_DIPROSES;
    }
}
