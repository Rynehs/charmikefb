<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAgentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $agentId = $this->route('agent');
        $agent   = \App\Models\Agent::find($agentId);
        $userId  = $agent?->user_id;

        return [
            'full_name' => ['sometimes', 'string', 'max:255'],
            'phone'     => ['sometimes', 'string', Rule::unique('users', 'phone')->ignore($userId)],
            'email'     => ['sometimes', 'nullable', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'password'  => ['sometimes', 'string', 'min:8'],
        ];
    }
}
