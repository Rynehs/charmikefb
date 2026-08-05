<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\Client;
use App\Models\Loan;
use App\Models\Payment;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            "success" => true,

            "data" => [

               'statistics' => [

    'clients' => Client::count(),

    'agents' => Agent::where('is_active', true)->count(),

    'active_loans' => Loan::where('status', 'active')->count(),

    'pending_loans' => Loan::where('status', 'pending')->count(),

    'total_disbursed' => Loan::sum('principal'),

    'outstanding_balance' => Loan::sum('balance'),

    'amount_collected' => Loan::sum('amount_paid'),

    'payments_today' => Payment::whereDate(
        'payment_date',
        today()
    )->sum('amount'),
    

],

                'recent_loans' => Loan::select([
        'id',
        'client_id',
        'agent_id',
        'principal',
        'balance',
        'status',
        'created_at',
    ])
    ->with([
        'client.user:id,full_name',
        'agent.user:id,full_name',
    ])
    ->latest()
    ->take(5)
    ->get(),

                'recent_payments' => Payment::select([
        'id',
        'loan_id',
        'amount',
        'payment_date',
        'recorded_by',
    ])
    ->with([
        'loan.client.user:id,full_name',
        'recorder:id,full_name',
    ])
    ->latest()
    ->take(5)
    ->get(),
            ]

        ]);
    }
}