<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class PresenceCheckInRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Memastikan user yang terotentikasi adalah user yang sama dengan internship
        // Otorisasi lebih detail bisa dilakukan di controller atau policy jika diperlukan
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo' => 'required|image|max:5120', // Foto wajib, format gambar, maks 5MB
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ];
    }

    /**
     * Custom message for validation
     *
     * @return array
     */
    public function messages()
    {
        return [
            'photo.required' => 'Foto wajib dilampirkan untuk presensi.',
            'photo.image' => 'File yang diunggah harus berupa gambar.',
            'latitude.required' => 'Lokasi (latitude) tidak terdeteksi. Pastikan GPS Anda aktif.',
            'longitude.required' => 'Lokasi (longitude) tidak terdeteksi. Pastikan GPS Anda aktif.',
        ];
    }
}

