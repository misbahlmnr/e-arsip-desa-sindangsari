<?php

namespace App\Http\Controllers\Sekdes;

use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        return inertia('Sekdes/Dashboard');
    }
}
