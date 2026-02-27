<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Guru\DashboardController as GuruDashboardController;
use App\Http\Controllers\Siswa\DashboardController as SiswaDashboardController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\GuruController;
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\Admin\KelasController;
use App\Http\Controllers\Admin\MapelController;
use App\Http\Controllers\Admin\JadwalController;
use App\Http\Controllers\Admin\AdaptiveRuleController;
use App\Http\Controllers\Admin\LaporanNilaiController;
use App\Http\Controllers\Admin\LaporanAbsensiController;
use App\Http\Controllers\Admin\LaporanAdaptiveController;
use App\Http\Controllers\Guru\JadwalController as GuruJadwalController;
use App\Http\Controllers\Guru\MateriController as GuruMateriController;
use App\Http\Controllers\Guru\TugasController as GuruTugasController;
use App\Http\Controllers\Guru\NilaiController as GuruNilaiController;
use App\Http\Controllers\Guru\AbsensiController as GuruAbsensiController;
use App\Http\Controllers\Guru\AdaptiveRuleController as GuruAdaptiveRuleController;
use App\Http\Controllers\Siswa\JadwalController as SiswaJadwalController;
use App\Http\Controllers\Siswa\MateriController as SiswaMateriController;
use App\Http\Controllers\Siswa\MateriRekomendasiController as SiswaMateriRekomendasiController;
use App\Http\Controllers\Siswa\TugasController as SiswaTugasController;
use App\Http\Controllers\Siswa\NilaiController as SiswaNilaiController;
use App\Http\Controllers\Siswa\AbsensiController as SiswaAbsensiController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    if (auth()->user()->isAdmin()) {
        return app(AdminDashboardController::class)->index();
    } elseif (auth()->user()->isGuru()) {
        return app(GuruDashboardController::class)->index();
    } elseif (auth()->user()->isSiswa()) {
        return app(SiswaDashboardController::class)->index();
    }
    return abort(403);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::prefix('manajemen-user')->name('manajemen-user.')->group(function () {
            Route::resource('admins', AdminController::class);
            Route::resource('gurus', GuruController::class);
            Route::resource('siswas', SiswaController::class);
        });
        Route::resource('kelas', KelasController::class);
        Route::resource('mapel', MapelController::class);
        Route::resource('jadwal', JadwalController::class);
        Route::resource('adaptive-rule', AdaptiveRuleController::class);
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('nilai', [LaporanNilaiController::class, 'index'])->name('nilai');
            Route::get('nilai/export', [LaporanNilaiController::class, 'export'])->name('nilai.export');
            Route::get('absensi', [LaporanAbsensiController::class, 'index'])->name('absensi');
            Route::get('absensi/export', [LaporanAbsensiController::class, 'export'])->name('absensi.export');
            Route::get('adaptive-rules', [LaporanAdaptiveController::class, 'index'])->name('adaptive-rules');
            Route::get('adaptive-rules/export', [LaporanAdaptiveController::class, 'export'])->name('adaptive-rules.export');
        });
    });

    // Guru routes
    Route::middleware('role:guru')->prefix('guru')->name('guru.')->group(function () {
        Route::get('jadwal-mengajar', [GuruJadwalController::class, 'index'])->name('jadwal-mengajar');
        Route::resource('materi', GuruMateriController::class);
        Route::resource('tugas', GuruTugasController::class);
        Route::post('tugas/{tuga}/grade/{nilaiId}', [GuruTugasController::class, 'grade'])->name('tugas.grade');
        Route::resource('nilai', GuruNilaiController::class);
        Route::resource('absensi', GuruAbsensiController::class);
        Route::resource('adaptive-rules', GuruAdaptiveRuleController::class);
    });

    // Siswa routes
    Route::middleware('role:siswa')->prefix('siswa')->name('siswa.')->group(function () {
        Route::get('jadwal', [SiswaJadwalController::class, 'index'])->name('jadwal');
        Route::get('materi', [SiswaMateriController::class, 'index'])->name('materi.index');
        Route::get('materi/{materi}', [SiswaMateriController::class, 'show'])->name('materi.show');
        Route::get('materi-rekomendasi', [SiswaMateriRekomendasiController::class, 'index'])->name('materi-rekomendasi.index');
        Route::post('materi-rekomendasi/{materiRekomendasi}/mark-completed', [SiswaMateriRekomendasiController::class, 'markCompleted'])->name('materi-rekomendasi.mark-completed');
        Route::get('tugas', [SiswaTugasController::class, 'index'])->name('tugas.index');
        Route::get('tugas/{tugas}', [SiswaTugasController::class, 'show'])->name('tugas.show');
        Route::put('tugas/{tugas}/submit', [SiswaTugasController::class, 'submit'])->name('tugas.submit');
        Route::get('nilai', [SiswaNilaiController::class, 'index'])->name('nilai.index');
        Route::get('absensi', [SiswaAbsensiController::class, 'index'])->name('absensi.index');
    });
});

require __DIR__.'/auth.php';
