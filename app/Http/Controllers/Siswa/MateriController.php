<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MateriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $siswaProfile = auth()->user()->siswaProfile;
        if (!$siswaProfile) {
            abort(404, 'Profile siswa tidak ditemukan');
        }

        $kelasId = $siswaProfile->kelas_id;

        $query = Materi::where('kelas_id', $kelasId)
            ->with(['mapel', 'guru']);

        // Apply filters
        if ($request->filled('mapel_id')) {
            $query->where('mapel_id', $request->mapel_id);
        }

        if ($request->filled('judul')) {
            $query->where('judul', 'like', '%' . $request->judul . '%');
        }

        $materis = $query->paginate(10);

        // Get available mapels for the siswa's kelas (through materi)
        $mapels = \App\Models\Mapel::whereHas('materi', function($query) use ($kelasId) {
            $query->where('kelas_id', $kelasId);
        })->get();

        return Inertia::render('Siswa/Materi/Index', [
            'materis' => $materis,
            'mapels' => $mapels,
            'filters' => $request->only(['mapel_id', 'judul'])
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Materi $materi)
    {
        $siswaProfile = auth()->user()->siswaProfile;
        if (!$siswaProfile) {
            abort(404, 'Profile siswa tidak ditemukan');
        }

        // Ensure the materi belongs to the current siswa's kelas
        if ($materi->kelas_id !== $siswaProfile->kelas_id) {
            abort(403);
        }

        $materi->load(['mapel', 'guru']);

        return Inertia::render('Siswa/Materi/Show', ['materi' => $materi]);
    }
}
