<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\LaporanService;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function __construct(protected LaporanService $services) {}

    public function index(Request $request)
    {
        $data = $this->services->index($request);

        return inertia('laporan/Index', $data);
    }

    public function export(Request $request)
    {
        return $this->services->exportPdf($request);
    }
}
