<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClientProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'full_name' => ['sometimes', 'string', 'max:255'],
            'phone'     => ['sometimes', 'string', Rule::unique('users', 'phone')->ignore($userId)],
            'email'     => ['sometimes', 'nullable', 'email', Rule::unique('users', 'email')->ignore($userId)],
        ];
    }
}
