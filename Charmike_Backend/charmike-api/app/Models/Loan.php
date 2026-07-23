<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Loan extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'client_id',
        'agent_id',
        'loan_application_id',
        'principal',
        'interest_rate',
        'interest_amount',
        'total_due',
        'amount_paid',
        'balance',
        'status',
        'disbursement_reference',
        'approved_at',
        'disbursed_at',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'principal'       => 'decimal:2',
            'interest_rate'   => 'decimal:2',
            'interest_amount' => 'decimal:2',
            'total_due'       => 'decimal:2',
            'amount_paid'     => 'decimal:2',
            'balance'         => 'decimal:2',
            'approved_at'     => 'datetime',
            'disbursed_at'    => 'datetime',
            'due_date'        => 'date',
        ];
    }

    // ── Relationships ──────────────────────────────────────────────────

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    public function loanApplication(): BelongsTo
    {
        return $this->belongsTo(LoanApplication::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function commission(): HasOne
    {
        return $this->hasOne(Commission::class);
    }
}
