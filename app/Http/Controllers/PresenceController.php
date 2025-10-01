<?php

namespace App\Http\Controllers;

use App\Models\Presence;
use App\Models\Internship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\GeolocationService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class PresenceController extends Controller
{
    protected $geolocationService;

    public function __construct(GeolocationService $geolocationService)
    {
        $this->geolocationService = $geolocationService;
    }

    public function checkIn(Request $request, Internship $internship)
    {
        $request->validate([
            'photo' => 'required|image',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        // Pastikan yang check-in adalah user yang bersangkutan
        if ($internship->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $today = Carbon::today()->toDateString();
        $now = Carbon::now();

        // Cek apakah sudah check-in hari ini
        $existingPresence = Presence::where('internship_id', $internship->id)
            ->where('date', $today)
            ->first();

        if ($existingPresence && $existingPresence->checkin_time) {
            return response()->json(['message' => 'Anda sudah melakukan check-in hari ini.'], 422);
        }

        // Koordinat pusat Pertamina Sei Pakning (CONTOH - GANTI DENGAN KOORDINAT ASLI)
        $pertaminaLat = 1.6854; // Contoh Latitude
        $pertaminaLon = 102.1121; // Contoh Longitude
        $maxDistanceMeters = 200; // Radius toleransi 200 meter

        $distance = $this->geolocationService->calculateDistance(
            $request->latitude,
            $request->longitude,
            $pertaminaLat,
            $pertaminaLon
        );

        $locationVerified = $distance <= $maxDistanceMeters;
        $reviewReason = null;
        if (!$locationVerified) {
            $reviewReason = "Lokasi di luar radius yang diizinkan (".round($distance)."m).";
        }

        // Simpan foto
        $path = $request->file('photo')->store("presences/{$today}", 'public');

        $presence = Presence::updateOrCreate(
            ['internship_id' => $internship->id, 'date' => $today],
            [
                'user_id' => Auth::id(),
                'checkin_time' => $now,
                'checkin_photo_url' => $path,
                'checkin_lat' => $request->latitude,
                'checkin_lon' => $request->longitude,
                'status' => 'present',
                'location_verified' => $locationVerified,
                'location_distance_m' => round($distance),
                'needs_manual_review_reason' => $reviewReason
            ]
        );

        return response()->json([
            'message' => 'Check-in berhasil!',
            'presence' => $presence,
        ], 201);
    }
    
    public function checkOut(Request $request, Internship $internship)
    {
        $request->validate([
            'photo' => 'required|image',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        // Pastikan yang check-out adalah user yang bersangkutan
        if ($internship->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $today = Carbon::today()->toDateString();
        $now = Carbon::now();

        // Cek apakah sudah ada presence hari ini
        $presence = Presence::where('internship_id', $internship->id)
            ->where('date', $today)
            ->first();

        if (!$presence || !$presence->checkin_time) {
            return response()->json(['message' => 'Anda belum melakukan check-in hari ini.'], 422);
        }

        if ($presence->checkout_time) {
            return response()->json(['message' => 'Anda sudah melakukan check-out hari ini.'], 422);
        }

        // Koordinat pusat Pertamina Sei Pakning (GANTI DENGAN KOORDINAT ASLI)
        $pertaminaLat = 1.6854; 
        $pertaminaLon = 102.1121; 
        $maxDistanceMeters = 200; // Radius toleransi 200 meter

        $distance = $this->geolocationService->calculateDistance(
            $request->latitude,
            $request->longitude,
            $pertaminaLat,
            $pertaminaLon
        );

        $locationVerified = $distance <= $maxDistanceMeters;
        $reviewReason = null;
        if (!$locationVerified) {
            $reviewReason = "Lokasi di luar radius yang diizinkan saat check-out (".round($distance)."m).";
        }

        // Simpan foto checkout
        // BARU
        $path = $request->file('photo')->store("presences/{$today}", 's3');

        // Update presence dengan data checkout
        $presence->update([
            'checkout_time' => $now,
            'checkout_photo_url' => $path,
            'checkout_lat' => $request->latitude,
            'checkout_lon' => $request->longitude,
            'location_verified' => $locationVerified,
            'location_distance_m' => round($distance),
            'needs_manual_review_reason' => $reviewReason
        ]);

        return response()->json([
            'message' => 'Check-out berhasil!',
            'presence' => $presence,
        ], 200);
    }

}