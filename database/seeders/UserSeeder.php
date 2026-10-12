<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password$123');

        $users = [
            [
                'name' => 'Jejen Muhammad H, S.Pd.',
                'username' => 'jejen',
                'email' => 'jejenmuhammad@gmail.com',
                'role' => 'admin',
            ],
            [
                'name' => 'Usup Supriadi, S.T.',
                'username' => 'usupsupriadi',
                'email' => 'usupsupriadi@gmail.com',
                'role' => 'sekdes',
            ],
            [
                'name' => 'Dani Herdiana',
                'username' => 'daniherdiana',
                'email' => 'daniherdiana@gmail.com',
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
