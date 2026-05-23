<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('policies', function (
            Blueprint $table
        ) {
            $table->id();

            $table->foreignId('shop_detail_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('policy_number')
                ->unique();

            $table->string('plan_id');

            $table->string('plan_name');

            $table->decimal(
                'premium_amount',
                10,
                2
            );

            $table->date('start_date');

            $table->date('end_date');

            $table->enum('status', [
                'pending',
                'active',
                'expired',
                'cancelled'
            ])->default('pending');

            $table->enum('payment_status', [
                'pending',
                'paid',
                'failed'
            ])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('policies');
    }
};