<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $services) {}

    public function index()
    {
        return inertia('dashboard/Admin', $this->services->admin());
    }
}
