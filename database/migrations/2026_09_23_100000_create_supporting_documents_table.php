<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supporting_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_masuk_id')->nullable()->constrained('surat_masuk')->cascadeOnDelete();
            $table->foreignId('surat_keluar_id')->nullable()->constrained('surat_keluar')->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('original_name');
            $table->string('file_name');
            $table->string('mime_type', 127)->nullable();
            $table->unsignedBigInteger('file_size')->default(0);
            $table->string('file_path');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supporting_documents');
    }
};
