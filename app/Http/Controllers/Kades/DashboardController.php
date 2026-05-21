<?php

namespace App\Http\Controllers\Kades;

use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        return inertia('dashboard/Kades');
    }
}
