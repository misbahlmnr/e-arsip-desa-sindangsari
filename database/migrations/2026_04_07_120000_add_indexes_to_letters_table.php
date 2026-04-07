<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Support common filters and ORDER BY (prefix indexes; tune further if needed).
     */
    public function up(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            // no_surat already indexed via unique() in create_letters_table
            $table->index('pengirim');
            $table->index('perihal');
            $table->index('tanggal_terima');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            $table->dropIndex(['pengirim']);
            $table->dropIndex(['perihal']);
            $table->dropIndex(['tanggal_terima']);
        });
    }
};
