<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@pertamina.com',
            'password' => Hash::make('password123'), // Ganti dengan password yang kuat
        ]);
        $superAdmin->assignRole('super_admin');
    }
}