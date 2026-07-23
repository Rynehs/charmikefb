<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiController;
use App\Http\Resources\CommissionResource;
use App\Models\Commission;
use App\Models\Setting;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends ApiController
{
    public function __construct(private readonly ReportService $reportService) {}

    // GET /api/admin/reports/dashboard
    public function dashboard(): JsonResponse
    {
        return $this->success($this->reportService->adminDashboard());
    }

    // GET /api/admin/reports/commissions
    public function commissions(Request $request): JsonResponse
    {
        $commissions = Commission::with('agent.user', 'loan.client.user')
            ->when($request->agent_id, fn ($q) => $q->where('agent_id', $request->agent_id))
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->when($request->month, fn ($q) => $q->where('month', $request->month))
            ->when($request->year, fn ($q) => $q->where('year', $request->year))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success([
            'commissions' => CommissionResource::collection($commissions->items()),
            'meta'        => [
                'current_page' => $commissions->currentPage(),
                'last_page'    => $commissions->lastPage(),
                'per_page'     => $commissions->perPage(),
                'total'        => $commissions->total(),
            ],
        ]);
    }

    // GET /api/admin/settings
    public function settings(): JsonResponse
    {
        $settings = Setting::all()->keyBy('key')->map(fn ($s) => $s->value);

        return $this->success($settings);
    }

    // PUT /api/admin/settings
    public function updateSettings(Request $request): JsonResponse
    {
        $request->validate([
            'settings'         => ['required', 'array'],
            'settings.*.key'   => ['required', 'string', 'exists:settings,key'],
            'settings.*.value' => ['required', 'string'],
        ]);

        foreach ($request->settings as $item) {
            Setting::set($item['key'], $item['value']);
        }

        return $this->success(null, 'Settings updated successfully');
    }
}
