<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\ApiController;
use App\Http\Requests\Client\UpdateClientProfileRequest;
use App\Http\Resources\ClientResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends ApiController
{
    // GET /api/client/profile
    public function show(Request $request): JsonResponse
    {
        $client = $request->user()->client()->with('user', 'agent.user')->first();

        if (! $client) {
            return $this->notFound('Client profile not found');
        }

        return $this->success(new ClientResource($client));
    }

    // PUT /api/client/profile
    public function update(UpdateClientProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update($request->only('full_name', 'phone', 'email'));

        $client = $user->client()->with('user', 'agent.user')->first();

        return $this->success(new ClientResource($client), 'Profile updated successfully');
    }
}
