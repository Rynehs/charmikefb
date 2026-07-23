<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $agent1 = Agent::where('agent_code', 'AG001')->first();
        $agent2 = Agent::where('agent_code', 'AG002')->first();

        $clients = [
            ['full_name' => 'David Kamau',   'phone' => '0722000001', 'national_id' => 'ID001001', 'agent' => $agent1, 'credit_limit' => 50000],
            ['full_name' => 'Emily Wambui',  'phone' => '0722000002', 'national_id' => 'ID001002', 'agent' => $agent1, 'credit_limit' => 30000],
            ['full_name' => 'Francis Odhiambo', 'phone' => '0722000003', 'national_id' => 'ID001003', 'agent' => $agent2, 'credit_limit' => 40000],
            ['full_name' => 'Grace Wanjiku',  'phone' => '0722000004', 'national_id' => 'ID001004', 'agent' => $agent2, 'credit_limit' => 20000],
        ];

        foreach ($clients as $data) {
            if (! $data['agent']) {
                continue;
            }

            $user = User::firstOrCreate(
                ['phone' => $data['phone']],
                [
                    'full_name' => $data['full_name'],
                    'password'  => 'password123',
                    'role'      => 'client',
                    'is_active' => true,
                ]
            );

            Client::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'agent_id'    => $data['agent']->id,
                    'national_id' => $data['national_id'],
                    'credit_limit' => $data['credit_limit'],
                ]
            );
        }

        $this->command->info('4 clients seeded / password=password123');
    }
}
