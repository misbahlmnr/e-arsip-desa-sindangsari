<?php

namespace Database\Seeders;

use App\Models\JabatanTujuanDisposisi;
use Illuminate\Database\Seeder;

class JabatanTujuanDisposisiSeeder extends Seeder
{
    /** @var list<string> */
    private const JABATAN = [
        'Kaur Pemerintahan',
        'Kaur Keuangan',
        'Kaur Umum',
        'Kasi Pelayanan',
        'Kasi Kesejahteraan',
        'Kasi Pemerintahan',
    ];

    public function run(): void
    {
        foreach (self::JABATAN as $index => $nama) {
            JabatanTujuanDisposisi::query()->updateOrCreate(
                ['nama_jabatan' => $nama],
                [
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ],
            );
        }
    }
}
