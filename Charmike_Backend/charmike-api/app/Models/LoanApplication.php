<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class LoanApplication extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'client_id',
        'amount_requested',
        'duration_days',
        'status',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'amount_requested' => 'decimal:2',
            'duration_days'    => 'integer',
        ];
    }

    // ── Relationships ──────────────────────────────────────────────────

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function loan(): HasOne
    {
        return $this->hasOne(Loan::class);
    }
}
