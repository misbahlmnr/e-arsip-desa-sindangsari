<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jadwals = Jadwal::with('kelas', 'mapel', 'guru')->paginate(10);
        return Inertia::render('Admin/Jadwal/Index', ['jadwals' => $jadwals]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kelas = Kelas::all();
        $mapels = Mapel::all();
        $gurus = User::where('role', 'guru')->get();
        return Inertia::render('Admin/Jadwal/Create', [
            'kelas' => $kelas,
            'mapels' => $mapels,
            'gurus' => $gurus
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mapel_id' => 'required|exists:mapel,id',
            'guru_id' => 'required|exists:users,id',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        ]);

        Jadwal::create($validated);

        return redirect()->route('admin.jadwal.index')->with('success', 'Jadwal berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Jadwal $jadwal)
    {
        $jadwal->load('kelas', 'mapel', 'guru');
        return Inertia::render('Admin/Jadwal/Show', ['jadwal' => $jadwal]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Jadwal $jadwal)
    {
        $jadwal->load('kelas', 'mapel', 'guru');

        // Normalisasi format jam menjadi H:i untuk dikirim ke FE
        $jadwal->jam_mulai = \Carbon\Carbon::parse($jadwal->jam_mulai)->format('H:i');
        $jadwal->jam_selesai = \Carbon\Carbon::parse($jadwal->jam_selesai)->format('H:i');

        $kelas = Kelas::all();
        $mapels = Mapel::all();
        $gurus = User::where('role', 'guru')->get();

        return Inertia::render('Admin/Jadwal/Edit', [
            'jadwal' => $jadwal,
            'kelas' => $kelas,
            'mapels' => $mapels,
            'gurus' => $gurus,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Jadwal $jadwal)
    {
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mapel_id' => 'required|exists:mapel,id',
            'guru_id' => 'required|exists:users,id',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        ]);

        $jadwal->update($validated);

        return redirect()->route('admin.jadwal.index')->with('success', 'Jadwal berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jadwal $jadwal)
    {
        $jadwal->delete();
        return redirect()->route('admin.jadwal.index')->with('success', 'Jadwal berhasil dihapus');
    }
}
