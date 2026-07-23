<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                      => $this->id,
            'principal'               => $this->principal,
            'interest_rate'           => $this->interest_rate,
            'interest_amount'         => $this->interest_amount,
            'total_due'               => $this->total_due,
            'amount_paid'             => $this->amount_paid,
            'balance'                 => $this->balance,
            'status'                  => $this->status,
            'disbursement_reference'  => $this->disbursement_reference,
            'approved_at'             => $this->approved_at?->toDateTimeString(),
            'disbursed_at'            => $this->disbursed_at?->toDateTimeString(),
            'due_date'                => $this->due_date?->toDateString(),
            'client'                  => new ClientResource($this->whenLoaded('client')),
            'agent'                   => new AgentResource($this->whenLoaded('agent')),
            'payments'                => PaymentResource::collection($this->whenLoaded('payments')),
            'commission'              => new CommissionResource($this->whenLoaded('commission')),
            'created_at'              => $this->created_at?->toDateTimeString(),
        ];
    }
}
