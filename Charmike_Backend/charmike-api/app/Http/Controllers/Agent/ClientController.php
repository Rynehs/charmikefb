<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\ApiController;
use App\Http\Resources\ClientResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends ApiController
{
    // GET /api/agent/clients  — only the authenticated agent's clients
    public function index(Request $request): JsonResponse
    {
        $agent = $request->user()->agent;

        if (! $agent) {
            return $this->error('Agent profile not found', 404);
        }

        $clients = $agent->clients()
            ->with('user')
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('user', fn ($u) => $u->where('full_name', 'ilike', "%{$request->search}%")
                    ->orWhere('phone', 'ilike', "%{$request->search}%"));
            })
            ->paginate($request->per_page ?? 15);

        return $this->success([
            'clients' => ClientResource::collection($clients->items()),
            'meta'    => [
                'current_page' => $clients->currentPage(),
                'last_page'    => $clients->lastPage(),
                'per_page'     => $clients->perPage(),
                'total'        => $clients->total(),
            ],
        ]);
    }

    // GET /api/agent/clients/{id}
    public function show(Request $request, string $id): JsonResponse
    {
        $agent  = $request->user()->agent;
        $client = $agent?->clients()->with('user', 'loans')->find($id);

        if (! $client) {
            return $this->notFound('Client not found');
        }

        return $this->success(new ClientResource($client));
    }
}
