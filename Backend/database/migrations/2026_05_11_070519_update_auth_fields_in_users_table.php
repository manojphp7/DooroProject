<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // rename google_id -> provider_id
            $table->renameColumn('google_id', 'provider_id');

            // new fields
            $table->string('provider')->nullable()->after('email');
            $table->string('phone')->nullable()->after('provider_id');
            $table->string('avatar')->nullable()->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('provider_id', 'google_id');

            $table->dropColumn([
                'provider',
                'phone',
                'avatar'
            ]);
        });
    }
};