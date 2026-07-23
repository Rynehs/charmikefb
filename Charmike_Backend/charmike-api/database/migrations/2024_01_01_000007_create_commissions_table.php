<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commissions', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->foreignUuid('agent_id')->constrained('agents')->restrictOnDelete();
            $table->foreignUuid('loan_id')->constrained('loans')->restrictOnDelete();
            $table->decimal('amount', 12, 2);
            $table->decimal('rate', 5, 2); // commission rate used
            $table->unsignedSmallInteger('month');
            $table->unsignedSmallInteger('year');
            $table->enum('status', ['pending', 'paid'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commissions');
    }
};
