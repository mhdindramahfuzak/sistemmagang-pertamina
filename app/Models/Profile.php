<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nim_nip',
        'institution',
        'age',
        'address',
        'internship_duration',
        'internship_field',
        'cv_path',
        'transcript_path',
        'cover_letter_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}