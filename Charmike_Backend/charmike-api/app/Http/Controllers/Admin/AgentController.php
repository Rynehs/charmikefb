<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiController;
use App\Http\Requests\Admin\CreateAgentRequest;
use App\Http\Requests\Admin\UpdateAgentRequest;
use App\Http\Resources\AgentResource;
use App\Models\Agent;
use App\Services\AgentService;
use Illuminate\Http\JsonResponse;

class AgentController extends ApiController
{
    public function __construct(private readonly AgentService $agentService) {}

    // GET /api/admin/agents
    public function index(): JsonResponse
    {
        $agents = $this->agentService->listAgents();

        return $this->success([
            'agents' => AgentResource::collection($agents->items()),
            'meta'   => [
                'current_page' => $agents->currentPage(),
                'last_page'    => $agents->lastPage(),
                'per_page'     => $agents->perPage(),
                'total'        => $agents->total(),
            ],
        ]);
    }

    // POST /api/admin/agents
    public function store(CreateAgentRequest $request): JsonResponse
    {
        $agent = $this->agentService->createAgent($request->validated());

        return $this->created(new AgentResource($agent), 'Agent created successfully');
    }

    // GET /api/admin/agents/{id}
    public function show(string $id): JsonResponse
    {
        $agent = Agent::with('user')->withCount('clients', 'loans')->find($id);

        if (! $agent) {
            return $this->notFound('Agent not found');
        }

        return $this->success(new AgentResource($agent));
    }

    // PUT /api/admin/agents/{id}
    public function update(UpdateAgentRequest $request, string $id): JsonResponse
    {
        $agent = Agent::with('user')->find($id);

        if (! $agent) {
            return $this->notFound('Agent not found');
        }

        $agent = $this->agentService->updateAgent($agent, $request->validated());

        return $this->success(new AgentResource($agent), 'Agent updated successfully');
    }

    // PATCH /api/admin/agents/{id}/activate
    public function activate(string $id): JsonResponse
    {
        $agent = Agent::with('user')->find($id);

        if (! $agent) {
            return $this->notFound('Agent not found');
        }

        $agent->update(['is_active' => true]);
        $agent->user->update(['is_active' => true]);

        return $this->success(new AgentResource($agent), 'Agent activated');
    }

    // PATCH /api/admin/agents/{id}/deactivate
    public function deactivate(string $id): JsonResponse
    {
        $agent = Agent::with('user')->find($id);

        if (! $agent) {
            return $this->notFound('Agent not found');
        }

        $agent->update(['is_active' => false]);
        $agent->user->update(['is_active' => false]);

        return $this->success(new AgentResource($agent), 'Agent deactivated');
    }

    // DELETE /api/admin/agents/{id}
    public function destroy(string $id): JsonResponse
    {
        $agent = Agent::find($id);

        if (! $agent) {
            return $this->notFound('Agent not found');
        }

        if ($agent->clients()->exists()) {
            return $this->error('Cannot delete agent with existing clients', 422);
        }

        $agent->user->delete(); // cascades to agent

        return $this->success(null, 'Agent deleted successfully');
    }
}
