<?php

use App\Http\Controllers\PresenceController;

Route::middleware('auth:sanctum')->group(function () {
    // ... rute lain
    Route::post('/internships/{internship}/presence/checkin', [PresenceController::class, 'checkIn']);
    // Route::post('/internships/{internship}/presence/checkout', [PresenceController::class, 'checkOut']);
});