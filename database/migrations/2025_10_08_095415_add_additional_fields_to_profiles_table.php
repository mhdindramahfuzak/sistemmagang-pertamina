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
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('nim_nip')->after('user_id')->nullable();
            $table->string('institution')->after('nim_nip')->nullable();
            $table->integer('age')->after('institution')->nullable();
            $table->text('address')->after('age')->nullable();
            $table->string('internship_duration')->after('address')->nullable(); // cth: "3 Bulan"
            $table->string('internship_field')->after('internship_duration')->nullable();

            // Kolom untuk path file
            $table->string('cv_path')->nullable()->after('internship_field');
            $table->string('transcript_path')->nullable()->after('cv_path');
            $table->string('cover_letter_path')->nullable()->after('transcript_path'); // Surat Permohonan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn([
                'nim_nip',
                'institution',
                'age',
                'address',
                'internship_duration',
                'internship_field',
                'cv_path',
                'transcript_path',
                'cover_letter_path',
            ]);
        });
    }
};