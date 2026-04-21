<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('letters') && ! Schema::hasTable('surat_masuk')) {
            Schema::rename('letters', 'surat_masuk');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('surat_masuk') && ! Schema::hasTable('letters')) {
            Schema::rename('surat_masuk', 'letters');
        }
    }
};
