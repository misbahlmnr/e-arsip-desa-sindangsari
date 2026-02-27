<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\MateriRekomendasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MateriRekomendasiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = MateriRekomendasi::where('siswa_id', auth()->id())
            ->with(['materi.mapel', 'materi.guru']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('mapel_id')) {
            $query->whereHas('materi', function($q) use ($request) {
                $q->where('mapel_id', $request->mapel_id);
            });
        }

        if ($request->filled('judul')) {
            $query->whereHas('materi', function($q) use ($request) {
                $q->where('judul', 'like', '%' . $request->judul . '%');
            });
        }

        $materiRekomendasi = $query->paginate(10);

        // Get available mapels for filtering
        $mapels = \App\Models\Mapel::whereHas('materi', function($query) {
            $query->whereHas('rekomendasi', function($q) {
                $q->where('siswa_id', auth()->id());
            });
        })->get();

        return Inertia::render('Siswa/MateriRekomendasi/Index', [
            'materiRekomendasi' => $materiRekomendasi,
            'mapels' => $mapels,
            'filters' => $request->only(['status', 'mapel_id', 'judul'])
        ]);
    }

    /**
     * Mark rekomendasi as completed.
     */
    public function markCompleted(MateriRekomendasi $materiRekomendasi)
    {
        // Ensure the rekomendasi belongs to the current siswa
        if ($materiRekomendasi->siswa_id !== auth()->id()) {
            abort(403);
        }

        $materiRekomendasi->update(['status' => 'selesai']);

        return redirect()->back()->with('success', 'Materi rekomendasi berhasil ditandai selesai.');
    }
}
