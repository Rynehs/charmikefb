<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->updateOrInsert(
            ['key' => 'repayment_plans'],
            [
                'value' => json_encode([
                    ['label' => '4 Weeks', 'duration_days' => 28, 'interest_rate' => 20],
                    ['label' => '30 Days', 'duration_days' => 30, 'interest_rate' => 25],
                    ['label' => '6 Weeks', 'duration_days' => 42, 'interest_rate' => 30],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'repayment_plans')->delete();
    }
};