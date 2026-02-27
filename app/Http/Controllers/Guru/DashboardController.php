<?php

namespace App\Http\Controllers\Guru;

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
            'mapels.kelas.siswa',
            'materi',
            'tugas',
        ]);

        $data = [
            'total_kelas' => $user->mapels->pluck('kelas')->unique()->count(),
            'total_materi' => $user->materi->count(),
            'total_tugas' => $user->tugas->count(),
            'total_siswa' => $user->mapels->pluck('kelas.siswa')->flatten()->unique()->count(),
            'chart_data' => $this->getGuruChartData($user),
        ];

        return inertia('Guru/Dashboard', $data);
    }

    private function getGuruChartData(User $guru)
    {
        // Get today's schedule
        $today = now()->toDateString();
        $hariIni = now()->locale('id')->dayName; // Get day name in Indonesian
        $todaySchedule = \App\Models\Jadwal::where('guru_id', $guru->id)
            ->where('hari', $hariIni)
            ->with(['mapel', 'kelas'])
            ->orderBy('jam_mulai')
            ->get();

        // Unrated assignments
        $unratedAssignments = \App\Models\Nilai::whereHas('tugas', function($q) use ($guru) {
            $q->where('guru_id', $guru->id);
        })->whereNull('skor')->count();

        // Recent activities
        $recentActivities = [
            'materi_created' => $guru->materi()->where('created_at', '>=', now()->subDays(7))->count(),
            'tugas_created' => $guru->tugas()->where('created_at', '>=', now()->subDays(7))->count(),
            'absensi_taken' => \App\Models\Absensi::whereHas('jadwal', function($q) use ($guru) {
                $q->where('guru_id', $guru->id);
            })->where('created_at', '>=', now()->subDays(7))->count(),
            'nilai_given' => \App\Models\Nilai::whereHas('tugas', function($q) use ($guru) {
                $q->where('guru_id', $guru->id);
            })->where('created_at', '>=', now()->subDays(7))->count(),
        ];

        // Class performance (average scores per class)
        $classPerformance = \App\Models\Nilai::join('tugas', 'nilai.tugas_id', '=', 'tugas.id')
            ->join('users', 'nilai.siswa_id', '=', 'users.id')
            ->join('siswa_profiles', 'users.id', '=', 'siswa_profiles.user_id')
            ->join('kelas', 'siswa_profiles.kelas_id', '=', 'kelas.id')
            ->where('tugas.guru_id', $guru->id)
            ->selectRaw('kelas.nama as class_name, AVG(nilai.skor) as avg_score')
            ->groupBy('kelas.nama')
            ->get()
            ->map(function ($item) {
                return [
                    'class' => $item->class_name,
                    'score' => round($item->avg_score, 1)
                ];
            });

        return [
            'today_schedule' => $todaySchedule->toArray(),
            'unrated_assignments' => $unratedAssignments,
            'recent_activities' => $recentActivities,
            'class_performance' => $classPerformance->toArray(),
        ];
    }
}
