<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesSuratManagement;
use App\Http\Controllers\Controller;
use App\Http\Requests\SuratKeluar\StoreRequest;
use App\Http\Requests\SuratKeluar\UpdateRequest;
use App\Models\SuratKeluar;
use App\Services\SuratKeluarService;
use Illuminate\Http\Request;

class SuratKeluarController extends Controller
{
    use AuthorizesSuratManagement;
    public function __construct(protected SuratKeluarService $services)
    {
        $this->services = $services;
    }

    public function index(Request $request)
    {
        $data = $this->services->index($request);

        return inertia('surat-keluar/Index', [
            'letters' => $data['letters'],
            'filters' => $data['filters'],
        ]);
    }

    public function create()
    {
        $this->authorizeSuratManagement();

        return inertia('surat-keluar/Create');
    }

    public function show(SuratKeluar $surat_keluar)
    {
        return inertia('surat-keluar/Show', [
            'letter' => $surat_keluar,
        ]);
    }

    public function edit(SuratKeluar $surat_keluar)
    {
        $this->authorizeSuratManagement();

        return inertia('surat-keluar/Edit', [
            'letter' => $surat_keluar,
        ]);
    }

    public function store(StoreRequest $req)
    {
        $this->authorizeSuratManagement();

        $this->services->store($req);

        return redirect()->route('admin.surat-keluar.index')->with('success', 'Surat Keluar berhasil ditambahkan.');
    }

    public function update(UpdateRequest $req, SuratKeluar $surat_keluar)
    {
        $this->authorizeSuratManagement();

        $this->services->update($req, $surat_keluar);

        return redirect()->route('admin.surat-keluar.index')->with('success', 'Surat Keluar berhasil diperbarui.');
    }

    public function destroy(SuratKeluar $surat_keluar)
    {
        $this->authorizeSuratManagement();

        $this->services->destroy($surat_keluar);

        return redirect()->route('admin.surat-keluar.index')->with('success', 'Surat Keluar berhasil dihapus.');
    }

    public function archive(SuratKeluar $surat_keluar)
    {
        $this->authorizeSuratManagement();

        if ($surat_keluar->diarsipkan_at) {
            return back()->with('info', 'Surat ini sudah berada di arsip.');
        }

        $this->services->archive($surat_keluar);

        return back()->with('success', 'Surat keluar berhasil diarsipkan.');
    }

    public function unarchive(SuratKeluar $surat_keluar)
    {
        $this->authorizeSuratManagement();

        if (! $surat_keluar->diarsipkan_at) {
            return back()->with('info', 'Surat ini tidak dalam arsip.');
        }

        $this->services->unarchive($surat_keluar);

        return back()->with('success', 'Surat keluar dikembalikan ke daftar aktif.');
    }
}
