<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\ApiController;
use App\Http\Requests\Client\LoanApplicationRequest;
use App\Http\Resources\LoanApplicationResource;
use App\Http\Resources\LoanResource;
use App\Models\Loan;
use App\Services\LoanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoanController extends ApiController
{
    public function __construct(private readonly LoanService $loanService) {}

    // POST /api/client/loans
    public function store(LoanApplicationRequest $request): JsonResponse
    {
        $client      = $request->user()->client;

        if (! $client) {
            return $this->error('Client profile not found', 404);
        }

        $application = $this->loanService->applyForLoan($client, $request->validated());

        return $this->created(new LoanApplicationResource($application->load('client.user')), 'Loan application submitted successfully');
    }

    // GET /api/client/loans  (applications + active loans)
    public function index(Request $request): JsonResponse
    {
        $client = $request->user()->client;

        if (! $client) {
            return $this->error('Client profile not found', 404);
        }

        $applications = $client->loanApplications()
            ->with('loan')
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success([
            'applications' => LoanApplicationResource::collection($applications->items()),
            'meta'         => [
                'current_page' => $applications->currentPage(),
                'last_page'    => $applications->lastPage(),
                'per_page'     => $applications->perPage(),
                'total'        => $applications->total(),
            ],
        ]);
    }

    // GET /api/client/loans/{id}
    public function show(Request $request, string $id): JsonResponse
    {
        $client = $request->user()->client;
        $loan   = Loan::with('payments', 'commission')->where('client_id', $client?->id)->find($id);

        if (! $loan) {
            return $this->notFound('Loan not found');
        }

        return $this->success(new LoanResource($loan));
    }

    // GET /api/client/loans/active
    public function active(Request $request): JsonResponse
    {
        $client = $request->user()->client;

        $loans = Loan::with('payments')
            ->where('client_id', $client?->id)
            ->whereIn('status', ['approved', 'active'])
            ->get();

        return $this->success(LoanResource::collection($loans));
    }
}
