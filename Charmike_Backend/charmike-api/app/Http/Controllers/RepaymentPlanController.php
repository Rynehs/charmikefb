<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class RepaymentPlanController extends ApiController
{
    // GET /api/repayment-plans
    public function index(): JsonResponse
    {
        $setting = Setting::where('key', 'repayment_plans')->first();
        $plans = $setting ? json_decode($setting->value, true) : [];

        return $this->success($plans);
    }
}