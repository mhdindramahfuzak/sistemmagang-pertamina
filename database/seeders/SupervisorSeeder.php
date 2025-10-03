<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SupervisorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $supervisor = User::create([
            'name' => 'Supervisor Pertamina',
            'email' => 'supervisor@pertamina.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $supervisor->assignRole('supervisor');
    }
}