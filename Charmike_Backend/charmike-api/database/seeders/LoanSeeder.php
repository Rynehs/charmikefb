<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Commission;
use App\Models\Loan;
use App\Models\LoanApplication;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class LoanSeeder extends Seeder
{
    public function run(): void
    {
        $admin   = User::where('role', 'admin')->first();
        $clients = Client::with('agent')->get();

        if ($clients->isEmpty()) {
            $this->command->warn('No clients found. Run ClientSeeder first.');
            return;
        }

        $commissionRate = (float) Setting::get('commission_rate', 2);

        // Client 1 → completed loan
        $client1 = $clients->get(0);
        $this->createLoan($client1, 10000, 30, 20, 'completed', $commissionRate, $admin->id, '-60 days', '-30 days');

        // Client 2 → active loan
        $client2 = $clients->get(1);
        if ($client2) {
            $loan = $this->createLoan($client2, 15000, 30, 20, 'active', $commissionRate, $admin->id, '-20 days', '-15 days');
            // Partial payment
            $this->addPayment($loan, 3000, $admin->id, '-5 days');
        }

        // Client 3 → pending application
        $client3 = $clients->get(2);
        if ($client3) {
            LoanApplication::create([
                'client_id'        => $client3->id,
                'amount_requested' => 20000,
                'duration_days'    => 45,
                'status'           => 'pending',
            ]);
        }

        // Client 4 → rejected application
        $client4 = $clients->get(3);
        if ($client4) {
            LoanApplication::create([
                'client_id'        => $client4->id,
                'amount_requested' => 50000,
                'duration_days'    => 90,
                'status'           => 'rejected',
                'rejection_reason' => 'Amount exceeds credit limit.',
            ]);
        }

        $this->command->info('Sample loans, applications, and payments seeded.');
    }

    private function createLoan(
        Client $client,
        float $principal,
        int $durationDays,
        float $interestRate,
        string $status,
        float $commissionRate,
        string $adminId,
        string $approvedOffset,
        string $disbursedOffset
    ): Loan {
        $interestAmount = round($principal * ($interestRate / 100), 2);
        $totalDue       = $principal + $interestAmount;
        $approvedAt     = Carbon::parse($approvedOffset);
        $disbursedAt    = Carbon::parse($disbursedOffset);
        $dueDate        = $disbursedAt->copy()->addDays($durationDays);

        $application = LoanApplication::create([
            'client_id'        => $client->id,
            'amount_requested' => $principal,
            'duration_days'    => $durationDays,
            'status'           => 'approved',
        ]);

        $amountPaid = $status === 'completed' ? $totalDue : 0;
        $balance    = $totalDue - $amountPaid;

        $loan = Loan::create([
            'client_id'           => $client->id,
            'agent_id'            => $client->agent_id,
            'loan_application_id' => $application->id,
            'principal'           => $principal,
            'interest_rate'       => $interestRate,
            'interest_amount'     => $interestAmount,
            'total_due'           => $totalDue,
            'amount_paid'         => $amountPaid,
            'balance'             => $balance,
            'status'              => $status,
            'disbursement_reference' => 'SEED-' . strtoupper(uniqid()),
            'approved_at'         => $approvedAt,
            'disbursed_at'        => $disbursedAt,
            'due_date'            => $dueDate->toDateString(),
        ]);

        Commission::create([
            'agent_id' => $client->agent_id,
            'loan_id'  => $loan->id,
            'amount'   => round($principal * ($commissionRate / 100), 2),
            'rate'     => $commissionRate,
            'month'    => $approvedAt->month,
            'year'     => $approvedAt->year,
            'status'   => $status === 'completed' ? 'paid' : 'pending',
        ]);

        if ($status === 'completed') {
            $this->addPayment($loan, $totalDue, $adminId, $disbursedOffset . ' +15 days');
        }

        return $loan;
    }

    private function addPayment(Loan $loan, float $amount, string $recordedBy, string $dateOffset): Payment
    {
        return Payment::create([
            'loan_id'      => $loan->id,
            'amount'       => $amount,
            'payment_date' => Carbon::parse($dateOffset)->toDateString(),
            'recorded_by'  => $recordedBy,
            'reference'    => 'PAY-' . strtoupper(uniqid()),
        ]);
    }
}
