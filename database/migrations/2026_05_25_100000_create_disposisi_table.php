<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disposisi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_masuk_id')->constrained('surat_masuk')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('kepada');
            $table->text('catatan');
            $table->string('status')->default('menunggu');
            $table->date('tanggal');
            $table->timestamps();

            $table->index(['status', 'tanggal']);
            $table->index('kepada');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disposisi');
    }
};
