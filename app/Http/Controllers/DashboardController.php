<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Logbook;
use App\Models\Presence;
use App\Models\Internship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $stats = [];
        $activeInternship = null;

        // Ambil data internship yang sedang aktif untuk user ini
        if ($user->hasRole('intern')) {
            $activeInternship = Internship::where('user_id', $user->id)
                                ->where('status', 'active')
                                ->first();
        }

        // Kumpulkan statistik berdasarkan peran
        if ($user->hasRole('admin') || $user->hasRole('super_admin') || $user->hasRole('supervisor')) {
            $stats = [
                'pending_logbooks' => Logbook::where('status', 'submitted')->count(),
                'review_presences' => Presence::where('location_verified', false)->count(),
                'active_internships' => Internship::where('status', 'active')->count(),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'activeInternship' => $activeInternship,
        ]);
    }
}