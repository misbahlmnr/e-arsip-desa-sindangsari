<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get current day in Indonesian
        $hariIni = $this->getHariIni();

        // Get jadwal for current user (siswa) based on their kelas and current day
        $siswaProfile = auth()->user()->siswaProfile;
        if (!$siswaProfile || !$siswaProfile->kelas_id) {
            // If siswa profile or kelas_id is missing, return empty jadwal
            $jadwalHariIni = collect();
        } else {
            $jadwalHariIni = Jadwal::where('kelas_id', $siswaProfile->kelas_id)
                ->where('hari', $hariIni)
                ->with(['mapel', 'guru'])
                ->orderBy('jam_mulai')
                ->get();
        }

        return Inertia::render('Siswa/Jadwal/Index', [
            'jadwalHariIni' => $jadwalHariIni,
            'hariIni' => $hariIni
        ]);
    }

    /**
     * Get current day in Indonesian format
     */
    private function getHariIni()
    {
        $hari = [
            'Sunday' => 'Minggu',
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu'
        ];

        return $hari[date('l')];
    }
}
