<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Commission;
use App\Models\Loan;
use App\Models\LoanApplication;
use App\Models\Payment;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LoanService
{
    public function __construct(private readonly SmsService $smsService) {}

    public function applyForLoan(Client $client, array $data): LoanApplication
    {
        if ($client->hasActiveLoan()) {
            throw ValidationException::withMessages([
                'loan' => ['You already have an active loan. Please repay it before applying for a new one.'],
            ]);
        }

        $application = LoanApplication::create([
            'client_id'        => $client->id,
            'amount_requested' => $data['amount_requested'],
            'duration_days'    => $data['duration_days'],
            'status'           => 'pending',
        ]);

        $this->smsService->loanApplicationReceived(
            $client->user->phone,
            $client->user->full_name,
            (float) $data['amount_requested']
        );

        return $application;
    }

    public function approveLoan(LoanApplication $application, float $interestRate): Loan
    {
        if ($application->status !== 'pending') {
            throw ValidationException::withMessages([
                'application' => ['This loan application has already been processed.'],
            ]);
        }

        $client = $application->client;

        if ($client->hasActiveLoan()) {
            throw ValidationException::withMessages([
                'client' => ['Client already has an active loan.'],
            ]);
        }

        return DB::transaction(function () use ($application, $interestRate, $client) {
            $principal      = (float) $application->amount_requested;
            $interestAmount = round($principal * ($interestRate / 100), 2);
            $totalDue       = round($principal + $interestAmount, 2);
            $durationDays   = $application->duration_days;
            $dueDate        = Carbon::now()->addDays($durationDays)->toDateString();

            $application->update(['status' => 'approved']);

            $loan = Loan::create([
                'client_id'           => $client->id,
                'agent_id'            => $client->agent_id,
                'loan_application_id' => $application->id,
                'principal'           => $principal,
                'interest_rate'       => $interestRate,
                'interest_amount'     => $interestAmount,
                'total_due'           => $totalDue,
                'amount_paid'         => 0,
                'balance'             => $totalDue,
                'status'              => 'approved',
                'approved_at'         => now(),
                'due_date'            => $dueDate,
            ]);

            $this->createCommission($loan);

            $this->smsService->loanApproved(
                $client->user->phone,
                $client->user->full_name,
                $principal,
                $dueDate
            );

            return $loan->load('client.user', 'agent.user');
        });
    }

    public function rejectLoan(LoanApplication $application, string $reason): LoanApplication
    {
        if ($application->status !== 'pending') {
            throw ValidationException::withMessages([
                'application' => ['This loan application has already been processed.'],
            ]);
        }

        $application->update([
            'status'           => 'rejected',
            'rejection_reason' => $reason,
        ]);

        $client = $application->client->load('user');
        $this->smsService->loanRejected(
            $client->user->phone,
            $client->user->full_name,
            $reason
        );

        return $application->fresh();
    }

    public function disburseLoan(Loan $loan, string $reference): Loan
    {
        if ($loan->status !== 'approved') {
            throw ValidationException::withMessages([
                'loan' => ['Only approved loans can be disbursed.'],
            ]);
        }

        $durationDays = optional($loan->loanApplication)->duration_days ?? 30;
        $dueDate      = Carbon::now()->addDays($durationDays)->toDateString();

        $loan->update([
            'status'                 => 'active',
            'disbursement_reference' => $reference,
            'disbursed_at'           => now(),
            'due_date'               => $dueDate,
        ]);

        $loan->load('client.user', 'agent.user');

        $this->smsService->loanDisbursed(
            $loan->client->user->phone,
            $loan->client->user->full_name,
            (float) $loan->principal,
            $reference,
            $dueDate
        );

        return $loan;
    }

    public function recordPayment(Loan $loan, float $amount, string $recordedBy, ?string $reference = null): Payment
    {
        if ($loan->status !== 'active') {
            throw ValidationException::withMessages([
                'loan' => ['Payments can only be recorded on active loans.'],
            ]);
        }

        if ($amount <= 0) {
            throw ValidationException::withMessages([
                'amount' => ['Payment amount must be greater than zero.'],
            ]);
        }

        if ($amount > (float) $loan->balance) {
            throw ValidationException::withMessages([
                'amount' => ['Payment amount cannot exceed the outstanding balance.'],
            ]);
        }

        return DB::transaction(function () use ($loan, $amount, $recordedBy, $reference) {
            $payment = $loan->payments()->create([
                'amount'       => $amount,
                'payment_date' => now()->toDateString(),
                'recorded_by'  => $recordedBy,
                'reference'    => $reference,
            ]);

            $newAmountPaid = (float) $loan->amount_paid + $amount;
            $newBalance    = round((float) $loan->total_due - $newAmountPaid, 2);
            $newStatus     = $newBalance <= 0 ? 'completed' : $loan->status;

            $loan->update([
                'amount_paid' => $newAmountPaid,
                'balance'     => max(0, $newBalance),
                'status'      => $newStatus,
            ]);

            $loan->load('client.user');

            $this->smsService->paymentReceived(
                $loan->client->user->phone,
                $loan->client->user->full_name,
                $amount,
                max(0, $newBalance)
            );

            return $payment->load('loan', 'recorder');
        });
    }

    private function createCommission(Loan $loan): Commission
    {
        $commissionRate   = (float) Setting::get('commission_rate', 2);
        $commissionAmount = round((float) $loan->principal * ($commissionRate / 100), 2);

        return Commission::create([
            'agent_id' => $loan->agent_id,
            'loan_id'  => $loan->id,
            'amount'   => $commissionAmount,
            'rate'     => $commissionRate,
            'month'    => now()->month,
            'year'     => now()->year,
            'status'   => 'pending',
        ]);
    }
}
