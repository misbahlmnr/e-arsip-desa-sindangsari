<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Services\ArsipSuratService;
use Illuminate\Http\Request;

class ArsipSuratController extends Controller
{
    public function __construct(private ArsipSuratService $services) {}

    public function index(Request $request)
    {
        $data = $this->services->index($request);

        return inertia('arsip-surat/Index', [
            'letters' => $data['letters'],
            'filters' => $data['filters'],
        ]);
    }

    public function show(Request $request, string $jenis, int $id)
    {
        if (! in_array($jenis, ['masuk', 'keluar'], true)) {
            abort(404);
        }

        if ($jenis === 'masuk') {
            $letter = SuratMasuk::query()
                ->whereNotNull('diarsipkan_at')
                ->findOrFail($id);
        } else {
            $letter = SuratKeluar::query()
                ->whereNotNull('diarsipkan_at')
                ->findOrFail($id);
        }

        return inertia('arsip-surat/Show', [
            'jenis' => $jenis,
            'letter' => $letter,
        ]);
    }
}
