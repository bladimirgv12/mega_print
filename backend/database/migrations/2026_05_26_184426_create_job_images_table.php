<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->string('alt')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_images');
    }
};
