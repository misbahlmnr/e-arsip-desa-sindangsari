<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiswaProfile;
use App\Models\User;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'siswa')->with('siswaProfile.kelas');

        // Search by name
        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by kelas
        if ($request->has('kelas_id') && !empty($request->kelas_id)) {
            $query->whereHas('siswaProfile', function ($q) use ($request) {
                $q->where('kelas_id', $request->kelas_id);
            });
        }

        $siswas = $query->paginate(10)->appends($request->query());
        $kelas = Kelas::all();

        return Inertia::render('Admin/ManajemenUser/Siswas/Index', [
            'siswas' => $siswas,
            'kelas' => $kelas,
            'filters' => $request->only(['search', 'kelas_id'])
        ]);
    }

    public function create()
    {
        $kelas = Kelas::all();
        return Inertia::render('Admin/ManajemenUser/Siswas/Create', ['kelas' => $kelas]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'nis' => 'required|string|max:50|unique:siswa_profiles',
            'nisn' => 'required|string|max:50|unique:siswa_profiles',
            'jenis_kelamin' => 'nullable|string',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'no_hp' => 'nullable|string|max:20',
            'angkatan' => 'nullable|string|max:10',
            'status' => 'nullable|string',
            'nama_ortu' => 'nullable|string|max:255',
            'kontak_ortu' => 'nullable|string|max:20',
            'kelas_id' => 'nullable|exists:kelas,id',
        ]);

        $siswa = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'siswa',
        ]);

        SiswaProfile::updateOrCreate(
            ['user_id' => $siswa->id],
            [
                'nis' => $validated['nis'],
                'nisn' => $validated['nisn'],
                'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
                'tempat_lahir' => $validated['tempat_lahir'] ?? null,
                'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
                'no_hp' => $validated['no_hp'] ?? null,
                'angkatan' => $validated['angkatan'] ?? null,
                'status' => $validated['status'] ?? 'aktif',
                'nama_ortu' => $validated['nama_ortu'] ?? null,
                'kontak_ortu' => $validated['kontak_ortu'] ?? null,
                'kelas_id' => $validated['kelas_id'] ?? null,
            ]
        );

        return redirect()->route('admin.manajemen-user.siswas.index')->with('success', 'Siswa created successfully');
    }

    public function show(User $siswa)
    {
        return Inertia::render('Admin/ManajemenUser/Siswas/Show', [
            'siswa' => $siswa->load('siswaProfile.kelas'),
        ]);
    }

    public function edit(User $siswa)
    {
        // Ensure siswaProfile exists
        if (!$siswa->siswaProfile) {
            $siswa->siswaProfile()->create();
        }

        $kelas = Kelas::all();
        return Inertia::render('Admin/ManajemenUser/Siswas/Edit', [
            'siswa' => $siswa->load('siswaProfile.kelas'),
            'kelas' => $kelas
        ]);
    }

    public function update(Request $request, User $siswa)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $siswa->id,
            'password' => 'nullable|string|min:8|confirmed',
            'nis' => 'required|string|max:50|unique:siswa_profiles,nis,' . $siswa->siswaProfile->id,
            'nisn' => 'required|string|max:50|unique:siswa_profiles,nisn,' . $siswa->siswaProfile->id,
            'jenis_kelamin' => 'nullable|string',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'no_hp' => 'nullable|string|max:20',
            'angkatan' => 'nullable|string|max:10',
            'status' => 'nullable|string',
            'nama_ortu' => 'nullable|string|max:255',
            'kontak_ortu' => 'nullable|string|max:20',
            'kelas_id' => 'nullable|exists:kelas,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $siswa->update($updateData);

        SiswaProfile::updateOrCreate(
            ['user_id' => $siswa->id],
            [
                'nis' => $validated['nis'],
                'nisn' => $validated['nisn'],
                'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
                'tempat_lahir' => $validated['tempat_lahir'] ?? null,
                'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
                'no_hp' => $validated['no_hp'] ?? null,
                'angkatan' => $validated['angkatan'] ?? null,
                'status' => $validated['status'] ?? 'aktif',
                'nama_ortu' => $validated['nama_ortu'] ?? null,
                'kontak_ortu' => $validated['kontak_ortu'] ?? null,
                'kelas_id' => $validated['kelas_id'] ?? null,
            ]
        );

        return redirect()->route('admin.manajemen-user.siswas.index')->with('success', 'Siswa updated successfully');
    }

    public function destroy(User $siswa)
    {
        $siswa->siswaProfile()->delete();
        $siswa->delete();
        return redirect()->route('admin.manajemen-user.siswas.index')->with('success', 'Siswa deleted successfully');
    }
}
