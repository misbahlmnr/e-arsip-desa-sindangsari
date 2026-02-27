<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Nilai;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class LaporanNilaiController extends Controller
{
    public function index(Request $request)
    {
        $kelasId = $request->get('kelas_id');
        $mapelId = $request->get('mapel_id');

        // Query nilai with relations
        $query = Nilai::with(['siswa.siswaProfile.kelas', 'tugas.mapel']);

        if ($kelasId) {
            $query->whereHas('siswa.siswaProfile', function ($q) use ($kelasId) {
                $q->where('kelas_id', $kelasId);
            });
        }

        if ($mapelId) {
            $query->whereHas('tugas', function ($q) use ($mapelId) {
                $q->where('mapel_id', $mapelId);
            });
        }

        $nilai = $query->get();

        // Group by siswa and mapel for average
        $grouped = $nilai->groupBy(function ($item) {
            return $item->siswa_id . '-' . $item->tugas->mapel_id;
        });

        $laporan = $grouped->map(function ($group) {
            $first = $group->first();
            $average = $group->avg('skor');
            return [
                'siswa' => $first->siswa,
                'mapel' => $first->tugas->mapel,
                'average_skor' => round($average, 2),
            ];
        })->values();

        $kelas = Kelas::all();
        $mapels = Mapel::all();

        return Inertia::render('Admin/Laporan/Nilai/Index', [
            'laporan' => $laporan,
            'kelas' => $kelas,
            'mapels' => $mapels,
            'filters' => $request->only(['kelas_id', 'mapel_id'])
        ]);
    }

    public function export(Request $request)
    {
        $kelasId = $request->get('kelas_id');
        $mapelId = $request->get('mapel_id');

        // Same query as index
        $query = Nilai::with(['siswa.siswaProfile.kelas', 'tugas.mapel']);

        if ($kelasId) {
            $query->whereHas('siswa.siswaProfile', function ($q) use ($kelasId) {
                $q->where('kelas_id', $kelasId);
            });
        }

        if ($mapelId) {
            $query->whereHas('tugas', function ($q) use ($mapelId) {
                $q->where('mapel_id', $mapelId);
            });
        }

        $nilai = $query->get();

        $grouped = $nilai->groupBy(function ($item) {
            return $item->siswa_id . '-' . $item->tugas->mapel_id;
        });

        $laporan = $grouped->map(function ($group) {
            $first = $group->first();
            $average = $group->avg('skor');
            return [
                'siswa' => $first->siswa,
                'mapel' => $first->tugas->mapel,
                'average_skor' => round($average, 2),
            ];
        })->values();

        $pdf = PDF::loadView('pdf.laporan_nilai', compact('laporan'));
        return $pdf->download('laporan_nilai.pdf');
    }
}
