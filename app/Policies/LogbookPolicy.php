<?php

namespace App\Policies;

use App\Models\Logbook;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LogbookPolicy
{
    /**
     * Izinkan admin melakukan apa saja.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('super_admin') || $user->hasRole('admin')) {
            return true;
        }
        return null;
    }

    /**
     * Tentukan apakah user bisa melihat logbook.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['intern', 'supervisor']);
    }

    /**
     * Tentukan apakah user bisa membuat logbook.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('intern');
    }

    /**
     * Tentukan apakah user bisa mengupdate (memverifikasi) logbook.
     */
    public function update(User $user, Logbook $logbook): bool
    {
        // Hanya supervisor dari internship terkait yang bisa memverifikasi
        return $user->hasRole('supervisor') && $logbook->internship->supervisor_id === $user->id;
    }
}