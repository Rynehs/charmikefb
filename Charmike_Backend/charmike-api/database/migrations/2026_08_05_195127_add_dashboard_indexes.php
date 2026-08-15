<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->index('created_at');
            $table->index(['status', 'created_at']);
            $table->index('client_id');
            $table->index('agent_id');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->index('created_at');
            $table->index('payment_date');
            $table->index('loan_id');
            $table->index('recorded_by');
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->index('user_id');
        });

        Schema::table('agents', function (Blueprint $table) {
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['status', 'created_at']);
            $table->dropIndex(['client_id']);
            $table->dropIndex(['agent_id']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['payment_date']);
            $table->dropIndex(['loan_id']);
            $table->dropIndex(['recorded_by']);
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
        });

        Schema::table('agents', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
        });
    }
};