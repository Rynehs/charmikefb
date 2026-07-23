<?php

namespace App\Services;

use App\Models\Agent;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class AgentService
{
    /**
     * Create a new agent with auto-generated agent code.
     */
    public function createAgent(array $data): Agent
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'full_name' => $data['full_name'],
                'phone'     => $data['phone'],
                'email'     => $data['email'] ?? null,
                'password'  => $data['password'],
                'role'      => 'agent',
            ]);

            $agentCode = $this->generateAgentCode();

            $agent = Agent::create([
                'user_id'    => $user->id,
                'agent_code' => $agentCode,
                'is_active'  => true,
            ]);

            return $agent->load('user');
        });
    }

    /**
     * Update agent details.
     */
    public function updateAgent(Agent $agent, array $data): Agent
    {
        return DB::transaction(function () use ($agent, $data) {
            $userFields = array_filter([
                'full_name' => $data['full_name'] ?? null,
                'phone'     => $data['phone'] ?? null,
                'email'     => $data['email'] ?? null,
            ]);

            if (! empty($userFields)) {
                $agent->user->update($userFields);
            }

            if (isset($data['password'])) {
                $agent->user->update(['password' => $data['password']]);
            }

            return $agent->fresh('user');
        });
    }

    /**
     * Generate a unique agent code like AG001, AG002, etc.
     */
    private function generateAgentCode(): string
    {
        $last = Agent::orderByDesc('created_at')->lockForUpdate()->first();

        if (! $last) {
            return 'AG001';
        }

        $lastNumber = (int) substr($last->agent_code, 2);
        $next = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);

        return "AG{$next}";
    }

    public function listAgents(int $perPage = 15): LengthAwarePaginator
    {
        return Agent::with('user')
            ->withCount('clients', 'loans')
            ->paginate($perPage);
    }
}
