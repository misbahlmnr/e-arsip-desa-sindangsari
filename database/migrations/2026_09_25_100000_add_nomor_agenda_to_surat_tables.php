<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->string('nomor_agenda', 20)->nullable()->unique()->after('no_surat');
        });

        Schema::table('surat_keluar', function (Blueprint $table) {
            $table->string('nomor_agenda', 20)->nullable()->unique()->after('no_surat');
        });

        $this->backfill('surat_masuk', 'SM', 'tanggal_terima');
        $this->backfill('surat_keluar', 'SK', 'tanggal_kirim');
    }

    public function down(): void
    {
        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->dropUnique(['nomor_agenda']);
            $table->dropColumn('nomor_agenda');
        });

        Schema::table('surat_keluar', function (Blueprint $table) {
            $table->dropUnique(['nomor_agenda']);
            $table->dropColumn('nomor_agenda');
        });
    }

    private function backfill(string $table, string $kode, string $dateColumn): void
    {
        $rows = DB::table($table)
            ->orderBy($dateColumn)
            ->orderBy('id')
            ->get(['id', $dateColumn]);

        $counters = [];

        foreach ($rows as $row) {
            $date = Carbon::parse($row->{$dateColumn});
            $key = $date->format('Y-m');
            $counters[$key] = ($counters[$key] ?? 0) + 1;

            DB::table($table)->where('id', $row->id)->update([
                'nomor_agenda' => sprintf('%s/%s/%04d', $kode, $date->format('Y/m'), $counters[$key]),
            ]);
        }
    }
};
