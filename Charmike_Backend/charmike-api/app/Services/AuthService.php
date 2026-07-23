<?php

namespace App\Services;

use App\Models\Agent;
use App\Models\Client;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(private readonly SmsService $smsService) {}

    public function login(array $credentials, string $role): array
    {
        $user = User::where('phone', $credentials['phone'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'phone' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->role !== $role) {
            throw ValidationException::withMessages([
                'phone' => ['Unauthorized for this role.'],
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'phone' => ['Your account has been deactivated.'],
            ]);
        }

        $token = $user->createToken("{$role}_token")->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function registerClient(array $data): array
    {
        $agent = Agent::where('agent_code', $data['agent_code'])
            ->where('is_active', true)
            ->first();

        if (! $agent) {
            throw ValidationException::withMessages([
                'agent_code' => ['The agent code is invalid or the agent is inactive.'],
            ]);
        }

        $user = User::create([
            'full_name' => $data['full_name'],
            'phone'     => $data['phone'],
            'email'     => $data['email'] ?? null,
            'password'  => $data['password'],
            'role'      => 'client',
        ]);

        $client = Client::create([
            'user_id'      => $user->id,
            'agent_id'     => $agent->id,
            'national_id'  => $data['national_id'],
            'credit_limit' => $data['credit_limit'] ?? 0,
        ]);

        $token = $user->createToken('client_token')->plainTextToken;

        // Notify the agent that a new client registered under them
        $agent->load('user');
        $this->smsService->newClientRegistered(
            $agent->user->phone,
            $agent->user->full_name,
            $user->full_name
        );

        return [
            'user'   => $user,
            'client' => $client->load('agent.user'),
            'token'  => $token,
        ];
    }
}
