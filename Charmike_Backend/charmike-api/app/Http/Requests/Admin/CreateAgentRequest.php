<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateAgentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'phone'     => ['required', 'string', 'unique:users,phone'],
            'email'     => ['nullable', 'email', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:8'],
        ];
    }
}
