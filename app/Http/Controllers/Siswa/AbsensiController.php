<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbsensiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $siswaId = auth()->id();

        $query = Absensi::where('siswa_id', $siswaId)
            ->with(['jadwal.mapel', 'jadwal.guru']);

        // Apply filters
        if ($request->filled('mapel_id')) {
            $query->whereHas('jadwal', function($q) use ($request) {
                $q->where('mapel_id', $request->mapel_id);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        $absensi = $query->orderBy('tanggal', 'desc')->paginate(10);

        // Get available mapels for filtering
        $mapels = \App\Models\Mapel::whereHas('jadwal.absensi', function($query) use ($siswaId) {
            $query->where('siswa_id', $siswaId);
        })->get();

        return Inertia::render('Siswa/Absensi/Index', [
            'absensi' => $absensi,
            'mapels' => $mapels,
            'filters' => $request->only(['mapel_id', 'status', 'tanggal'])
        ]);
    }
}
