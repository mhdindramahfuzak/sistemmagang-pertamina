<?php

namespace App\Http\Controllers;

use App\Models\Internship;
use App\Models\Presence;
use App\Services\GeolocationService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Http\Requests\PresenceCheckInRequest;

class PresenceController extends Controller
{
    protected $geolocationService;

    public function __construct(GeolocationService $geolocationService)
    {
        $this->geolocationService = $geolocationService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $internship = $user->internships()->where('status', 'active')->first();

        if (!$internship) {
            return Inertia::render('Presence/Index', [
                'internship' => null,
                'todayPresence' => null,
            ]);
        }

        $todayPresence = Presence::where('internship_id', $internship->id)
            ->whereDate('date', Carbon::today())
            ->first();

        return Inertia::render('Presence/Index', [
            'internship' => $internship,
            'todayPresence' => $todayPresence,
        ]);
    }

    public function checkIn(PresenceCheckInRequest $request, Internship $internship)
    {
        $user = $request->user();
        $today = Carbon::today();

        if ($internship->user_id !== $user->id) {
            return back()->with('error', 'Anda tidak diizinkan untuk melakukan aksi ini.');
        }

        $existingPresence = Presence::where('internship_id', $internship->id)
            ->whereDate('date', $today)
            ->first();

        if ($existingPresence) {
            return back()->with('error', 'Anda sudah melakukan check-in hari ini.');
        }

        $validated = $request->validated();
        // Assuming reference latitude and longitude are stored in config
        $refLat = config('simagang.office_latitude');
        $refLon = config('simagang.office_longitude');
        $distance = $this->geolocationService->calculateDistance(
            $validated['latitude'],
            $validated['longitude'],
            $refLat,
            $refLon
        );
        $locationVerified = $distance <= config('simagang.location_threshold_m');

        // Simpan foto ke disk 'public'
        $photoPath = $request->file('photo')->store("presences/{$internship->id}", 'public');

        Presence::create([
            'internship_id' => $internship->id,
            'user_id' => $user->id,
            'date' => $today,
            'checkin_time' => now(),
            // Dapatkan URL menggunakan Storage facade
            'checkin_photo_url' => Storage::url($photoPath),
            'checkin_lat' => $validated['latitude'],
            'checkin_lon' => $validated['longitude'],
            'status' => $locationVerified ? 'present' : 'pending_location_review',
            'location_verified' => $locationVerified,
            'location_distance_m' => round($distance),
        ]);
        
        return to_route('presence.index')->with('success', 'Check-in berhasil! Selamat bekerja.');
    }

    public function checkOut(PresenceCheckInRequest $request, Internship $internship)
    {
        $user = $request->user();
        $today = Carbon::today();

        if ($internship->user_id !== $user->id) {
            return back()->with('error', 'Anda tidak diizinkan untuk melakukan aksi ini.');
        }

        $presence = Presence::where('internship_id', $internship->id)
            ->whereDate('date', $today)
            ->first();

        if (!$presence) {
            return back()->with('error', 'Anda belum melakukan check-in hari ini.');
        }

        if ($presence->checkout_time) {
            return back()->with('error', 'Anda sudah melakukan check-out hari ini.');
        }

        $validated = $request->validated();
        
        // Simpan foto ke disk 'public'
        $photoPath = $request->file('photo')->store("presences/{$internship->id}", 'public');
        
        $presence->update([
            'checkout_time' => now(),
            'checkout_photo_url' => Storage::url($photoPath),
            'checkout_lat' => $validated['latitude'],
            'checkout_lon' => $validated['longitude'],
        ]);

        return to_route('presence.index')->with('success', 'Check-out berhasil! Selamat beristirahat.');
    }
}