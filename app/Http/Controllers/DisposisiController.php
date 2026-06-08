<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AuthorizesDisposisi;
use App\Http\Requests\Disposisi\StoreFromSuratRequest;
use App\Http\Requests\Disposisi\StoreRequest;
use App\Models\Disposisi;
use App\Models\JabatanTujuanDisposisi;
use App\Models\SuratMasuk;
use App\Services\DisposisiService;
use Illuminate\Http\Request;

class DisposisiController extends Controller
{
    use AuthorizesDisposisi;

    public function __construct(protected DisposisiService $services) {}

    public function index(Request $request)
    {
        $this->authorizeDisposisi();
        $data = $this->services->index($request);

        return inertia('disposisi/Index', [
            'disposisi' => $data['disposisi'],
            'filters' => $data['filters'],
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeDisposisi();

        $suratMasukId = $request->integer('surat_masuk_id') ?: null;
        $user = $request->user();

        return inertia('disposisi/Create', [
            'suratOptions' => $this->services->suratOptions($user),
            'jabatanOptions' => JabatanTujuanDisposisi::activeOptions(),
            'dariJabatan' => $user->isKades() ? Disposisi::DARI_KADES : Disposisi::DARI_SEKDES,
            'selectedSuratMasukId' => $suratMasukId,
        ]);
    }

    public function store(StoreRequest $request)
    {
        $disposisi = $this->services->store($request);

        return redirect()
            ->route('admin.disposisi.show', ['disposisi' => $disposisi->id])
            ->with('success', 'Disposisi berhasil dikirim.');
    }

    public function storeFromSurat(StoreFromSuratRequest $request, SuratMasuk $surat_masuk)
    {
        $this->services->storeFromSurat($request, $surat_masuk);

        return back()->with('success', 'Disposisi berhasil dikirim.');
    }

    public function show(Disposisi $disposisi)
    {
        $this->authorizeDisposisi();

        return inertia('disposisi/Show', [
            'disposisi' => $this->services->formatDetail($disposisi),
        ]);
    }
}
