<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'agent_code'   => $this->agent_code,
            'is_active'    => $this->is_active,
            'user'         => new UserResource($this->whenLoaded('user')),
            'clients_count' => $this->when(isset($this->clients_count), $this->clients_count),
            'loans_count'  => $this->when(isset($this->loans_count), $this->loans_count),
            'created_at'   => $this->created_at?->toDateTimeString(),
        ];
    }
}
