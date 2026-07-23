<?php

namespace App\Http\Controllers;

use App\Http\Requests\Client\ClientRegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\ClientResource;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends ApiController
{
    public function __construct(private readonly AuthService $authService) {}

    // POST /api/admin/login
    public function adminLogin(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated(), 'admin');

        return $this->success([
            'token' => $result['token'],
            'user'  => new UserResource($result['user']),
        ], 'Admin logged in successfully');
    }

    // POST /api/agent/login
    public function agentLogin(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated(), 'agent');

        return $this->success([
            'token' => $result['token'],
            'user'  => new UserResource($result['user']),
        ], 'Agent logged in successfully');
    }

    // POST /api/client/register
    public function clientRegister(ClientRegisterRequest $request): JsonResponse
    {
        $result = $this->authService->registerClient($request->validated());

        return $this->created([
            'token'  => $result['token'],
            'user'   => new UserResource($result['user']),
            'client' => new ClientResource($result['client']),
        ], 'Client registered successfully');
    }

    // POST /api/client/login
    public function clientLogin(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated(), 'client');

        return $this->success([
            'token' => $result['token'],
            'user'  => new UserResource($result['user']),
        ], 'Client logged in successfully');
    }

    // POST /api/logout
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully');
    }
}
