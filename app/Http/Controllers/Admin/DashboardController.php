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
            'total_users' => User::count(),
            'total_kelas' => Kelas::count(),
            'total_guru' => User::where('role', 'guru')->count(),
            'total_siswa' => User::where('role', 'siswa')->count(),
            'total_tugas' => Tugas::count(),
            'total_absensi' => Absensi::count(),
            'chart_data' => $this->getAdminChartData(),
        ];

        return inertia('Admin/Dashboard', $data);
    }

    private function getAdminChartData()
    {
        // User growth over time
        $userGrowth = \App\Models\User::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => \Carbon\Carbon::parse($item->date)->format('M d'),
                    'users' => $item->count
                ];
            });

        // Class distribution by grade level
        $classDistribution = \App\Models\Kelas::selectRaw('tingkat, COUNT(*) as count')
            ->groupBy('tingkat')
            ->orderBy('tingkat')
            ->get()
            ->map(function ($item) {
                return [
                    'grade' => 'Kelas ' . $item->tingkat,
                    'count' => $item->count
                ];
            });

        // Subject performance (average scores per subject)
        $subjectPerformance = \App\Models\Nilai::join('tugas', 'nilai.tugas_id', '=', 'tugas.id')
            ->join('mapel', 'tugas.mapel_id', '=', 'mapel.id')
            ->selectRaw('mapel.nama as subject, AVG(nilai.skor) as avg_score')
            ->groupBy('mapel.nama')
            ->get()
            ->map(function ($item) {
                return [
                    'subject' => $item->subject,
                    'score' => round($item->avg_score, 1)
                ];
            });

        // Recent activity (last 7 days)
        $recentActivity = [
            'materi_created' => \App\Models\Materi::where('created_at', '>=', now()->subDays(7))->count(),
            'tugas_created' => \App\Models\Tugas::where('created_at', '>=', now()->subDays(7))->count(),
            'absensi_taken' => \App\Models\Absensi::where('created_at', '>=', now()->subDays(7))->count(),
            'nilai_given' => \App\Models\Nilai::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        return [
            'user_growth' => $userGrowth->toArray(),
            'class_distribution' => $classDistribution->toArray(),
            'subject_performance' => $subjectPerformance->toArray(),
            'recent_activity' => $recentActivity,
        ];
    }
}
