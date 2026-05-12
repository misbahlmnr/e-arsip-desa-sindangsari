<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->timestamp('diarsipkan_at')->nullable()->after('updated_at');
            $table->index('diarsipkan_at');
        });

        Schema::table('surat_keluar', function (Blueprint $table) {
            $table->timestamp('diarsipkan_at')->nullable()->after('updated_at');
            $table->index('diarsipkan_at');
        });
    }

    public function down(): void
    {
        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->dropIndex(['diarsipkan_at']);
            $table->dropColumn('diarsipkan_at');
        });

        Schema::table('surat_keluar', function (Blueprint $table) {
            $table->dropIndex(['diarsipkan_at']);
            $table->dropColumn('diarsipkan_at');
        });
    }
};
