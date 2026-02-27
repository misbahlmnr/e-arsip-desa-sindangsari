<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class LaporanAbsensiController extends Controller
{
    public function index(Request $request)
    {
        $kelasId = $request->get('kelas_id');
        $bulan = $request->get('bulan'); // format Y-m

        $query = Absensi::with(['siswa.siswaProfile.kelas', 'jadwal']);

        if ($kelasId) {
            $query->whereHas('siswa.siswaProfile', function ($q) use ($kelasId) {
                $q->where('kelas_id', $kelasId);
            });
        }

        if ($bulan) {
            $query->whereYear('tanggal', substr($bulan, 0, 4))
                  ->whereMonth('tanggal', substr($bulan, 5, 2));
        }

        $absensi = $query->get();

        // Group by siswa
        $laporan = $absensi->groupBy('siswa_id')->map(function ($bySiswa) {
            $siswa = $bySiswa->first()->siswa;
            $total = $bySiswa->count();
            $hadir = $bySiswa->where('status', 'hadir')->count();
            $izin = $bySiswa->where('status', 'izin')->count();
            $sakit = $bySiswa->where('status', 'sakit')->count();
            $alpa = $bySiswa->where('status', 'alpa')->count();
            return [
                'siswa' => $siswa,
                'total' => $total,
                'hadir' => $hadir,
                'izin' => $izin,
                'sakit' => $sakit,
                'alpa' => $alpa,
            ];
        })->values();

        $kelas = Kelas::all();

        return Inertia::render('Admin/Laporan/Absensi/Index', [
            'laporan' => $laporan,
            'kelas' => $kelas,
            'filters' => $request->only(['kelas_id', 'bulan'])
        ]);
    }

    public function export(Request $request)
    {
        $kelasId = $request->get('kelas_id');
        $bulan = $request->get('bulan');

        $query = Absensi::with(['siswa.siswaProfile.kelas', 'jadwal']);

        if ($kelasId) {
            $query->whereHas('siswa.siswaProfile', function ($q) use ($kelasId) {
                $q->where('kelas_id', $kelasId);
            });
        }

        if ($bulan) {
            $query->whereYear('tanggal', substr($bulan, 0, 4))
                  ->whereMonth('tanggal', substr($bulan, 5, 2));
        }

        $absensi = $query->get();

        $laporan = $absensi->groupBy('siswa_id')->map(function ($bySiswa) {
            $siswa = $bySiswa->first()->siswa;
            $total = $bySiswa->count();
            $hadir = $bySiswa->where('status', 'hadir')->count();
            $izin = $bySiswa->where('status', 'izin')->count();
            $sakit = $bySiswa->where('status', 'sakit')->count();
            $alpa = $bySiswa->where('status', 'alpa')->count();
            return [
                'siswa' => $siswa,
                'total' => $total,
                'hadir' => $hadir,
                'izin' => $izin,
                'sakit' => $sakit,
                'alpa' => $alpa,
            ];
        })->values();

        $pdf = PDF::loadView('pdf.laporan_absensi', compact('laporan'));
        return $pdf->download('laporan_absensi.pdf');
    }
}
