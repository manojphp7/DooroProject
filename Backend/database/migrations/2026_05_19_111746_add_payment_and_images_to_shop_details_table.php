<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_details', function (Blueprint $table) {

            $table->foreignId('user_id')
                  ->nullable()
                  ->after('id')
                  ->constrained()
                  ->nullOnDelete();

            // IMAGE PATHS
            $table->string('front_image')->nullable();

            $table->string('closeup_image')->nullable();

            $table->string('serial_image')->nullable();

            // PAYMENT
            $table->string('plan_name')->nullable();

            $table->decimal('payment_amount', 10, 2)
                  ->default(0);

            $table->enum('payment_status', [
                'pending',
                'paid',
                'failed'
            ])->default('pending');
        });
    }

    public function down(): void
    {
        Schema::table('shop_details', function (Blueprint $table) {

            $table->dropForeign(['user_id']);

            $table->dropColumn([
                'user_id',
                'front_image',
                'closeup_image',
                'serial_image',
                'plan_name',
                'payment_amount',
                'payment_status',
            ]);
        });
    }
};