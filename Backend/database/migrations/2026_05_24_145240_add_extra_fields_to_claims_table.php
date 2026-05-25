<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('claims', function (Blueprint $table) {

            $table->decimal('approved_amount', 10, 2)
                ->nullable()
                ->after('claim_amount');

            $table->text('admin_notes')
                ->nullable()
                ->after('approved_amount');

            $table->timestamp('resolved_at')
                ->nullable()
                ->after('admin_notes');

        });
    }

    public function down(): void
    {
        Schema::table('claims', function (Blueprint $table) {

            $table->dropColumn([
                'approved_amount',
                'admin_notes',
                'resolved_at',
            ]);

        });
    }
};