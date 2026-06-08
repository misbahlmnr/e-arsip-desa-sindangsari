<?php

namespace App\Http\Controllers\Sekdes;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $services) {}

    public function index()
    {
        return inertia('dashboard/Sekdes', $this->services->sekdes());
    }
}
