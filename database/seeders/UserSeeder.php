<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('admin123');

        $users = [
            [
                'name' => 'Misbah',
                'username' => 'misbah',
                'email' => 'misbah@e-arsip.local',
                'role' => 'admin',
            ],
            [
                'name' => 'Azki',
                'username' => 'azki',
                'email' => 'azki@e-arsip.local',
                'role' => 'sekdes',
            ],
            [
                'name' => 'Patmawati',
                'username' => 'patmawati',
                'email' => 'patmawati@e-arsip.local',
                'role' => 'kades',
            ],
        ];

        foreach ($users as $data) {
            User::query()->updateOrCreate(
                ['username' => $data['username']],
                [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => $password,
                    'role' => $data['role'],
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}
