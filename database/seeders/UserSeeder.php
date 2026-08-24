<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        $users = [
            [
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'admin@gmail.com',
                'role' => 'admin',
            ],
            [
                'name' => 'Sekdes',
                'username' => 'sekdes',
                'email' => 'sekdes@gmail.com',
                'role' => 'sekdes',
            ],
            [
                'name' => 'Kades',
                'username' => 'kades',
                'email' => 'kades@gmail.com',
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
