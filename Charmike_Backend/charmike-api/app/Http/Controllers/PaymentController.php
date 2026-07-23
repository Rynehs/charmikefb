<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecordPaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Loan;
use App\Services\LoanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends ApiController
{
    public function __construct(private readonly LoanService $loanService) {}

    // POST /api/payments
    public function store(RecordPaymentRequest $request): JsonResponse
    {
        $loan = Loan::find($request->loan_id);

        if (! $loan) {
            return $this->notFound('Loan not found');
        }

        // Agents can only record payments for their own clients' loans
        $user = $request->user();
        if ($user->isAgent()) {
            $agent = $user->agent;
            if ($loan->agent_id !== $agent?->id) {
                return $this->error('Unauthorized to record payment on this loan', 403);
            }
        }

        $payment = $this->loanService->recordPayment(
            $loan,
            (float) $request->amount,
            $user->id,
            $request->reference
        );

        return $this->created(new PaymentResource($payment), 'Payment recorded successfully');
    }

    // GET /api/payments  (admin sees all; agent sees own; client sees own)
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = \App\Models\Payment::with('loan.client.user', 'recorder');

        if ($user->isAgent()) {
            $query->whereHas('loan', fn ($q) => $q->where('agent_id', $user->agent->id));
        } elseif ($user->isClient()) {
            $query->whereHas('loan', fn ($q) => $q->where('client_id', $user->client->id));
        }

        $payments = $query->latest()->paginate($request->per_page ?? 15);

        return $this->success([
            'payments' => PaymentResource::collection($payments->items()),
            'meta'     => [
                'current_page' => $payments->currentPage(),
                'last_page'    => $payments->lastPage(),
                'per_page'     => $payments->perPage(),
                'total'        => $payments->total(),
            ],
        ]);
    }
}
