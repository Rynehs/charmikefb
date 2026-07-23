<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'amount_requested' => $this->amount_requested,
            'duration_days'    => $this->duration_days,
            'status'           => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'client'           => new ClientResource($this->whenLoaded('client')),
            'loan'             => new LoanResource($this->whenLoaded('loan')),
            'created_at'       => $this->created_at?->toDateTimeString(),
            'updated_at'       => $this->updated_at?->toDateTimeString(),
        ];
    }
}
