<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mapel;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mapels = Mapel::with('gurus')->paginate(10);
        return Inertia::render('Admin/Mapel/Index', ['mapels' => $mapels]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $gurus = User::where('role', 'guru')->get();
        return Inertia::render('Admin/Mapel/Create', ['gurus' => $gurus]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:mapel',
            'guru_ids' => 'nullable|array',
            'guru_ids.*' => 'exists:users,id',
        ]);

        $mapel = Mapel::create([
            'nama' => $validated['nama'],
        ]);

        if (!empty($validated['guru_ids'])) {
            $mapel->gurus()->attach($validated['guru_ids']);
        }

        return redirect()->route('admin.mapel.index')->with('message', 'Mata pelajaran berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mapel $mapel)
    {
        $gurus = User::where('role', 'guru')->get();
        $mapel->load('gurus');
        return Inertia::render('Admin/Mapel/Edit', [
            'mapel' => $mapel,
            'gurus' => $gurus
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Mapel $mapel)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:mapel,nama,' . $mapel->id,
            'guru_ids' => 'nullable|array',
            'guru_ids.*' => 'exists:users,id',
        ]);

        $mapel->update([
            'nama' => $validated['nama'],
        ]);

        $mapel->gurus()->sync($validated['guru_ids'] ?? []);

        return redirect()->route('admin.mapel.index')->with('message', 'Mata pelajaran berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mapel $mapel)
    {
        $mapel->delete();
        return redirect()->route('admin.mapel.index')->with('message', 'Mata pelajaran berhasil dihapus');
    }
}
