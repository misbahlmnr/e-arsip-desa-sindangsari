<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SuratKeluarService;
use App\Http\Requests\SuratKeluar\StoreRequest;
use App\Http\Requests\SuratKeluar\UpdateRequest;
use App\Models\SuratKeluar;

class SuratKeluarController extends Controller
{
    public function __construct(protected SuratKeluarService $services) {
        $this->services = $services;
    }

    public function index(Request $req) 
    {
        $data = $this->services->index($req);

        return inertia('Admin/SuratKeluar/Index', [
            'letters' => $data['letters'],
            'filters' => $data['filters'],
        ]);
    }

    public function store(StoreRequest $req)
    {
        $this->services->store($req);

        return redirect()->route('admin.surat-keluar.index')->with('success', 'Surat Keluar berhasil ditambahkan.');
    }

    public function update(UpdateRequest $req, SuratKeluar $surat_keluar)
    {
        $this->services->update($req, $surat_keluar);

        return redirect()->route('admin.surat-keluar.index')->with('success', 'Surat Keluar berhasil diperbarui.');
    }

    public function destroy(SuratKeluar $surat_keluar)
    {
        $this->services->destroy($surat_keluar);

        return redirect()->route('admin.surat-keluar.index')->with('success', 'Surat Keluar berhasil dihapus.');
    }
}
