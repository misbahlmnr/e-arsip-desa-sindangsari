<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuratMasukController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/SuratMasuk/Index', [
            'suratMasuk' => [],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nomor_registrasi' => 'required|string|max:255',
            'no_surat' => 'required|string|max:255',
            'tanggal_terima' => 'required|date',
            'pengirim' => 'required|string|max:255',
            'perihal' => 'required|string|max:255',
            'status' => 'required|in:belum_diproses,sedang_diproses,selesai',
            'tujuan' => 'nullable|string|max:255',
        ]);

        // TODO: Simpan data ke database, contoh:
        // SuratMasuk::create($request->all());

        return redirect()->back()->with('success', 'Surat Masuk berhasil ditambahkan.');
    }
}
