<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuratMasuk\StoreRequest;
use App\Http\Requests\SuratMasuk\UpdateRequest;
use App\Models\Letter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\SuratMasukService;

class SuratMasukController extends Controller
{
    public function __construct(protected SuratMasukService $services) {
        $this->services = $services;
    }

    public function index(Request $request)
    {
        $data = $this->services->index($request);

        return Inertia::render('Admin/SuratMasuk/Index', [
            'letters' => $data['letters'],
            'filters' => $data['filters'],
        ]);
    }

    public function store(StoreRequest $request)
    {
        $services->store($request);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil ditambahkan.');
    }

    public function update(UpdateRequest $request, Letter $surat_masuk)
    {
        $this->services->update($request, $surat_masuk);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil diperbarui.');
    }

    public function destroy(Letter $surat_masuk)
    {
        $this->services->destroy($surat_masuk);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil dihapus.');
    }
}
