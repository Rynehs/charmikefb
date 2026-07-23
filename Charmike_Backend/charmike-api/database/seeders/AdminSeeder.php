<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['phone' => '0700000000'],
            [
                'full_name' => 'System Admin',
                'email'     => 'admin@example.com',
                'password'  => 'password123',
                'role'      => 'admin',
                'is_active' => true,
            ]
        );

        $this->command->info('Admin seeded: phone=0700000000 / password=password123');
    }
}
