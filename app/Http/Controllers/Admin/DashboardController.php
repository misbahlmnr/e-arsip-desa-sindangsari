<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $data = [
            'total_users' => 0,
            'total_kelas' => 0,
            'total_guru' => 0,
            'total_siswa' => 0,
            'total_tugas' => 0,
            'total_absensi' => 0,
            'chart_data' => [
                'user_growth' => [],
                'class_distribution' => [],
                'subject_performance' => [],
                'recent_activity' => []
            ],
        ];

        return inertia('Admin/Dashboard', $data);
    }
}
