<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesSuratManagement;
use App\Http\Controllers\Controller;
use App\Http\Requests\SuratMasuk\StoreRequest;
use App\Http\Requests\SuratMasuk\UpdateRequest;
use App\Http\Requests\SuratMasuk\UpdateStatusRequest;
use App\Models\SuratMasuk;
use App\Services\DisposisiService;
use App\Services\SuratMasukService;
use Illuminate\Http\Request;

class SuratMasukController extends Controller
{
    use AuthorizesSuratManagement;
    public function __construct(
        protected SuratMasukService $services,
        protected DisposisiService $disposisiService,
    ) {}

    public function index(Request $request)
    {
        $data = $this->services->index($request);

        return inertia('surat-masuk/Index', [
            'letters' => $data['letters'],
            'filters' => $data['filters'],
        ]);
    }

    public function create()
    {
        $this->authorizeSuratManagement();

        return inertia('surat-masuk/Create');
    }

    public function show(SuratMasuk $surat_masuk)
    {
        $letter = $surat_masuk->toArray();
        $letter['disposisi'] = $this->disposisiService->formatTimelineForSurat($surat_masuk);

        return inertia('surat-masuk/Show', [
            'letter' => $letter,
        ]);
    }

    public function edit(SuratMasuk $surat_masuk)
    {
        $this->authorizeSuratManagement();

        return inertia('surat-masuk/Edit', [
            'letter' => $surat_masuk,
        ]);
    }

    public function store(StoreRequest $request)
    {
        $this->authorizeSuratManagement();

        $this->services->store($request);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil ditambahkan.');
    }

    public function update(UpdateRequest $request, SuratMasuk $surat_masuk)
    {
        $this->authorizeSuratManagement();

        $this->services->update($request, $surat_masuk);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil diperbarui.');
    }

    public function destroy(SuratMasuk $surat_masuk)
    {
        $this->authorizeSuratManagement();

        $this->services->destroy($surat_masuk);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil dihapus.');
    }

    public function updateStatus(UpdateStatusRequest $request, SuratMasuk $surat_masuk)
    {
        $this->services->updateStatus($surat_masuk, $request->validated('status'));

        return back()->with('success', 'Status surat berhasil diperbarui.');
    }

    public function archive(SuratMasuk $surat_masuk)
    {
        $this->authorizeSuratManagement();

        if ($surat_masuk->diarsipkan_at) {
            return back()->with('info', 'Surat ini sudah berada di arsip.');
        }

        $this->services->archive($surat_masuk);

        return back()->with('success', 'Surat masuk berhasil diarsipkan.');
    }

    public function unarchive(SuratMasuk $surat_masuk)
    {
        $this->authorizeSuratManagement();

        if (! $surat_masuk->diarsipkan_at) {
            return back()->with('info', 'Surat ini tidak dalam arsip.');
        }

        $this->services->unarchive($surat_masuk);

        return back()->with('success', 'Surat masuk dikembalikan ke daftar aktif.');
    }
}
