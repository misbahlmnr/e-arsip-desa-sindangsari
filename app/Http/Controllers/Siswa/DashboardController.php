<?php

namespace App\Http\Controllers\Siswa;

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
        $user = auth()->user()->load([
            'siswaProfile.kelas.materi',
            'siswaProfile.kelas.tugas',
            'nilai',
            'absensi',
            'materiRekomendasi'
        ]);

        // Generate recommendations if needed
        $this->adaptiveService->generateRecommendations($user);

        $kelas = $user->siswaProfile?->kelas;

        $data = [
            'total_materi' => $kelas ? $kelas->materi->count() : 0,
            'total_tugas' => $kelas ? $kelas->tugas->count() : 0,
            'total_nilai' => $user->nilai->count(),
            'total_rekomendasi' => $this->adaptiveService->getRecommendationsForStudent($user)->count(),
            'chart_data' => $this->getSiswaChartData($user),
            'rekomendasi' => $this->adaptiveService->getRecommendationsForStudent($user),
        ];

        return inertia('Siswa/Dashboard', $data);
    }

    private function getSiswaChartData(User $siswa)
    {
        // Get today's schedule for the student
        $todaySchedule = [];
        $kelas = $siswa->siswaProfile?->kelas;
        if ($kelas) {
            $hariIni = now()->locale('id')->dayName; // Get day name in Indonesian
            $todaySchedule = \App\Models\Jadwal::where('kelas_id', $kelas->id)
                ->where('hari', $hariIni)
                ->with(['mapel', 'guru'])
                ->orderBy('jam_mulai')
                ->get()
                ->toArray();
        }

        // Get pending assignments
        $pendingAssignments = \App\Models\Nilai::where('siswa_id', $siswa->id)
            ->whereNull('skor')
            ->with('tugas')
            ->count();

        // Get recent grades (last 5 assignments)
        $recentGrades = $siswa->nilai()
            ->with('tugas')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($nilai) {
                return [
                    'assignment' => $nilai->tugas->judul,
                    'score' => $nilai->skor,
                    'date' => $nilai->created_at->format('M d'),
                ];
            });

        // Get attendance stats
        $attendanceStats = [
            'present' => $siswa->absensi->where('status', 'hadir')->count(),
            'absent' => $siswa->absensi->where('status', 'alpa')->count(),
            'sick' => $siswa->absensi->where('status', 'sakit')->count(),
            'permission' => $siswa->absensi->where('status', 'izin')->count(),
        ];

        // Get performance trend (last 10 grades)
        $performanceTrend = $siswa->nilai()
            ->orderBy('created_at', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($nilai) {
                return [
                    'date' => $nilai->created_at->format('M d'),
                    'score' => $nilai->skor,
                ];
            });

        return [
            'today_schedule' => $todaySchedule,
            'pending_assignments' => $pendingAssignments,
            'recent_grades' => $recentGrades->toArray(),
            'attendance_stats' => $attendanceStats,
            'performance_trend' => $performanceTrend->toArray(),
        ];
    }
}
