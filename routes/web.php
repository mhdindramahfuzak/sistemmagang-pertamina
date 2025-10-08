<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\PresenceController;
use App\Http\Controllers\ReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Http\Requests\PresenceCheckInRequest; // Impor Form Request
use App\Http\Controllers\InternshipController; 
use App\Http\Controllers\FinalReportController; // <--- TAMBAHKAN TITIK KOMA DI SINI

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Presence
    Route::get('/presence', [PresenceController::class, 'index'])->name('presence.index');
    Route::post('/presence/{internship}/checkin', [PresenceController::class, 'checkIn'])->name('presence.checkin');
    Route::post('/presence/{internship}/checkout', [PresenceController::class, 'checkOut'])->name('presence.checkout');
    
    // Logbook
    Route::resource('logbooks', LogbookController::class);
    Route::put('/logbooks/{logbook}/verify', [LogbookController::class, 'verify'])->name('logbooks.verify')->middleware('role:supervisor|admin');
    Route::get('/logbooks/pending', [LogbookController::class, 'pendingVerification'])
    ->name('logbooks.pending')
    ->middleware('role:supervisor|admin');

    Route::resource('logbooks', LogbookController::class);
    Route::put('/logbooks/{logbook}/verify', [LogbookController::class, 'verify'])->name('logbooks.verify')->middleware('role:supervisor|admin');
    
    // Internship
    Route::get('/internship/history', [InternshipController::class, 'history'])->name('internship.history');

    // Final Report
    Route::get('/final-report', [FinalReportController::class, 'index'])->name('final-report.index');
    Route::post('/final-report', [FinalReportController::class, 'store'])->name('final-report.store');

    // Reports (Hanya untuk Supervisor dan Admin)
    Route::middleware('role:supervisor|admin')->group(function () {
        Route::get('/reports/attendance', [ReportController::class, 'attendance'])->name('reports.attendance');
        Route::get('/reports/attendance/export', [ReportController::class, 'exportAttendance'])->name('reports.attendance.export');
    });
});


require __DIR__.'/auth.php';