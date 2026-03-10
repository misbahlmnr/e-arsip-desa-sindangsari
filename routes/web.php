<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Guru\DashboardController as GuruDashboardController;
use App\Http\Controllers\Siswa\DashboardController as SiswaDashboardController;
use App\Http\Controllers\Admin\{SuratMasukController};
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    if (auth()->user()->isAdmin()) {
        return app(AdminDashboardController::class)->index();
    } elseif (auth()->user()->isSekdes()) {
        return app(GuruDashboardController::class)->index();
    } elseif (auth()->user()->isKades()) {
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
        Route::resource('surat-masuk', SuratMasukController::class);
    });

    // Guru routes
    Route::middleware('role:guru')->prefix('guru')->name('guru.')->group(function () {
    });

    // Siswa routes
    Route::middleware('role:siswa')->prefix('siswa')->name('siswa.')->group(function () {
    });
});

require __DIR__.'/auth.php';
