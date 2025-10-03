<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use App\Models\Internship;
use Illuminate\Support\Facades\Hash;

class InternSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil supervisor pertama yang ditemukan untuk menjadi pembimbing
        $supervisor = User::role('supervisor')->first();

        $intern = User::create([
            'name' => 'Mahasiswa Magang',
            'email' => 'intern@pertamina.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $intern->assignRole('intern');

        // Buat data profil untuk intern
        Profile::create([
            'user_id' => $intern->id,
            'nim' => '1234567890',
            'jurusan' => 'Teknik Perminyakan',
            'kampus' => 'Universitas Riau',
            'kontak' => '08123456789',
            'verified_at' => now(),
        ]);

        // Buat data magang untuk intern
        if ($supervisor) {
            Internship::create([
                'user_id' => $intern->id,
                'supervisor_id' => $supervisor->id,
                'unit' => 'Refinery Unit II',
                'start_date' => now()->startOfMonth(),
                'end_date' => now()->addMonths(3)->endOfMonth(),
                'status' => 'active',
            ]);
        }
    }
}