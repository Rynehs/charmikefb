<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        \Illuminate\Support\Facades\DB::table('settings')->insert([
            [
                'key' => 'commission_rate',
                'value' => '2',
                'description' => 'Agent commission percentage on loan principal',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'default_interest_rate',
                'value' => '20',
                'description' => 'Default loan interest rate (%)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'max_active_loans',
                'value' => '1',
                'description' => 'Maximum concurrent active loans per client',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
