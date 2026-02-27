<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Nilai;
use App\Models\Tugas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class NilaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Nilai::whereHas('tugas', function ($q) {
            $q->where('guru_id', auth()->id());
        })
        ->with(['tugas.mapel', 'tugas.kelas', 'siswa']);

        // Apply filters
        if ($request->filled('tugas_id')) {
            $query->where('tugas_id', $request->tugas_id);
        }

        if ($request->filled('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }

        if ($request->filled('search')) {
            $query->whereHas('siswa', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        $nilai = $query->paginate(10);

        // Get available tugas for the guru
        $tugas = Tugas::where('guru_id', auth()->id())
            ->with('mapel', 'kelas')
            ->get();

        // Get available siswa (students)
        $siswa = User::where('role', 'siswa')->get();

        return Inertia::render('Guru/Nilai/Index', [
            'nilai' => $nilai,
            'tugas' => $tugas,
            'siswa' => $siswa,
            'filters' => $request->only(['tugas_id', 'siswa_id', 'search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tugas = Tugas::where('guru_id', auth()->id())
            ->with('mapel', 'kelas')
            ->get();

        $siswa = User::where('role', 'siswa')->get();

        return Inertia::render('Guru/Nilai/Create', [
            'tugas' => $tugas,
            'siswa' => $siswa
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tugas_id' => 'required|exists:tugas,id',
            'siswa_id' => 'required|exists:users,id',
            'skor' => 'required|numeric|min:0|max:100',
        ]);

        // Check if nilai already exists for this tugas and siswa
        $existing = Nilai::where('tugas_id', $validated['tugas_id'])
            ->where('siswa_id', $validated['siswa_id'])
            ->first();

        if ($existing) {
            return back()->withErrors(['error' => 'Nilai untuk tugas dan siswa ini sudah ada.']);
        }

        // Ensure the tugas belongs to the current guru
        $tugas = Tugas::find($validated['tugas_id']);
        if ($tugas->guru_id !== auth()->id()) {
            abort(403);
        }

        Nilai::create($validated);

        return redirect()->route('guru.nilai.index')->with('success', 'Nilai berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Nilai $nilai)
    {
        // Ensure the nilai belongs to the current guru's tugas
        if ($nilai->tugas->guru_id !== auth()->id()) {
            abort(403);
        }

        $nilai->load(['tugas.mapel', 'tugas.kelas', 'siswa']);

        return Inertia::render('Guru/Nilai/Show', ['nilai' => $nilai]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Nilai $nilai)
    {
        // Ensure the nilai belongs to the current guru's tugas
        if ($nilai->tugas->guru_id !== auth()->id()) {
            abort(403);
        }

        $tugas = Tugas::where('guru_id', auth()->id())
            ->with('mapel', 'kelas')
            ->get();

        $siswa = User::where('role', 'siswa')->get();

        return Inertia::render('Guru/Nilai/Edit', [
            'nilai' => $nilai,
            'tugas' => $tugas,
            'siswa' => $siswa,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Nilai $nilai)
    {
        if ($nilai->tugas->guru_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'tugas_id' => 'required|exists:tugas,id',
            'siswa_id' => 'required|exists:users,id',
            'skor' => 'required|numeric|min:0|max:100',
        ]);

        // Check if another nilai exists for this tugas and siswa (excluding current)
        $existing = Nilai::where('tugas_id', $validated['tugas_id'])
            ->where('siswa_id', $validated['siswa_id'])
            ->where('id', '!=', $nilai->id)
            ->first();

        if ($existing) {
            return back()->withErrors(['error' => 'Nilai untuk tugas dan siswa ini sudah ada.']);
        }

        // Ensure the new tugas belongs to the current guru
        $tugas = Tugas::find($validated['tugas_id']);
        if ($tugas->guru_id !== auth()->id()) {
            abort(403);
        }

        $nilai->update($validated);

        return redirect()
            ->route('guru.nilai.index')
            ->with('success', 'Nilai berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Nilai $nilai)
    {
        // Ensure the nilai belongs to the current guru's tugas
        if ($nilai->tugas->guru_id !== auth()->id()) {
            abort(403);
        }

        $nilai->delete();

        return redirect()->route('guru.nilai.index')->with('success', 'Nilai berhasil dihapus');
    }
}
