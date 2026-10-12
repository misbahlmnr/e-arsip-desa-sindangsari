<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            JabatanTujuanDisposisiSeeder::class,
            SuratMasukSeeder::class,
            SuratKeluarSeeder::class,
            // DesaWorkflowSeeder::class,
        ]);
    }
}
