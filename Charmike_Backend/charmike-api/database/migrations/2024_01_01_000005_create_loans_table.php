<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->foreignUuid('client_id')->constrained('clients')->restrictOnDelete();
            $table->foreignUuid('agent_id')->constrained('agents')->restrictOnDelete();
            $table->foreignUuid('loan_application_id')->nullable()->constrained('loan_applications')->nullOnDelete();
            $table->decimal('principal', 12, 2);
            $table->decimal('interest_rate', 5, 2); // percentage
            $table->decimal('interest_amount', 12, 2);
            $table->decimal('total_due', 12, 2);
            $table->decimal('amount_paid', 12, 2)->default(0);
            $table->decimal('balance', 12, 2);
            $table->enum('status', ['approved', 'active', 'completed', 'defaulted'])->default('approved');
            $table->string('disbursement_reference')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('disbursed_at')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
