<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PresenceController;
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

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Logbooks
    Route::resource('logbooks', LogbookController::class);
    Route::put('/logbooks/{logbook}/verify', [LogbookController::class, 'verify'])
        ->name('logbooks.verify')
        ->middleware('role:supervisor|admin|super_admin');
    Route::get('/logbooks/pending-verification', [LogbookController::class, 'pendingVerification'])
        ->name('logbooks.pending')
        ->middleware('role:supervisor|admin|super_admin');

    // Presence
    Route::get('/presence', [PresenceController::class, 'index'])->name('presence.index')->middleware('role:intern');
    Route::post('/presence/check-in', [PresenceController::class, 'storeCheckIn'])->name('presence.checkin')->middleware('role:intern');
    Route::post('/presence/check-out', [PresenceController::class, 'storeCheckOut'])->name('presence.checkout')->middleware('role:intern');
    Route::get('/presence/review', [PresenceController::class, 'review'])->name('presence.review')->middleware('role:supervisor|admin|super_admin');
    Route::put('/presence/{presence}/verify', [PresenceController::class, 'verify'])->name('presence.verify')->middleware('role:supervisor|admin|super_admin');


    // Reports
    Route::get('/reports/attendance/export', [ReportController::class, 'exportAttendance'])->name('reports.attendance.export');
});


require __DIR__.'/auth.php';
