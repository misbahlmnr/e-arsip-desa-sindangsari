<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Tugas;
use App\Models\Nilai;
use App\Models\Jawaban;
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
        $siswaProfile = auth()->user()->siswaProfile;
        $kelasId = $siswaProfile ? $siswaProfile->kelas_id : null;

        if (!$kelasId) {
            return Inertia::render('Siswa/Tugas/Index', [
                'tugas' => (object) ['data' => []],
                'mapels' => [],
                'filters' => $request->only(['mapel_id', 'tipe', 'status', 'judul'])
            ]);
        }

        $query = Tugas::where('kelas_id', $kelasId)
            ->with(['mapel', 'guru', 'jawaban' => function($q) {
                $q->where('siswa_id', auth()->id());
            }]);

        // Apply filters
        if ($request->filled('mapel_id')) {
            $query->where('mapel_id', $request->mapel_id);
        }

        if ($request->filled('tipe')) {
            $query->where('tipe', $request->tipe);
        }

        if ($request->filled('status')) {
            if ($request->status === 'belum_dikerjakan') {
                $query->whereDoesntHave('jawaban', function($q) {
                    $q->where('siswa_id', auth()->id());
                });
            } elseif ($request->status === 'sudah_dikerjakan') {
                $query->whereHas('jawaban', function($q) {
                    $q->where('siswa_id', auth()->id());
                });
            }
        }

        if ($request->filled('judul')) {
            $query->where('judul', 'like', '%' . $request->judul . '%');
        }

        $tugas = $query->orderBy('deadline', 'asc')->paginate(10);

        // Get available mapels for filtering
        $mapels = \App\Models\Mapel::whereHas('tugas', function($query) use ($kelasId) {
            $query->where('kelas_id', $kelasId);
        })->get();

        return Inertia::render('Siswa/Tugas/Index', [
            'tugas' => $tugas,
            'mapels' => $mapels,
            'filters' => $request->only(['mapel_id', 'tipe', 'status', 'judul'])
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tugas $tugas)
    {
        $siswaProfile = auth()->user()->siswaProfile;
        $kelasId = $siswaProfile ? $siswaProfile->kelas_id : null;

        if (!$kelasId || $tugas->kelas_id !== $kelasId) {
            abort(403);
        }

        $tugas->load(['mapel', 'guru']);

        // Get jawaban dan nilai siswa untuk tugas ini
        $jawaban = Jawaban::where('tugas_id', $tugas->id)
            ->where('siswa_id', auth()->id())
            ->first();

        $nilai = $jawaban ? $jawaban->nilai : null;

        return Inertia::render('Siswa/Tugas/Show', [
            'tugas' => $tugas,
            'jawaban' => $jawaban,
            'nilai' => $nilai
        ]);
    }

    /**
     * Submit tugas.
     */
    public function submit(Request $request, Tugas $tugas)
    {
        $siswaProfile = auth()->user()->siswaProfile;
        $kelasId = $siswaProfile ? $siswaProfile->kelas_id : null;

        if (!$kelasId || $tugas->kelas_id !== $kelasId) {
            abort(403);
        }

        // Validasi file dan link
        $request->validate([
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,jpg,jpeg,png|max:10240',
            'link' => 'nullable|url',
        ]);

        // Pastikan minimal ada file atau link
        if (!$request->hasFile('file') && !$request->filled('link')) {
            return back()->withErrors([
                'file' => 'Harus mengunggah file atau menyediakan link untuk mengumpulkan tugas.'
            ])->withInput();
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('tugas_siswa', 'public');
        }

        // Cek apakah jawaban sudah ada
        $jawaban = Jawaban::where('tugas_id', $tugas->id)
            ->where('siswa_id', auth()->id())
            ->first();

        if ($jawaban) {
            // Update submission existing
            if ($jawaban->file_path && $filePath) {
                Storage::disk('public')->delete($jawaban->file_path);
            }

            $jawaban->update([
                'file_path' => $filePath ?: $jawaban->file_path,
                'link' => $request->filled('link') ? $request->link : $jawaban->link,
            ]);
        } else {
            // Buat submission baru
            $jawaban = Jawaban::create([
                'tugas_id' => $tugas->id,
                'siswa_id' => auth()->id(),
                'file_path' => $filePath,
                'link' => $request->link,
            ]);

            // Buat nilai terkait dengan skor 0
            Nilai::create([
                'tugas_id' => $tugas->id,
                'siswa_id' => auth()->id(),
                'skor' => 0, // akan dinilai guru
                'jawaban_id' => $jawaban->id,
            ]);
        }

        return back()->with('success', 'Tugas berhasil dikumpulkan.');
    }
}
