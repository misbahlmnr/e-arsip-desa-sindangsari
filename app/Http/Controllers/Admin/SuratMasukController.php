<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuratMasuk\StoreRequest;
use App\Models\Letter;
use Inertia\Inertia;

class SuratMasukController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/SuratMasuk/Index', [
            'suratMasuk' => [],
        ]);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('surat-masuk', 'public');
            $data['file'] = $filePath;
        }
        
        Letter::create($data);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil ditambahkan.');
    }
}
