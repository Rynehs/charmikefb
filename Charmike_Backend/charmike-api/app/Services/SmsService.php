<?php

namespace App\Services;

use AfricasTalking\SDK\AfricasTalking;
use Illuminate\Support\Facades\Log;

class SmsService
{
    private $sms;

    public function __construct()
    {
        $AT  = new AfricasTalking(
            config('africastalking.username'),
            config('africastalking.api_key')
        );

        $this->sms = $AT->sms();
    }

    /**
     * Send a single SMS message.
     */
    public function send(string $phone, string $message): bool
    {
        try {
            $payload = [
                'to'      => $this->formatPhone($phone),
                'message' => $message,
            ];

            if (config('africastalking.sender_id')) {
                $payload['from'] = config('africastalking.sender_id');
            }

            $result = $this->sms->send($payload);

            $recipients = $result['data']->SMSMessageData->Recipients ?? [];

            foreach ($recipients as $recipient) {
                if ($recipient->status !== 'Success') {
                    Log::warning('SMS failed for recipient', [
                        'phone'  => $phone,
                        'status' => $recipient->status,
                    ]);
                    return false;
                }
            }

            Log::info('SMS sent successfully', ['phone' => $phone]);
            return true;

        } catch (\Exception $e) {
            Log::error('SMS send error', [
                'phone'   => $phone,
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send SMS to multiple recipients.
     */
    public function sendBulk(array $phones, string $message): void
    {
        foreach ($phones as $phone) {
            $this->send($phone, $message);
        }
    }

    // ── Loan Notification Templates ───────────────────────────────────

    public function loanApplicationReceived(string $phone, string $name, float $amount): void
    {
        $this->send($phone,
            "Dear {$name}, your loan application of KES " .
            number_format($amount, 2) .
            " has been received and is under review. We will notify you once processed. - Charmike Investments"
        );
    }

    public function loanApproved(string $phone, string $name, float $amount, string $dueDate): void
    {
        $this->send($phone,
            "Dear {$name}, your loan of KES " .
            number_format($amount, 2) .
            " has been APPROVED. Due date: {$dueDate}. Funds will be disbursed shortly. - Charmike Investments"
        );
    }

    public function loanRejected(string $phone, string $name, string $reason): void
    {
        $this->send($phone,
            "Dear {$name}, your loan application has been declined. Reason: {$reason}. " .
            "Contact us for more information. - Charmike Investments"
        );
    }

    public function loanDisbursed(string $phone, string $name, float $amount, string $reference, string $dueDate): void
    {
        $this->send($phone,
            "Dear {$name}, KES " .
            number_format($amount, 2) .
            " has been disbursed to you. Ref: {$reference}. " .
            "Repayment due: {$dueDate}. - Charmike Investments"
        );
    }

    public function paymentReceived(string $phone, string $name, float $amount, float $balance): void
    {
        $message = $balance <= 0
            ? "Dear {$name}, payment of KES " . number_format($amount, 2) .
              " received. Your loan is now FULLY REPAID. Thank you! - Charmike Investments"
            : "Dear {$name}, payment of KES " . number_format($amount, 2) .
              " received. Outstanding balance: KES " . number_format($balance, 2) .
              ". - Charmike Investments";

        $this->send($phone, $message);
    }

    public function loanDueReminder(string $phone, string $name, float $balance, string $dueDate): void
    {
        $this->send($phone,
            "Dear {$name}, your loan balance of KES " .
            number_format($balance, 2) .
            " is due on {$dueDate}. Please ensure timely payment to avoid penalties. - Charmike Investments"
        );
    }

    public function newClientRegistered(string $agentPhone, string $agentName, string $clientName): void
    {
        $this->send($agentPhone,
            "Hi {$agentName}, a new client {$clientName} has been registered under your agent code. - Charmike Investments"
        );
    }

    // ── Helpers ───────────────────────────────────────────────────────

    /**
     * Ensure phone is in international format (+254...)
     */
    private function formatPhone(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone); // strip non-digits

        // Convert 07xx or 01xx to +254
        if (str_starts_with($phone, '0')) {
            $phone = '254' . substr($phone, 1);
        }

        // Add + if missing
        if (! str_starts_with($phone, '+')) {
            $phone = '+' . $phone;
        }

        return $phone;
    }
}
