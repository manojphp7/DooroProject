<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    // ✅ TABLE ALREADY EXISTS
    if (Schema::hasTable('claims')) {
        return;
    }

    Schema::create('claims', function (Blueprint $table) {

        $table->id();

        // RELATIONS
        $table->foreignId('policy_id')
            ->constrained('policies')
            ->onDelete('cascade');

        $table->foreignId('user_id')
            ->constrained('users')
            ->onDelete('cascade');

        // CLAIM INFO
        $table->string('claim_number')->unique();

        $table->text('reason')->nullable();

        $table->decimal('claim_amount', 10, 2)
            ->nullable();

        $table->enum('status', [
            'pending',
            'processing',
            'approved',
            'rejected',
        ])->default('pending');

        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};
