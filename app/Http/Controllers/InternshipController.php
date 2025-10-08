<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InternshipController extends Controller
{
    public function history(): Response
    {
        $user = Auth::user();

        // Ambil semua data magang user, beserta data supervisor
        $internships = $user->internships()->with('supervisor:id,name')->latest()->get();

        return Inertia::render('Internship/History', [
            'internships' => $internships,
        ]);
    }
}