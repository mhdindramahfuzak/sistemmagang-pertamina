<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('logbooks', LogbookController::class);
        Route::get('/reports/attendance/export', [ReportController::class, 'exportAttendance'])->name('reports.attendance.export');
});

Route::put('/logbooks/{logbook}/verify', [LogbookController::class, 'verify'])->name('logbooks.verify')->middleware('auth');

Route::get('/logbooks/pending-verification', [LogbookController::class, 'pendingVerification'])
    ->name('logbooks.pending')
    ->middleware('auth');

require __DIR__.'/auth.php';
