<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Commission extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'agent_id',
        'loan_id',
        'amount',
        'rate',
        'month',
        'year',
        'status',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount'  => 'decimal:2',
            'rate'    => 'decimal:2',
            'month'   => 'integer',
            'year'    => 'integer',
            'paid_at' => 'datetime',
        ];
    }

    // ── Relationships ──────────────────────────────────────────────────

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }
}
