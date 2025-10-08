<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Internship extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'supervisor_id',
        'unit',
        'start_date',
        'end_date',
        'status',
        'final_report_path', 
        'final_report_status', 
    ];
    
    /**
     * Definisikan relasi one-to-many ke Presences.
     */
    public function presences()
    {
        return $this->hasMany(Presence::class);
    }

    /**
     * Definisikan relasi belongs-to ke User (intern).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Definisikan relasi belongs-to ke User (supervisor).
     */
    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }
}