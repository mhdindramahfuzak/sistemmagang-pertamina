<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Models\Internship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Notifications\LogbookVerified; // <-- NOTIFICATION IMPORTED

class LogbookController extends Controller
{
    /**
     * Display a listing of the student's own logbooks.
     */
    public function index()
    {
        // Authorization: Ensures the user is allowed to view any logbook (typically for their role).
        $this->authorize('viewAny', Logbook::class);

        $user = Auth::user();
        // Find the active internship for the logged-in student.
        $internship = Internship::where('user_id', $user->id)->where('status', 'active')->firstOrFail();
        
        // Retrieve logbooks associated with that specific internship.
        $logbooks = Logbook::where('internship_id', $internship->id)
            ->latest('date') // Order by the most recent date
            ->get(['id', 'title', 'date', 'status']);

        return Inertia::render('Logbooks/Index', [
            'logbooks' => $logbooks,
            'internshipId' => $internship->id
        ]);
    }

    /**
     * Store a newly created logbook in storage.
     */
    public function store(Request $request)
    {
        // Authorization: Ensures the user is allowed to create a logbook.
        // The policy should handle checking if the internship belongs to the user.
        $this->authorize('create', Logbook::class);

        $request->validate([
            'internship_id' => 'required|exists:internships,id',
            'date' => 'required|date',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i|after:time_start',
        ]);
        
        Logbook::create([
            'internship_id' => $request->internship_id,
            'user_id' => Auth::id(),
            'date' => $request->date,
            'title' => $request->title,
            'description' => $request->description,
            'time_start' => $request->time_start,
            'time_end' => $request->time_end,
            'status' => 'submitted', // Default status upon creation
        ]);

        return redirect()->route('logbooks.index')->with('message', 'Logbook has been successfully saved.');
    }

    /**
     * Update the status of a logbook (verification by a supervisor).
     */
    public function verify(Request $request, Logbook $logbook)
    {
        // Authorization: Ensures the user (supervisor) can update this specific logbook.
        $this->authorize('update', $logbook);

        $request->validate([
            'status' => 'required|in:verified,rejected',
            'supervisor_comment' => 'nullable|string',
        ]);

        $logbook->update([
            'status' => $request->status,
            'supervisor_comment' => $request->supervisor_comment,
        ]);

        // --- NOTIFICATION ADDED ---
        // Send a notification to the student who owns this logbook.
        // This assumes a 'user' relationship exists on the Logbook model.
        $logbook->user->notify(new LogbookVerified($logbook));
        // --------------------------

        return back()->with('message', 'Logbook has been successfully verified.');
    }
    
    /**
     * Display a listing of logbooks awaiting verification for the supervisor.
     */
    public function pendingVerification()
    {
        // Authorization: Use a dedicated policy method for consistency.
        $this->authorize('viewPending', Logbook::class);

        $supervisor = Auth::user();

        // Get all logbooks with 'submitted' status from students
        // who are supervised by the current user.
        $pendingLogbooks = Logbook::where('status', 'submitted')
            ->whereHas('internship', function ($query) use ($supervisor) {
                $query->where('supervisor_id', $supervisor->id);
            })
            ->with('user:id,name') // Eager load the student's name to prevent N+1 queries
            ->latest() // Show the newest submissions first
            ->get();

        return Inertia::render('Logbooks/PendingVerification', [
            'pendingLogbooks' => $pendingLogbooks
        ]);
    }
}

