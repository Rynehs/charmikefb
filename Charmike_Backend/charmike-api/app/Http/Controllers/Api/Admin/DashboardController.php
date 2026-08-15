<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\Client;
use App\Models\Loan;
use App\Models\Payment;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index()
    {
        $statistics = Cache::remember('admin_dashboard_stats', 60, function () {
            return [
                'clients'           => Client::count(),
                'agents'            => Agent::where('is_active', true)->count(),
                'active_loans'      => Loan::where('status', 'active')->count(),
                'pending_loans'     => Loan::where('status', 'pending')->count(),
                'total_disbursed'   => (float) Loan::sum('principal'),
                'outstanding_balance' => (float) Loan::sum('balance'),
                'amount_collected'  => (float) Loan::sum('amount_paid'),
                'payments_today'    => (float) Payment::whereDate('payment_date', today())->sum('amount'),
            ];
        });

        $recentLoans = Loan::select([
                'id', 'client_id', 'agent_id', 'principal',
                'balance', 'status', 'created_at',
            ])
            ->with([
                'client' => function ($q) {
                    $q->select('id', 'user_id');
                },
                'client.user' => function ($q) {
                    $q->select('id', 'full_name');
                },
                'agent' => function ($q) {
                    $q->select('id', 'user_id');
                },
                'agent.user' => function ($q) {
                    $q->select('id', 'full_name');
                },
            ])
            ->latest()
            ->take(5)
            ->get();

        $recentPayments = Payment::select([
                'id', 'loan_id', 'amount',
                'payment_date', 'recorded_by',
            ])
            ->with([
                'loan' => function ($q) {
                    $q->select('id', 'client_id');
                },
                'loan.client' => function ($q) {
                    $q->select('id', 'user_id');
                },
                'loan.client.user' => function ($q) {
                    $q->select('id', 'full_name');
                },
                'recorder' => function ($q) {
                    $q->select('id', 'full_name');
                },
            ])
            ->latest('payment_date')   // use payment_date since you index it
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'statistics'      => $statistics,
                'recent_loans'    => $recentLoans,
                'recent_payments' => $recentPayments,
            ],
        ]);
    }
}