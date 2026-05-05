<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Kolom tambahan & lampiran opsional agar selaras dengan form desain (tanggal surat, catatan, file opsional).
     */
    public function up(): void
    {
        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->date('tanggal_surat')->nullable()->after('tanggal_terima');
            $table->text('catatan')->nullable()->after('perihal');
        });

        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->string('file')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->dropColumn(['tanggal_surat', 'catatan']);
        });

        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->string('file')->nullable(false)->change();
        });
    }
};
