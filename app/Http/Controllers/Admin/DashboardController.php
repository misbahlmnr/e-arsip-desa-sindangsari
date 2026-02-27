<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Tugas;
use App\Models\Absensi;
use App\Models\MateriRekomendasi;
use App\Services\AdaptiveLearningService;

class DashboardController extends Controller
{
    protected $adaptiveService;

    public function __construct(AdaptiveLearningService $adaptiveService)
    {
        $this->adaptiveService = $adaptiveService;
    }

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
