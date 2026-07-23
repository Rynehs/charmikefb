<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'amount'       => $this->amount,
            'payment_date' => $this->payment_date?->toDateString(),
            'reference'    => $this->reference,
            'notes'        => $this->notes,
            'recorded_by'  => new UserResource($this->whenLoaded('recorder')),
            'loan'         => new LoanResource($this->whenLoaded('loan')),
            'created_at'   => $this->created_at?->toDateTimeString(),
        ];
    }
}
