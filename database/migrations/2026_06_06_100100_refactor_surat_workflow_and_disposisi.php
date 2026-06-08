<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->string('tingkat', 16)->nullable()->after('status');
            $table->timestamp('verified_sekdes_at')->nullable()->after('tingkat');
            $table->foreignId('verified_sekdes_by')->nullable()->after('verified_sekdes_at')
                ->constrained('users')->nullOnDelete();
            $table->timestamp('verified_kades_at')->nullable()->after('verified_sekdes_by');
            $table->foreignId('verified_kades_by')->nullable()->after('verified_kades_at')
                ->constrained('users')->nullOnDelete();
        });

        $this->migrateSuratMasukStatuses();
        $this->seedJabatanTujuan();

        Schema::table('disposisi', function (Blueprint $table) {
            $table->foreignId('jabatan_tujuan_id')->nullable()->after('user_id')
                ->constrained('jabatan_tujuan_disposisi')->nullOnDelete();
            $table->string('dari_jabatan', 64)->nullable()->after('jabatan_tujuan_id');
        });

        $this->migrateDisposisiRecords();

        Schema::table('disposisi', function (Blueprint $table) {
            $table->dropIndex(['status', 'tanggal']);
            $table->dropColumn('status');
        });
    }

    public function down(): void
    {
        Schema::table('disposisi', function (Blueprint $table) {
            $table->string('status')->default('menunggu')->after('catatan');
            $table->index(['status', 'tanggal']);
        });

        DB::table('disposisi')->update(['status' => 'diproses']);

        Schema::table('disposisi', function (Blueprint $table) {
            $table->dropConstrainedForeignId('jabatan_tujuan_id');
            $table->dropColumn('dari_jabatan');
        });

        DB::table('surat_masuk')->where('status', 'draft')->update(['status' => 'belum_diproses']);
        DB::table('surat_masuk')->where('status', 'terverifikasi')->update(['status' => 'sedang_diproses']);
        DB::table('surat_masuk')->whereIn('status', ['didisposisikan', 'diarsipkan'])->update(['status' => 'selesai']);

        Schema::table('surat_masuk', function (Blueprint $table) {
            $table->dropConstrainedForeignId('verified_sekdes_by');
            $table->dropConstrainedForeignId('verified_kades_by');
            $table->dropColumn([
                'tingkat',
                'verified_sekdes_at',
                'verified_kades_at',
            ]);
        });
    }

    private function seedJabatanTujuan(): void
    {
        $jabatan = [
            'Kaur Pemerintahan',
            'Kaur Keuangan',
            'Kaur Umum',
            'Kasi Pelayanan',
            'Kasi Kesejahteraan',
            'Kasi Pemerintahan',
        ];

        foreach ($jabatan as $index => $nama) {
            DB::table('jabatan_tujuan_disposisi')->updateOrInsert(
                ['nama_jabatan' => $nama],
                [
                    'is_active' => true,
                    'sort_order' => $index + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            );
        }
    }

    private function migrateSuratMasukStatuses(): void
    {
        $idsWithDisposisi = DB::table('disposisi')->distinct()->pluck('surat_masuk_id');

        DB::table('surat_masuk')->where('status', 'belum_diproses')->update(['status' => 'draft']);

        foreach ($idsWithDisposisi as $id) {
            DB::table('surat_masuk')->where('id', $id)->where('status', 'sedang_diproses')
                ->update(['status' => 'didisposisikan']);
        }

        DB::table('surat_masuk')->where('status', 'sedang_diproses')->update(['status' => 'terverifikasi']);
        DB::table('surat_masuk')->where('status', 'selesai')->whereNotNull('diarsipkan_at')
            ->update(['status' => 'diarsipkan']);
        DB::table('surat_masuk')->where('status', 'selesai')->update(['status' => 'didisposisikan']);
        DB::table('surat_masuk')->whereNotNull('diarsipkan_at')->update(['status' => 'diarsipkan']);

        DB::table('surat_masuk')->whereIn('status', ['terverifikasi', 'didisposisikan'])
            ->update(['tingkat' => 'biasa']);
    }

    private function migrateDisposisiRecords(): void
    {
        $jabatanMap = DB::table('jabatan_tujuan_disposisi')->pluck('id', 'nama_jabatan');

        $rows = DB::table('disposisi')->get();

        foreach ($rows as $row) {
            $jabatanId = $jabatanMap[$row->kepada] ?? null;
            $dariJabatan = 'Sekretaris Desa';

            if (stripos($row->kepada, 'Kepala Desa') !== false) {
                $dariJabatan = 'Kepala Desa';
            }

            DB::table('disposisi')->where('id', $row->id)->update([
                'jabatan_tujuan_id' => $jabatanId,
                'dari_jabatan' => $dariJabatan,
            ]);
        }
    }
};
