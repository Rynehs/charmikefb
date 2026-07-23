<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\ApiController;
use App\Http\Resources\CommissionResource;
use App\Http\Resources\LoanResource;
use App\Models\Commission;
use App\Models\Loan;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoanController extends ApiController
{
    public function __construct(private readonly ReportService $reportService) {}

    // GET /api/agent/loans
    public function index(Request $request): JsonResponse
    {
        $agent = $request->user()->agent;

        if (! $agent) {
            return $this->error('Agent profile not found', 404);
        }

        $loans = Loan::with('client.user')
            ->where('agent_id', $agent->id)
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success([
            'loans' => LoanResource::collection($loans->items()),
            'meta'  => [
                'current_page' => $loans->currentPage(),
                'last_page'    => $loans->lastPage(),
                'per_page'     => $loans->perPage(),
                'total'        => $loans->total(),
            ],
        ]);
    }

    // GET /api/agent/loans/{id}
    public function show(Request $request, string $id): JsonResponse
    {
        $agent = $request->user()->agent;
        $loan  = Loan::with('client.user', 'payments.recorder')->where('agent_id', $agent?->id)->find($id);

        if (! $loan) {
            return $this->notFound('Loan not found');
        }

        return $this->success(new LoanResource($loan));
    }

    // GET /api/agent/commissions
    public function commissions(Request $request): JsonResponse
    {
        $agent = $request->user()->agent;

        $commissions = Commission::with('loan.client.user')
            ->where('agent_id', $agent?->id)
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success([
            'commissions' => CommissionResource::collection($commissions->items()),
            'meta'        => [
                'current_page' => $commissions->currentPage(),
                'last_page'    => $commissions->lastPage(),
                'per_page'     => $commissions->perPage(),
                'total'        => $commissions->total(),
            ],
        ]);
    }

    // GET /api/agent/dashboard
    public function dashboard(Request $request): JsonResponse
    {
        $agent = $request->user()->agent;

        if (! $agent) {
            return $this->error('Agent profile not found', 404);
        }

        return $this->success($this->reportService->agentDashboard($agent));
    }
}
