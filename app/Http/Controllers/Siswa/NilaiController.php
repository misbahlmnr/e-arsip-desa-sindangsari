<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Nilai;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NilaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $siswaId = auth()->id();

        $query = Nilai::where('siswa_id', $siswaId)
            ->with(['tugas.mapel', 'tugas.guru']);

        // Apply filters
        if ($request->filled('mapel_id')) {
            $query->whereHas('tugas', function($q) use ($request) {
                $q->where('mapel_id', $request->mapel_id);
            });
        }

        if ($request->filled('tipe')) {
            $query->whereHas('tugas', function($q) use ($request) {
                $q->where('tipe', $request->tipe);
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'dinilai') {
                $query->where('skor', '>', 0);
            } elseif ($request->status === 'belum_dinilai') {
                $query->where('skor', 0);
            }
        }

        if ($request->filled('judul')) {
            $query->whereHas('tugas', function($q) use ($request) {
                $q->where('judul', 'like', '%' . $request->judul . '%');
            });
        }

        $nilai = $query->orderBy('created_at', 'desc')->paginate(10);

        // Get available mapels for filtering
        $mapels = \App\Models\Mapel::whereHas('tugas.nilai', function($query) use ($siswaId) {
            $query->where('siswa_id', $siswaId);
        })->get();

        return Inertia::render('Siswa/Nilai/Index', [
            'nilai' => $nilai,
            'mapels' => $mapels,
            'filters' => $request->only(['mapel_id', 'tipe', 'status', 'judul'])
        ]);
    }
}
