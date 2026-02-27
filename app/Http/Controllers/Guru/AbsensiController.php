<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Jadwal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AbsensiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Absensi::whereHas('jadwal', function ($q) {
            $q->where('guru_id', auth()->id());
        })
        ->with(['jadwal.mapel', 'jadwal.kelas', 'siswa']);

        // Apply filters
        if ($request->filled('jadwal_id')) {
            $query->where('jadwal_id', $request->jadwal_id);
        }

        if ($request->filled('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('tanggal')) {
            $query->where('tanggal', $request->tanggal);
        }

        $absensi = $query->paginate(10);

        // Get available jadwal for the guru
        $jadwal = Jadwal::where('guru_id', auth()->id())
            ->with('mapel', 'kelas')
            ->get();

        // Get available siswa (students)
        $siswa = User::where('role', 'siswa')->get();

        return Inertia::render('Guru/Absensi/Index', [
            'absensi' => $absensi,
            'jadwal' => $jadwal,
            'siswa' => $siswa,
            'filters' => $request->only(['jadwal_id', 'siswa_id', 'status', 'tanggal'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $jadwal = Jadwal::where('guru_id', auth()->id())
            ->with('mapel', 'kelas')
            ->get();

        $siswa = User::where('role', 'siswa')->get();

        return Inertia::render('Guru/Absensi/Create', [
            'jadwal' => $jadwal,
            'siswa' => $siswa
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jadwal_id' => 'required|exists:jadwal,id',
            'siswa_id' => 'required|exists:users,id',
            'status' => 'required|in:hadir,izin,sakit,alpa',
            'tanggal' => 'required|date',
        ]);

        // Check if absensi already exists for this jadwal, siswa, and tanggal
        $existing = Absensi::where('jadwal_id', $validated['jadwal_id'])
            ->where('siswa_id', $validated['siswa_id'])
            ->where('tanggal', $validated['tanggal'])
            ->first();

        if ($existing) {
            return back()->withErrors(['error' => 'Absensi untuk jadwal, siswa, dan tanggal ini sudah ada.']);
        }

        // Ensure the jadwal belongs to the current guru
        $jadwal = Jadwal::find($validated['jadwal_id']);
        if ($jadwal->guru_id !== auth()->id()) {
            abort(403);
        }

        Absensi::create($validated);

        return redirect()->route('guru.absensi.index')->with('success', 'Absensi berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Absensi $absensi)
    {
        // Ensure the absensi belongs to the current guru's jadwal
        if ($absensi->jadwal->guru_id !== auth()->id()) {
            abort(403);
        }

        $absensi->load(['jadwal.mapel', 'jadwal.kelas', 'siswa']);

        return Inertia::render('Guru/Absensi/Show', ['absensi' => $absensi]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Absensi $absensi)
    {
        // Ensure the absensi belongs to the current guru's jadwal
        if ($absensi->jadwal->guru_id !== auth()->id()) {
            abort(403);
        }

        $jadwal = Jadwal::where('guru_id', auth()->id())
            ->with('mapel', 'kelas')
            ->get();

        $siswa = User::where('role', 'siswa')->get();

        return Inertia::render('Guru/Absensi/Edit', [
            'absensi' => $absensi,
            'jadwal' => $jadwal,
            'siswa' => $siswa,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Absensi $absensi)
    {
        if ($absensi->jadwal->guru_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'jadwal_id' => 'required|exists:jadwal,id',
            'siswa_id' => 'required|exists:users,id',
            'status' => 'required|in:hadir,izin,sakit,alpa',
            'tanggal' => 'required|date',
        ]);

        // Check if another absensi exists for this jadwal, siswa, and tanggal (excluding current)
        $existing = Absensi::where('jadwal_id', $validated['jadwal_id'])
            ->where('siswa_id', $validated['siswa_id'])
            ->where('tanggal', $validated['tanggal'])
            ->where('id', '!=', $absensi->id)
            ->first();

        if ($existing) {
            return back()->withErrors(['error' => 'Absensi untuk jadwal, siswa, dan tanggal ini sudah ada.']);
        }

        // Ensure the new jadwal belongs to the current guru
        $jadwal = Jadwal::find($validated['jadwal_id']);
        if ($jadwal->guru_id !== auth()->id()) {
            abort(403);
        }

        $absensi->update($validated);

        return redirect()
            ->route('guru.absensi.index')
            ->with('success', 'Absensi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Absensi $absensi)
    {
        // Ensure the absensi belongs to the current guru's jadwal
        if ($absensi->jadwal->guru_id !== auth()->id()) {
            abort(403);
        }

        $absensi->delete();

        return redirect()->route('guru.absensi.index')->with('success', 'Absensi berhasil dihapus');
    }
}
