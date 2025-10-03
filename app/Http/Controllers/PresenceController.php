<?php

namespace App\Http\Controllers; // ✅ perbaiki namespace

use App\Models\Presence;
use App\Models\Internship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\GeolocationService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class PresenceController extends Controller // ✅ extend controller Laravel
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

        if ($internship->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $today = Carbon::today()->toDateString();
        $now = Carbon::now();

        $existingPresence = Presence::where('internship_id', $internship->id)
            ->where('date', $today)
            ->first();

        if ($existingPresence && $existingPresence->checkin_time) {
            return response()->json(['message' => 'Anda sudah melakukan check-in hari ini.'], 422);
        }

        $pertaminaLat = 1.6854;
        $pertaminaLon = 102.1121;
        $maxDistanceMeters = 200;

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

        if ($internship->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $today = Carbon::today()->toDateString();
        $now = Carbon::now();

        $presence = Presence::where('internship_id', $internship->id)
            ->where('date', $today)
            ->first();

        if (!$presence || !$presence->checkin_time) {
            return response()->json(['message' => 'Anda belum melakukan check-in hari ini.'], 422);
        }

        if ($presence->checkout_time) {
            return response()->json(['message' => 'Anda sudah melakukan check-out hari ini.'], 422);
        }

        $pertaminaLat = 1.6854;
        $pertaminaLon = 102.1121;
        $maxDistanceMeters = 200;

        $distance = $this->geolocationService->calculateDistance(
            $request->latitude,
            $request->longitude,
            $pertaminaLat,
            $pertaminaLon
        );

        $locationVerified = $distance <= $maxDistanceMeters;
        $reviewReason = $presence->needs_manual_review_reason;
        if (!$locationVerified) {
            $reviewReason = "Lokasi di luar radius yang diizinkan saat check-out (".round($distance)."m).";
        }

        $path = $request->file('photo')->store("presences/{$today}", 'public');

        $presence->update([
            'checkout_time' => $now,
            'checkout_photo_url' => $path,
            'checkout_lat' => $request->latitude,
            'checkout_lon' => $request->longitude,
            'location_verified' => $presence->location_verified && $locationVerified,
            'location_distance_m' => round($distance),
            'needs_manual_review_reason' => $reviewReason
        ]);

        return response()->json([
            'message' => 'Check-out berhasil!',
            'presence' => $presence,
        ], 200);
    }
}
