<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use App\Models\Mapel;
use App\Models\Kelas;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MateriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Materi::where('guru_id', auth()->id())
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

        $materis = $query->paginate(10);

        // Get available mapels for the guru and all kelas
        $mapels = auth()->user()->mapels;
        $kelas = Kelas::all();

        return Inertia::render('Guru/Materi/Index', [
            'materis' => $materis,
            'mapels' => $mapels,
            'kelas' => $kelas,
            'filters' => $request->only(['search', 'mapel_id', 'kelas_id'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $mapels = auth()->user()->mapels;
        $kelas = Kelas::all();

        return Inertia::render('Guru/Materi/Create', [
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
            'deskripsi' => 'nullable|string',
            'tingkat_kesulitan' => 'required|in:mudah,sedang,sulit',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('materi', 'public');
        }

        Materi::create([
            'mapel_id' => $validated['mapel_id'],
            'guru_id' => auth()->id(),
            'kelas_id' => $validated['kelas_id'],
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'],
            'tingkat_kesulitan' => $validated['tingkat_kesulitan'],
            'file_path' => $filePath,
        ]);

        return redirect()->route('guru.materi.index')->with('success', 'Materi berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Materi $materi)
    {
        // Ensure the materi belongs to the current guru
        if ($materi->guru_id !== auth()->id()) {
            abort(403);
        }

        $materi->load('mapel', 'kelas', 'guru');

        return Inertia::render('Guru/Materi/Show', ['materi' => $materi]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Materi $materi)
    {
        // Ensure the materi belongs to the current guru
        if ($materi->guru_id !== auth()->id()) {
            abort(403);
        }

        $mapels = auth()->user()->mapels;
        $kelas = Kelas::all();

        return Inertia::render('Guru/Materi/Edit', [
            'materi' => $materi,
            'mapels' => $mapels,
            'kelas' => $kelas,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Materi $materi): RedirectResponse
    {
        if ($materi->guru_id !== auth()->id()) {
            abort(403);
        }

        $validatedData = $request->validate([
            'mapel_id' => 'required|exists:mapel,id',
            'kelas_id' => 'required|exists:kelas,id',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tingkat_kesulitan' => 'required|in:mudah,sedang,sulit',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
        ]);

        if ($request->hasFile('file')) {
            if ($materi->file_path) {
                Storage::disk('public')->delete($materi->file_path);
            }

            $validatedData['file_path'] = $request->file('file')->store('materi', 'public');
        }

        $materi->update($validatedData);

        return redirect()->route('guru.materi.index')->with('success', 'Materi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Materi $materi)
    {
        // Ensure the materi belongs to the current guru
        if ($materi->guru_id !== auth()->id()) {
            abort(403);
        }

        // Delete file if exists
        if ($materi->file_path) {
            Storage::disk('public')->delete($materi->file_path);
        }

        $materi->delete();

        return redirect()->route('guru.materi.index')->with('success', 'Materi berhasil dihapus');
    }
}
