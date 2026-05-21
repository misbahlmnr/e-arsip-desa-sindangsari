<?php

use App\Http\Controllers\Admin\ArsipSuratController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\SuratKeluarController;
use App\Http\Controllers\Admin\SuratMasukController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Kades\DashboardController as KadesDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Sekdes\DashboardController as SekdesDashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    if (auth()->user()->isAdmin()) {
        return app(AdminDashboardController::class)->index();
    } elseif (auth()->user()->isSekdes()) {
        return app(SekdesDashboardController::class)->index();
    } elseif (auth()->user()->isKades()) {
        return app(KadesDashboardController::class)->index();
    }

    return abort(403);
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Surat & arsip: admin + sekdes (read-only untuk sekdes)
    Route::middleware('role:admin,sekdes')->name('admin.')->group(function () {
        Route::get('arsip-surat', [ArsipSuratController::class, 'index'])->name('arsip-surat.index');
        Route::get('arsip-surat/{jenis}/{id}', [ArsipSuratController::class, 'show'])
            ->whereIn('jenis', ['masuk', 'keluar'])
            ->whereNumber('id')
            ->name('arsip-surat.show');
        Route::get('surat-masuk', [SuratMasukController::class, 'index'])->name('surat-masuk.index');
        Route::get('surat-masuk/{surat_masuk}', [SuratMasukController::class, 'show'])->name('surat-masuk.show');
        Route::get('surat-keluar', [SuratKeluarController::class, 'index'])->name('surat-keluar.index');
        Route::get('surat-keluar/{surat_keluar}', [SuratKeluarController::class, 'show'])->name('surat-keluar.show');
    });

    // Mutasi surat & manajemen user: admin saja
    Route::middleware('role:admin')->name('admin.')->group(function () {
        Route::patch('surat-masuk/{surat_masuk}/arsipkan', [SuratMasukController::class, 'archive'])->name('surat-masuk.archive');
        Route::patch('surat-masuk/{surat_masuk}/batal-arsip', [SuratMasukController::class, 'unarchive'])->name('surat-masuk.unarchive');
        Route::patch('surat-keluar/{surat_keluar}/arsipkan', [SuratKeluarController::class, 'archive'])->name('surat-keluar.archive');
        Route::patch('surat-keluar/{surat_keluar}/batal-arsip', [SuratKeluarController::class, 'unarchive'])->name('surat-keluar.unarchive');
        Route::resource('surat-masuk', SuratMasukController::class)->except(['index', 'show']);
        Route::resource('surat-keluar', SuratKeluarController::class)->except(['index', 'show']);
        Route::resource('users', UserController::class);
    });
});

require __DIR__.'/auth.php';
