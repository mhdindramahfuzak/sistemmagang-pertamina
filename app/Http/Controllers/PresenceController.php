<?php

namespace App\Http\Controllers;

use App\Models\Presence;
use App\Models\Internship;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Services\GeolocationService;
use Illuminate\Support\Facades\Storage;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PresenceController extends Controller
{
    use AuthorizesRequests;

    protected $geolocationService;

    public function __construct(GeolocationService $geolocationService)
    {
        $this->geolocationService = $geolocationService;
    }

    public function index()
    {
        $user = Auth::user();
        $internship = Internship::where('user_id', $user->id)->where('status', 'active')->first();

        if (!$internship) {
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki program magang yang aktif.');
        }

        $todayPresence = Presence::where('internship_id', $internship->id)
            ->whereDate('date', Carbon::today())
            ->first();

        return Inertia::render('Presence/Index', [
            'internship' => $internship,
            'todayPresence' => $todayPresence,
        ]);
    }

    public function storeCheckIn(Request $request)
    {
        $request->validate([
            'internship_id' => 'required|exists:internships,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'required|image',
        ]);

        $internship = Internship::findOrFail($request->internship_id);
        $this->authorize('update', $internship); // Pastikan user adalah pemilik internship

        $todayPresence = Presence::where('internship_id', $internship->id)
            ->whereDate('date', Carbon::today())
            ->first();

        if ($todayPresence) {
            return back()->with('error', 'Anda sudah melakukan check-in hari ini.');
        }

        // Simpan foto
        $path = $request->file('photo')->store('presence-photos', 'public');
        $photoUrl = Storage::url($path);

        // Validasi Lokasi
        $distance = $this->geolocationService->calculateDistance(
            $request->latitude,
            $request->longitude,
            config('services.pertamina.latitude'),
            config('services.pertamina.longitude')
        );

        $isVerified = $distance <= config('services.pertamina.radius_meters');

        Presence::create([
            'internship_id' => $internship->id,
            'user_id' => Auth::id(),
            'date' => Carbon::today(),
            'checkin_time' => Carbon::now(),
            'checkin_photo_url' => $photoUrl,
            'checkin_lat' => $request->latitude,
            'checkin_lon' => $request->longitude,
            'status' => $isVerified ? 'present' : 'pending_location',
            'location_verified' => $isVerified,
            'location_distance_m' => round($distance),
        ]);

        return redirect()->route('presence.index')->with('success', 'Check-in berhasil direkam.');
    }

    public function storeCheckOut(Request $request)
    {
        $request->validate([
            'presence_id' => 'required|exists:presences,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'required|image',
        ]);

        $presence = Presence::findOrFail($request->presence_id);
        $this->authorize('update', $presence->internship);

        if ($presence->checkout_time) {
            return back()->with('error', 'Anda sudah melakukan check-out hari ini.');
        }

        // Simpan foto
        $path = $request->file('photo')->store('presence-photos', 'public');
        $photoUrl = Storage::url($path);

        $presence->update([
            'checkout_time' => Carbon::now(),
            'checkout_photo_url' => $photoUrl,
            'checkout_lat' => $request->latitude,
            'checkout_lon' => $request->longitude,
        ]);

        return redirect()->route('presence.index')->with('success', 'Check-out berhasil direkam.');
    }
    
    public function review()
    {
        $this->authorize('viewAny', Presence::class); // Placeholder, you might need a PresencePolicy

        $presences = Presence::where('location_verified', false)
            ->with(['user', 'internship'])
            ->latest()
            ->paginate(20);
            
        return Inertia::render('Presence/Review', [
            'presences' => $presences,
        ]);
    }
    
    public function verify(Presence $presence)
    {
        $this->authorize('update', $presence); // Placeholder, you might need a PresencePolicy

        $presence->update([
            'location_verified' => true,
            'status' => 'present',
            'location_verified_by' => Auth::id(),
        ]);

        // Kirim notifikasi ke intern jika perlu

        return back()->with('success', 'Presensi berhasil diverifikasi.');
    }
}
