<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Internship;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class FinalReportController extends Controller
{
    /**
     * Menampilkan halaman upload laporan akhir.
     */
    public function index()
    {
        $user = Auth::user();
        $activeInternship = $user->internships()->where('status', 'active')->first();

        return Inertia::render('FinalReport/Index', [
            'activeInternship' => $activeInternship,
        ]);
    }

    /**
     * Menyimpan file laporan akhir yang diunggah.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'final_report' => ['required', 'file', 'mimes:pdf', 'max:10240'], // PDF, maks 10MB
            'internship_id' => ['required', 'exists:internships,id'],
        ]);

        $internship = Internship::findOrFail($request->internship_id);

        // Otorisasi: Pastikan user yang mengunggah adalah pemilik magang
        if ($internship->user_id !== Auth::id()) {
            return back()->with('error', 'Anda tidak diizinkan melakukan aksi ini.');
        }

        // Simpan file laporan akhir
        if ($request->hasFile('final_report')) {
            // Hapus file lama jika ada
            if ($internship->final_report_path && Storage::disk('public')->exists($internship->final_report_path)) {
                Storage::disk('public')->delete($internship->final_report_path);
            }

            $path = $request->file('final_report')->store("final-reports/{$internship->user_id}", 'public');

            $internship->final_report_path = $path;
            $internship->final_report_status = 'submitted'; // Ubah status menjadi 'submitted'
            $internship->save();
        }

        return Redirect::route('final-report.index')->with('success', 'Laporan akhir berhasil diunggah.');
    }
}