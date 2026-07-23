<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiController;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends ApiController
{
    // GET /api/admin/clients
    public function index(Request $request): JsonResponse
    {
        $clients = Client::with('user', 'agent.user')
            ->when($request->agent_id, fn ($q) => $q->where('agent_id', $request->agent_id))
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

    // GET /api/admin/clients/{id}
    public function show(string $id): JsonResponse
    {
        $client = Client::with('user', 'agent.user', 'loans')->find($id);

        if (! $client) {
            return $this->notFound('Client not found');
        }

        return $this->success(new ClientResource($client));
    }
}
