<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Tugas;
use App\Models\Mapel;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TugasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Tugas::where('guru_id', auth()->id())
            ->with('mapel', 'kelas');

        // Apply filters
        if ($request->filled('search')) {
            $query->where('judul', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('mapel_id')) {
            $query->where('mapel_id', $request->mapel_id);
        }

        if ($request->filled('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        if ($request->filled('tipe')) {
            $query->where('tipe', $request->tipe);
        }

        $tugas = $query->paginate(10);

        // Get available mapels for the guru and all kelas
        $mapels = auth()->user()->mapels;
        $kelas = Kelas::all();

        return Inertia::render('Guru/Tugas/Index', [
            'tugas' => $tugas,
            'mapels' => $mapels,
            'kelas' => $kelas,
            'filters' => $request->only(['search', 'mapel_id', 'kelas_id', 'tipe'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $mapels = auth()->user()->mapels;
        $kelas = Kelas::all();

        return Inertia::render('Guru/Tugas/Create', [
            'mapels' => $mapels,
            'kelas' => $kelas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mapel_id' => 'required|exists:mapel,id',
            'kelas_id' => 'required|exists:kelas,id',
            'judul' => 'required|string|max:255',
            'tipe' => 'required|in:kuis,ujian,tugas',
            'deadline' => 'required|date',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
            'link_soal' => 'nullable|url',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('tugas', 'public');
        }

        Tugas::create([
            'mapel_id' => $validated['mapel_id'],
            'guru_id' => auth()->id(),
            'kelas_id' => $validated['kelas_id'],
            'judul' => $validated['judul'],
            'tipe' => $validated['tipe'],
            'deadline' => $validated['deadline'],
            'file_path' => $filePath,
            'link_soal' => $validated['link_soal'] ?? null,
        ]);

        return redirect()->route('guru.tugas.index')->with('success', 'Tugas berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tugas $tuga)
    {
        // Ensure the tugas belongs to the current guru
        if ($tuga->guru_id !== auth()->id()) {
            abort(403);
        }

        $tuga->load('mapel', 'kelas', 'guru');

        // Get all nilai (submissions) for this tugas with siswa and jawaban data
        $nilai = \App\Models\Nilai::where('tugas_id', $tuga->id)
            ->with(['siswa', 'jawaban'])
            ->get();

        return Inertia::render('Guru/Tugas/Show', [
            'tugas' => $tuga,
            'nilai' => $nilai
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tugas $tuga)
    {
        // Ensure the tugas belongs to the current guru
        if ($tuga->guru_id !== auth()->id()) {
            abort(403);
        }

        $mapels = auth()->user()->mapels;
        $kelas = Kelas::all();

        return Inertia::render('Guru/Tugas/Edit', [
            'tugas' => $tuga,
            'mapels' => $mapels,
            'kelas' => $kelas,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tugas $tuga)
    {
        if ($tuga->guru_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'mapel_id' => 'required|exists:mapel,id',
            'kelas_id' => 'required|exists:kelas,id',
            'judul' => 'required|string|max:255',
            'tipe' => 'required|in:kuis,ujian,tugas',
            'deadline' => 'required|date',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
            'link_soal' => 'nullable|url',
        ]);

        if ($request->hasFile('file')) {
            if ($tuga->file_path) {
                Storage::disk('public')->delete($tuga->file_path);
            }
            $validated['file_path'] = $request->file('file')->store('tugas', 'public');
        }

        $tuga->update(array_merge($validated, [
            'file_path' => $validated['file_path'] ?? $tuga->file_path,
            'link_soal' => $validated['link_soal'] ?? $tuga->link_soal,
        ]));

        return redirect()
            ->route('guru.tugas.index')
            ->with('success', 'Tugas berhasil diperbarui.');
    }

    /**
     * Update nilai (grade) for a submission.
     */
    public function grade(Request $request, Tugas $tuga, $nilaiId)
    {
        // Ensure the tugas belongs to the current guru
        if ($tuga->guru_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'skor' => 'required|numeric|min:0.1|max:100',
        ]);

        $nilai = \App\Models\Nilai::findOrFail($nilaiId);
        if ($nilai->tugas_id !== $tuga->id) {
            abort(403);
        }

        $nilai->update(['skor' => $validated['skor']]);

        // Generate adaptive recommendations if score is below threshold
        $adaptiveService = app(\App\Services\AdaptiveLearningService::class);
        $adaptiveService->generateRecommendations($nilai->siswa);

        return back()->with('success', 'Nilai berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tugas $tuga)
    {
        // Ensure the tugas belongs to the current guru
        if ($tuga->guru_id !== auth()->id()) {
            abort(403);
        }

        // Delete file if exists
        if ($tuga->file_path) {
            Storage::disk('public')->delete($tuga->file_path);
        }

        $tuga->delete();

        return redirect()->route('guru.tugas.index')->with('success', 'Tugas berhasil dihapus');
    }
}
