<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdaptiveRule;
use App\Models\Nilai;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class LaporanAdaptiveController extends Controller
{
    public function index(Request $request)
    {
        // Get all adaptive rules
        $rules = AdaptiveRule::with('mapel')->get();

        $laporan = [];

        foreach ($rules as $rule) {
            // Find nilai for this mapel where skor < min_score
            $nilaiBelow = Nilai::with(['siswa.siswaProfile.kelas', 'tugas'])
                ->whereHas('tugas', function ($q) use ($rule) {
                    $q->where('mapel_id', $rule->mapel_id);
                })
                ->where('skor', '<', $rule->min_score)
                ->get();

            foreach ($nilaiBelow as $nilai) {
                $laporan[] = [
                    'siswa' => $nilai->siswa,
                    'kelas' => $nilai->siswa->siswaProfile?->kelas,
                    'mapel' => $rule->mapel,
                    'skor_aktual' => $nilai->skor ?? '-',
                    'min_score' => $rule->min_score,
                    'kategori_rekomendasi' => $rule->kategori_rekomendasi,
                ];
            }
        }

        // Remove duplicates if any (same siswa mapel)
        $laporan = collect($laporan)->unique(function ($item) {
            return $item['siswa']->id . '-' . $item['mapel']->id;
        })->values();

        return Inertia::render('Admin/Laporan/AdaptiveRules/Index', [
            'laporan' => $laporan
        ]);
    }

    public function export(Request $request)
    {
        $rules = AdaptiveRule::with('mapel')->get();

        $laporan = [];

        foreach ($rules as $rule) {
            $nilaiBelow = Nilai::with(['siswa.siswaProfile.kelas', 'tugas'])
                ->whereHas('tugas', function ($q) use ($rule) {
                    $q->where('mapel_id', $rule->mapel_id);
                })
                ->where('skor', '<', $rule->min_score)
                ->get();

            foreach ($nilaiBelow as $nilai) {
                $laporan[] = [
                    'siswa' => $nilai->siswa,
                    'kelas' => $nilai->siswa->siswaProfile?->kelas,
                    'mapel' => $rule->mapel,
                    'skor_aktual' => $nilai->skor ?? '-',
                    'min_score' => $rule->min_score,
                    'kategori_rekomendasi' => $rule->kategori_rekomendasi,
                ];
            }
        }

        $laporan = collect($laporan)->unique(function ($item) {
            return $item['siswa']->id . '-' . $item['mapel']->id;
        })->values();

        $pdf = PDF::loadView('pdf.laporan_adaptive', compact('laporan'));
        return $pdf->download('laporan_adaptive.pdf');
    }
}
