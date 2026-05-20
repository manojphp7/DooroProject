<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_details', function (Blueprint $table) {
            $table->id();
            $table->string('shop_name');
            $table->text('address');
            $table->string('mobile');
            $table->string('shop_type');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_details');
    }
};