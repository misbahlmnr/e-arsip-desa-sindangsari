<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;

class DashboardController extends Controller
{
    public function index()
    {
        $totalArsip = SuratMasuk::query()->whereNotNull('diarsipkan_at')->count()
            + SuratKeluar::query()->whereNotNull('diarsipkan_at')->count();

        $data = [
            'total_users' => 0,
            'total_kelas' => 0,
            'total_guru' => 0,
            'total_siswa' => 0,
            'total_tugas' => 0,
            'total_absensi' => 0,
            'total_arsip' => $totalArsip,
            'chart_data' => [
                'user_growth' => [],
                'class_distribution' => [],
                'subject_performance' => [],
                'recent_activity' => [],
            ],
        ];

        return inertia('Admin/Dashboard', $data);
    }
}
