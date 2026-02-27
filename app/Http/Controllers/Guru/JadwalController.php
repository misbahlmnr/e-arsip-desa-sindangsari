<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jadwals = Jadwal::where('guru_id', auth()->id())
            ->with('kelas', 'mapel', 'guru')
            ->paginate(10);

        return Inertia::render('Guru/JadwalMengajar/Index', ['jadwals' => $jadwals]);
    }
}
