<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\User;
use Illuminate\Database\Seeder;

class AgentSeeder extends Seeder
{
    public function run(): void
    {
        $agents = [
            ['full_name' => 'Alice Mwangi',  'phone' => '0711000001', 'email' => 'alice@example.com',  'code' => 'AG001'],
            ['full_name' => 'Brian Otieno',  'phone' => '0711000002', 'email' => 'brian@example.com',  'code' => 'AG002'],
            ['full_name' => 'Carol Njoroge', 'phone' => '0711000003', 'email' => 'carol@example.com', 'code' => 'AG003'],
        ];

        foreach ($agents as $data) {
            $user = User::firstOrCreate(
                ['phone' => $data['phone']],
                [
                    'full_name' => $data['full_name'],
                    'email'     => $data['email'],
                    'password'  => 'password123',
                    'role'      => 'agent',
                    'is_active' => true,
                ]
            );

            Agent::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'agent_code' => $data['code'],
                    'is_active'  => true,
                ]
            );
        }

        $this->command->info('3 agents seeded: AG001, AG002, AG003 / password=password123');
    }
}
