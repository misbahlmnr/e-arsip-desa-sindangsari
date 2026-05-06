<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Sekdes\DashboardController as SekdesDashboardController;
use App\Http\Controllers\Kades\DashboardController as KadesDashboardController;
use App\Http\Controllers\Admin\{SuratMasukController, SuratKeluarController};
use App\Http\Controllers\ProfileController;
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
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin routes
    Route::middleware('role:admin')->name('admin.')->group(function () {
        Route::resource('surat-masuk', SuratMasukController::class);
        Route::resource('surat-keluar', SuratKeluarController::class);
    });
});

require __DIR__.'/auth.php';
