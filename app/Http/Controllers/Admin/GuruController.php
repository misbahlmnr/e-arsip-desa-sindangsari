<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GuruProfile;
use App\Models\User;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function index()
    {
        $gurus = User::where('role', 'guru')->with('mapels')->paginate(10);
        return Inertia::render('Admin/ManajemenUser/Gurus/Index', ['gurus' => $gurus]);
    }

    public function create()
    {
        $mapels = Mapel::all();
        return Inertia::render('Admin/ManajemenUser/Gurus/Create', ['mapels' => $mapels]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'mapel_ids' => 'nullable|array',
            'mapel_ids.*' => 'exists:mapel,id',
            'nip' => 'nullable|string|max:50',
            'jenis_kelamin' => 'nullable|string',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'status_kepegawaian' => 'nullable|string|max:100',
        ]);

        $guru = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'guru',
        ]);

        GuruProfile::updateOrCreate(
            ['user_id' => $guru->id],
            [
                'nip' => $validated['nip'] ?? null,
                'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
                'tempat_lahir' => $validated['tempat_lahir'] ?? null,
                'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
                'alamat' => $validated['alamat'] ?? null,
                'no_hp' => $validated['no_hp'] ?? null,
                'status_kepegawaian' => $validated['status_kepegawaian'] ?? null,
            ]
        );

        // Assign mapels if selected
        if (!empty($validated['mapel_ids'])) {
            $guru->mapels()->attach($validated['mapel_ids']);
        }

        return redirect()
            ->route('admin.manajemen-user.gurus.index')
            ->with('success', 'Guru berhasil ditambahkan beserta profilnya.');
    }

    public function show(User $guru)
    {
        return Inertia::render('Admin/ManajemenUser/Gurus/Show', [
            'guru' => $guru->load('guruProfile', 'mapels'),
        ]);
    }

    public function edit(User $guru)
    {
        $mapels = Mapel::all();

        // Pastikan relasi dimuat: guruProfile & mapels
        $guru->load(['guruProfile', 'mapels']);

        return Inertia::render('Admin/ManajemenUser/Gurus/Edit', [
            'guru' => $guru,
            'mapels' => $mapels,
        ]);
    }

    public function update(Request $request, User $guru)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $guru->id,
            'password' => 'nullable|string|min:8|confirmed',
            'mapel_ids' => 'nullable|array',
            'mapel_ids.*' => 'exists:mapel,id',
            'nip' => 'nullable|string|max:50',
            'jenis_kelamin' => 'nullable|string',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'status_kepegawaian' => 'nullable|string|max:100',
        ]);

        // Update data akun utama
        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $guru->update($updateData);

        // Update atau buat profil guru
        GuruProfile::updateOrCreate(
            ['user_id' => $guru->id],
            [
                'nip' => $validated['nip'] ?? null,
                'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
                'tempat_lahir' => $validated['tempat_lahir'] ?? null,
                'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
                'alamat' => $validated['alamat'] ?? null,
                'no_hp' => $validated['no_hp'] ?? null,
                'status_kepegawaian' => $validated['status_kepegawaian'] ?? null,
            ]
        );

        // Sync mapels
        $guru->mapels()->sync($validated['mapel_ids'] ?? []);

        return redirect()
            ->route('admin.manajemen-user.gurus.index')
            ->with('success', 'Data guru berhasil diperbarui.');
    }

    public function destroy(User $guru)
    {
        // Detach all mapels (pivot will be deleted automatically due to cascade)
        $guru->mapels()->detach();

        // Delete GuruProfile if exists
        $guru->guruProfile()->delete();

        $guru->delete();
        return redirect()->route('admin.manajemen-user.gurus.index')->with('success', 'Guru deleted successfully');
    }
}
