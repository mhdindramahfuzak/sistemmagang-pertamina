<?php

namespace App\Http\Controllers;

use App\Models\Internship;
use App\Models\Presence;
use App\Services\GeolocationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PresenceController extends Controller
{
    use AuthorizesRequests;

    protected $geolocationService;

    public function __construct(GeolocationService $geolocationService)
    {
        $this->geolocationService = $geolocationService;
    }

    /**
     * Menampilkan halaman presensi utama.
     */
    public function index()
    {
        $user = Auth::user();
        $activeInternship = Internship::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        $todayPresence = null;
        if ($activeInternship) {
            $todayPresence = Presence::where('internship_id', $activeInternship->id)
                ->whereDate('date', Carbon::today())
                ->first();
        }

        // Mengirim data penting ke frontend, termasuk konfigurasi jam presensi.
        return Inertia::render('Presence/Index', [
            'activeInternship' => $activeInternship,
            'todayPresence' => $todayPresence,
            'presenceConfig' => config('simagang.presence'), // <-- MENGIRIM CONFIG KE FRONTEND
        ]);
    }

    /**
     * Memproses permintaan check-in.
     */
    public function checkin(Request $request)
    {
        $this->authorize('create', Presence::class);

        // --- VALIDASI WAKTU CHECK-IN (BACKEND) ---
        $now = Carbon::now();
        $startTime = Carbon::parse(config('simagang.presence.checkin_start'));
        $endTime = Carbon::parse(config('simagang.presence.checkin_end'));

        if (!$now->between($startTime, $endTime, true)) {
            $message = sprintf('Check-in hanya bisa dilakukan antara pukul %s dan %s.', $startTime->format('H:i'), $endTime->format('H:i'));
            return redirect()->back()->with('error', $message);
        }
        // --- AKHIR VALIDASI WAKTU ---

        $request->validate([
            'photo' => 'required|image',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $user = Auth::user();
        $activeInternship = Internship::where('user_id', $user->id)
            ->where('status', 'active')
            ->firstOrFail();

        $existingPresence = Presence::where('internship_id', $activeInternship->id)
            ->whereDate('date', Carbon::today())
            ->first();

        if ($existingPresence) {
            return redirect()->back()->with('error', 'Anda sudah melakukan check-in hari ini.');
        }

        $photoPath = $request->file('photo')->store('presence-photos', 'public');
        $distance = $this->geolocationService->calculateDistance($request->latitude, $request->longitude);
        $isVerified = $this->geolocationService->isWithinRadius($distance);

        Presence::create([
            'internship_id' => $activeInternship->id,
            'user_id' => $user->id,
            'date' => Carbon::today(),
            'checkin_time' => $now,
            'checkin_photo_url' => $photoPath,
            'checkin_lat' => $request->latitude,
            'checkin_lon' => $request->longitude,
            'location_verified' => $isVerified,
            'location_distance_m' => $distance,
            'status' => $isVerified ? 'present' : 'pending_verification',
        ]);

        return redirect()->route('presence.index')->with('success', 'Check-in berhasil.');
    }

    /**
     * Memproses permintaan check-out.
     */
    public function checkout(Request $request)
    {
        $this->authorize('create', Presence::class);

        // --- VALIDASI WAKTU CHECK-OUT (BACKEND) ---
        $now = Carbon::now();
        $startTime = Carbon::parse(config('simagang.presence.checkout_start'));
        $endTime = Carbon::parse(config('simagang.presence.checkout_end'));

        if (!$now->between($startTime, $endTime, true)) {
            $message = sprintf('Check-out hanya bisa dilakukan antara pukul %s dan %s.', $startTime->format('H:i'), $endTime->format('H:i'));
            return redirect()->back()->with('error', $message);
        }
        // --- AKHIR VALIDASI WAKTU ---

        $request->validate([
            'photo' => 'required|image',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $user = Auth::user();
        $activeInternship = Internship::where('user_id', $user->id)
            ->where('status', 'active')
            ->firstOrFail();

        $presence = Presence::where('internship_id', $activeInternship->id)
            ->whereDate('date', Carbon::today())
            ->firstOrFail();

        if ($presence->checkout_time) {
            return redirect()->back()->with('error', 'Anda sudah melakukan check-out hari ini.');
        }

        $photoPath = $request->file('photo')->store('presence-photos', 'public');

        $presence->update([
            'checkout_time' => $now,
            'checkout_photo_url' => $photoPath,
            'checkout_lat' => $request->latitude,
            'checkout_lon' => $request->longitude,
        ]);

        return redirect()->route('presence.index')->with('success', 'Check-out berhasil.');
    }

    /**
     * Menampilkan halaman untuk review presensi oleh supervisor/admin.
     */
    public function review()
    {
        $this->authorize('verify', Presence::class);
        $pendingPresences = Presence::with(['user', 'internship'])
            ->where('location_verified', false)
            ->where('status', 'pending_verification')
            ->latest()
            ->paginate(10);
        return Inertia::render('Presence/Review', ['presences' => $pendingPresences,]);
    }

    /**
     * Memverifikasi presensi yang tertunda.
     */
    public function verify(Presence $presence)
    {
        $this->authorize('verify', Presence::class);
        $presence->update(['location_verified' => true, 'status' => 'present', 'location_verified_by' => Auth::id(),]);
        return redirect()->route('presence.review')->with('success', 'Presensi berhasil diverifikasi.');
    }
}

