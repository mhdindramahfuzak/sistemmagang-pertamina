<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Profile; 

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'profile' => $request->user()->profile, // Kirim data profil ke frontend
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        // Dapatkan atau buat profil baru untuk user
        $profile = $request->user()->profile ?? new Profile();
        $profile->user_id = $request->user()->id;

        // Isi data profil dari request
        $profile->fill($request->only([
            'nim_nip', 'institution', 'age', 'address', 'internship_duration', 'internship_field'
        ]));

        // Fungsi untuk menyimpan file
        $saveFile = function ($fileKey, $pathName) use ($request, $profile) {
            if ($request->hasFile($fileKey)) {
                // Hapus file lama jika ada
                if ($profile->{$pathName} && Storage::disk('public')->exists($profile->{$pathName})) {
                    Storage::disk('public')->delete($profile->{$pathName});
                }
                // Simpan file baru
                $path = $request->file($fileKey)->store("documents/{$request->user()->id}", 'public');
                $profile->{$pathName} = $path;
            }
        };

        $saveFile('cv', 'cv_path');
        $saveFile('transcript', 'transcript_path');
        $saveFile('cover_letter', 'cover_letter_path');

        $profile->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}