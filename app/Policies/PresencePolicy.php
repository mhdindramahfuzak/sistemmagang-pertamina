<?php

namespace App\Policies;

use App\Models\Internship;
use App\Models\Presence;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PresencePolicy
{
    /**
     * Determine whether the user can create models.
     * Aturan: Pengguna bisa melakukan check-in/check-out jika dia adalah 'intern'
     * DAN memiliki data magang yang sedang aktif.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('intern') &&
               Internship::where('user_id', $user->id)
                         ->where('status', 'active')
                         ->exists();
    }

    /**
     * Determine whether the user can verify a presence record.
     * Aturan: Pengguna bisa memverifikasi jika perannya adalah supervisor atau lebih tinggi.
     */
    public function verify(User $user): bool
    {
        return $user->hasAnyRole(['supervisor', 'admin', 'super_admin']);
    }
}
