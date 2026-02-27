<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::with('waliKelas')->paginate(10);
        return Inertia::render('Admin/Kelas/Index', ['kelas' => $kelas]);
    }

    public function create()
    {
        $gurus = User::where('role', 'guru')->get();
        return Inertia::render('Admin/Kelas/Create', ['gurus' => $gurus]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tingkat' => 'required|integer|min:1|max:12',
            'wali_kelas_id' => 'nullable',
        ]);

        // Convert 'none' to null
        if ($validated['wali_kelas_id'] === 'none') {
            $validated['wali_kelas_id'] = null;
        }

        // If not null, validate it exists
        if ($validated['wali_kelas_id'] !== null) {
            $request->validate([
                'wali_kelas_id' => 'exists:users,id',
            ]);
        }

        Kelas::create($validated);

        return redirect()->route('admin.kelas.index')->with('success', 'Kelas created successfully');
    }

    public function edit(Kelas $kela)
    {
        $gurus = User::where('role', 'guru')->get();
        return Inertia::render('Admin/Kelas/Edit', [
            'kela' => $kela,
            'gurus' => $gurus
        ]);
    }

    public function update(Request $request, Kelas $kela)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tingkat' => 'required|integer|min:1|max:12',
            'wali_kelas_id' => 'nullable',
        ]);

        // Convert 'none' to null
        if ($validated['wali_kelas_id'] === 'none') {
            $validated['wali_kelas_id'] = null;
        }

        // If not null, validate it exists
        if ($validated['wali_kelas_id'] !== null) {
            $request->validate([
                'wali_kelas_id' => 'exists:users,id',
            ]);
        }

        $kela->update($validated);

        return redirect()->route('admin.kelas.index')->with('success', 'Kelas updated successfully');
    }

    public function destroy(Kelas $kela)
    {
        $kela->delete();
        return redirect()->route('admin.kelas.index')->with('success', 'Kelas deleted successfully');
    }
}
