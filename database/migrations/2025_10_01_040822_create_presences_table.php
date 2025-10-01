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
        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->timestamp('checkin_time')->nullable();
            $table->timestamp('checkout_time')->nullable();
            $table->string('checkin_photo_url')->nullable();
            $table->string('checkout_photo_url')->nullable();
            $table->decimal('checkin_lat', 10, 7)->nullable();
            $table->decimal('checkin_lon', 10, 7)->nullable();
            $table->decimal('checkout_lat', 10, 7)->nullable();
            $table->decimal('checkout_lon', 10, 7)->nullable();
            $table->string('status')->default('pending'); // pending, present, absent
            $table->boolean('location_verified')->default(false);
            $table->integer('location_distance_m')->nullable();
            $table->string('needs_manual_review_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};
