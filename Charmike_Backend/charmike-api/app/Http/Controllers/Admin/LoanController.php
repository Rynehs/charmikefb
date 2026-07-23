<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiController;
use App\Http\Requests\Admin\ApproveLoanRequest;
use App\Http\Requests\Admin\DisburseLoanRequest;
use App\Http\Requests\Admin\RejectLoanRequest;
use App\Http\Resources\LoanApplicationResource;
use App\Http\Resources\LoanResource;
use App\Models\Loan;
use App\Models\LoanApplication;
use App\Services\LoanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoanController extends ApiController
{
    public function __construct(private readonly LoanService $loanService) {}

    // GET /api/admin/loans
    public function index(Request $request): JsonResponse
    {
        $loans = Loan::with('client.user', 'agent.user')
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->when($request->agent_id, fn ($q) => $q->where('agent_id', $request->agent_id))
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

    // GET /api/admin/loans/pending
    public function pending(Request $request): JsonResponse
    {
        $applications = LoanApplication::with('client.user', 'client.agent.user')
            ->where('status', 'pending')
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

    // GET /api/admin/loans/{id}
    public function show(string $id): JsonResponse
    {
        $loan = Loan::with('client.user', 'agent.user', 'payments.recorder', 'commission', 'loanApplication')->find($id);

        if (! $loan) {
            return $this->notFound('Loan not found');
        }

        return $this->success(new LoanResource($loan));
    }

    // POST /api/admin/loans/{id}/approve
    public function approve(ApproveLoanRequest $request, string $id): JsonResponse
    {
        $application = LoanApplication::with('client')->find($id);

        if (! $application) {
            return $this->notFound('Loan application not found');
        }

        $loan = $this->loanService->approveLoan($application, (float) $request->interest_rate);

        return $this->success(new LoanResource($loan), 'Loan approved successfully');
    }

    // POST /api/admin/loans/{id}/reject
    public function reject(RejectLoanRequest $request, string $id): JsonResponse
    {
        $application = LoanApplication::find($id);

        if (! $application) {
            return $this->notFound('Loan application not found');
        }

        $application = $this->loanService->rejectLoan($application, $request->reason);

        return $this->success(new LoanApplicationResource($application), 'Loan application rejected');
    }

    // POST /api/admin/loans/{id}/disburse
    public function disburse(DisburseLoanRequest $request, string $id): JsonResponse
    {
        $loan = Loan::find($id);

        if (! $loan) {
            return $this->notFound('Loan not found');
        }

        $loan = $this->loanService->disburseLoan($loan, $request->reference);

        return $this->success(new LoanResource($loan), 'Loan disbursed successfully');
    }
}
