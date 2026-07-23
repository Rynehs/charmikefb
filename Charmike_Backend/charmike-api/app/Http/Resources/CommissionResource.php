<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'      => $this->id,
            'amount'  => $this->amount,
            'rate'    => $this->rate,
            'month'   => $this->month,
            'year'    => $this->year,
            'status'  => $this->status,
            'paid_at' => $this->paid_at?->toDateTimeString(),
            'agent'   => new AgentResource($this->whenLoaded('agent')),
            'loan'    => new LoanResource($this->whenLoaded('loan')),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
