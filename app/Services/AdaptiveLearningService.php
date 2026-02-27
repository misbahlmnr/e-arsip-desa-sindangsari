<?php

namespace App\Services;

use App\Models\User;
use App\Models\Nilai;
use App\Models\Materi;
use App\Models\MateriRekomendasi;
use App\Models\AdaptiveRule;
use Illuminate\Support\Facades\Log;

class AdaptiveLearningService
{
    public function generateRecommendations(User $siswa)
    {
        // Validate siswa has kelas
        if (!$siswa->siswaProfile || !$siswa->siswaProfile->kelas_id) {
            Log::info("Adaptive Learning: Siswa {$siswa->id} belum memiliki kelas");
            return [];
        }

        $kelasId = $siswa->siswaProfile->kelas_id;

        // Get student's grades
        $nilaiSiswa = Nilai::where('siswa_id', $siswa->id)->with(['tugas.mapel'])->get();

        $recommendations = [];

        foreach ($nilaiSiswa as $nilai) {
            $tugas = $nilai->tugas;
            $mapel = $tugas->mapel;

            // Check adaptive rules
            $rules = AdaptiveRule::where('mapel_id', $mapel->id)->get();

            foreach ($rules as $rule) {
                if ($nilai->skor < $rule->min_score) {
                    Log::info("Adaptive Learning: Siswa {$siswa->id} nilai {$nilai->skor} < {$rule->min_score} pada mapel {$mapel->nama}");

                    // Find ALL related materials for this mapel and kelas (not just 'mudah')
                    $relatedMaterials = Materi::where('mapel_id', $mapel->id)
                        ->where('kelas_id', $kelasId)
                        ->get();

                    Log::info("Adaptive Learning: Ditemukan {$relatedMaterials->count()} materi untuk mapel {$mapel->nama} kelas {$kelasId}");

                    foreach ($relatedMaterials as $materi) {
                        // Check if recommendation already exists (aktif or selesai)
                        $existing = MateriRekomendasi::where('siswa_id', $siswa->id)
                            ->where('materi_id', $materi->id)
                            ->first(); // Remove status filter to check all recommendations

                        if (!$existing) {
                            Log::info("Adaptive Learning: Membuat rekomendasi materi {$materi->judul} untuk siswa {$siswa->id}");

                            MateriRekomendasi::create([
                                'siswa_id' => $siswa->id,
                                'materi_id' => $materi->id,
                                'alasan' => "Nilai {$nilai->skor} pada {$tugas->judul} di bawah threshold {$rule->min_score}. Direkomendasikan belajar ulang materi {$materi->judul} ({$materi->tingkat_kesulitan})",
                                'status' => 'aktif',
                            ]);

                            $recommendations[] = $materi;
                        } else {
                            Log::info("Adaptive Learning: Rekomendasi materi {$materi->judul} sudah ada untuk siswa {$siswa->id}");
                        }
                    }
                }
            }
        }

        return $recommendations;
    }

    public function getRecommendationsForStudent(User $siswa)
    {
        return MateriRekomendasi::where('siswa_id', $siswa->id)
            ->where('status', 'aktif')
            ->with('materi')
            ->get();
    }

    public function markRecommendationAsCompleted(MateriRekomendasi $recommendation)
    {
        $recommendation->update(['status' => 'selesai']);
    }
}