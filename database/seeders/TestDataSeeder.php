<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Internship;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat user Supervisor
        $supervisor = User::create([
            'name' => 'Dr. Budi Waskito',
            'email' => 'supervisor@test.com',
            'password' => Hash::make('password'),
        ]);
        $supervisor->assignRole('supervisor');

        // 2. Buat user Intern (Peserta Magang)
        $intern = User::create([
            'name' => 'Andi Pratama',
            'email' => 'intern@test.com',
            'password' => Hash::make('password'),
        ]);
        $intern->assignRole('intern');

        // 3. Buat profil kosong untuk intern
        Profile::create([
            'user_id' => $intern->id,
        ]);

        // 4. Buat data magang aktif untuk intern tersebut
        Internship::create([
            'user_id' => $intern->id,
            'supervisor_id' => $supervisor->id,
            'start_date' => now()->subMonth(),
            'end_date' => now()->addMonths(2),
            // 'field' => 'Teknik Informatika', // <-- HAPUS BARIS INI
            'status' => 'active',
        ]);
    }
}