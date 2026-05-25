<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
{
    Schema::create('claim_images', function (Blueprint $table) {

        $table->id();

        $table->foreignId('claim_id')
            ->constrained('claims')
            ->onDelete('cascade');

        $table->string('image_path');

        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('claim_images');
    }
};