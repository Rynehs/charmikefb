<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class LoanApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount_requested' => ['required', 'numeric', 'min:1'],
            'duration_days'    => ['required', 'integer', 'min:1', 'max:365'],
        ];
    }
}
