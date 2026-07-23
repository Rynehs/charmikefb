<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class ClientRegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name'   => ['required', 'string', 'max:255'],
            'phone'       => ['required', 'string', 'unique:users,phone'],
            'email'       => ['nullable', 'email', 'unique:users,email'],
            'password'    => ['required', 'string', 'min:8', 'confirmed'],
            'national_id' => ['required', 'string', 'unique:clients,national_id'],
            'agent_code'  => ['required', 'string'],
            'credit_limit' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
