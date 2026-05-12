<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuratMasuk\StoreRequest;
use App\Http\Requests\SuratMasuk\UpdateRequest;
use App\Models\SuratMasuk;
use App\Services\SuratMasukService;
use Illuminate\Http\Request;

class SuratMasukController extends Controller
{
    public function __construct(protected SuratMasukService $services)
    {
        $this->services = $services;
    }

    public function index(Request $request)
    {
        $data = $this->services->index($request);

        return inertia('Admin/SuratMasuk/Index', [
            'letters' => $data['letters'],
            'filters' => $data['filters'],
        ]);
    }

    public function create()
    {
        return inertia('Admin/SuratMasuk/Create');
    }

    public function show(SuratMasuk $surat_masuk)
    {
        return inertia('Admin/SuratMasuk/Show', [
            'letter' => $surat_masuk,
        ]);
    }

    public function edit(SuratMasuk $surat_masuk)
    {
        return inertia('Admin/SuratMasuk/Edit', [
            'letter' => $surat_masuk,
        ]);
    }

    public function store(StoreRequest $request)
    {
        $this->services->store($request);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil ditambahkan.');
    }

    public function update(UpdateRequest $request, SuratMasuk $surat_masuk)
    {
        $this->services->update($request, $surat_masuk);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil diperbarui.');
    }

    public function destroy(SuratMasuk $surat_masuk)
    {
        $this->services->destroy($surat_masuk);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil dihapus.');
    }

    public function archive(SuratMasuk $surat_masuk)
    {
        if ($surat_masuk->diarsipkan_at) {
            return back()->with('info', 'Surat ini sudah berada di arsip.');
        }

        $this->services->archive($surat_masuk);

        return back()->with('success', 'Surat masuk berhasil diarsipkan.');
    }

    public function unarchive(SuratMasuk $surat_masuk)
    {
        if (! $surat_masuk->diarsipkan_at) {
            return back()->with('info', 'Surat ini tidak dalam arsip.');
        }

        $this->services->unarchive($surat_masuk);

        return back()->with('success', 'Surat masuk dikembalikan ke daftar aktif.');
    }
}
