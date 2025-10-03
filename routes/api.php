<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PresenceController; // Jangan lupa import


Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Pindahkan ke sini
    Route::post('/internships/{internship}/presence/checkin', [PresenceController::class, 'checkIn'])->name('api.presence.checkin');
    Route::post('/internships/{internship}/presence/checkout', [PresenceController::class, 'checkOut'])->name('api.presence.checkout');
});