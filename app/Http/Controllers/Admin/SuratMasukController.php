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
}
