<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'national_id'  => $this->national_id,
            'credit_limit' => $this->credit_limit,
            'user'         => new UserResource($this->whenLoaded('user')),
            'agent'        => new AgentResource($this->whenLoaded('agent')),
            'loans'        => LoanResource::collection($this->whenLoaded('loans')),
            'created_at'   => $this->created_at?->toDateTimeString(),
        ];
    }
}