<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('claims', function (Blueprint $table) {

            $table->text('description')
                ->nullable()
                ->after('reason');

            $table->date('incident_date')
                ->nullable()
                ->after('description');

        });
    }

    public function down(): void
    {
        Schema::table('claims', function (Blueprint $table) {

            $table->dropColumn([
                'description',
                'incident_date'
            ]);

        });
    }
};