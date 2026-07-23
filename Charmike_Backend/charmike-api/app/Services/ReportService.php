<?php

namespace App\Services;

use App\Models\Agent;
use App\Models\Client;
use App\Models\Commission;
use App\Models\Loan;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function adminDashboard(): array
    {
        $loans = Loan::selectRaw('
            COUNT(*) as total_loans,
            SUM(CASE WHEN status = \'active\' THEN 1 ELSE 0 END) as active_loans,
            SUM(CASE WHEN status = \'completed\' THEN 1 ELSE 0 END) as completed_loans,
            SUM(CASE WHEN status = \'defaulted\' THEN 1 ELSE 0 END) as defaulted_loans,
            COALESCE(SUM(principal), 0) as total_principal_disbursed,
            COALESCE(SUM(amount_paid), 0) as total_repayments_collected,
            COALESCE(SUM(balance), 0) as outstanding_balance
        ')->first();

        $totalCommissions = Commission::sum('amount');

        return [
            'total_clients'              => Client::count(),
            'total_agents'               => Agent::count(),
            'total_loans'                => (int) $loans->total_loans,
            'active_loans'               => (int) $loans->active_loans,
            'completed_loans'            => (int) $loans->completed_loans,
            'defaulted_loans'            => (int) $loans->defaulted_loans,
            'total_principal_disbursed'  => round((float) $loans->total_principal_disbursed, 2),
            'total_repayments_collected' => round((float) $loans->total_repayments_collected, 2),
            'outstanding_balance'        => round((float) $loans->outstanding_balance, 2),
            'total_commissions'          => round((float) $totalCommissions, 2),
        ];
    }

    public function agentDashboard(Agent $agent): array
    {
        $loans = Loan::where('agent_id', $agent->id)
            ->selectRaw('
                COUNT(*) as total_loans,
                SUM(CASE WHEN status = \'active\' THEN 1 ELSE 0 END) as active_loans,
                COALESCE(SUM(principal), 0) as total_portfolio_value,
                COALESCE(SUM(amount_paid), 0) as total_collections
            ')
            ->first();

        $earnedCommissions = Commission::where('agent_id', $agent->id)->sum('amount');
        $paidCommissions   = Commission::where('agent_id', $agent->id)->where('status', 'paid')->sum('amount');

        return [
            'total_clients'       => $agent->clients()->count(),
            'total_loans'         => (int) $loans->total_loans,
            'active_loans'        => (int) $loans->active_loans,
            'total_portfolio_value' => round((float) $loans->total_portfolio_value, 2),
            'total_collections'   => round((float) $loans->total_collections, 2),
            'earned_commissions'  => round((float) $earnedCommissions, 2),
            'paid_commissions'    => round((float) $paidCommissions, 2),
            'pending_commissions' => round((float) ($earnedCommissions - $paidCommissions), 2),
        ];
    }
}
