<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Presence extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'internship_id',
        'user_id',
        'date',
        'checkin_time',
        'checkout_time',
        'checkin_photo_url',
        'checkout_photo_url',
        'checkin_lat',
        'checkin_lon',
        'checkout_lat',
        'checkout_lon',
        'status',
        'location_verified',
        'location_distance_m',
        'needs_manual_review_reason',
    ];

    protected function checkinPhotoUrl(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? Storage::disk('public')->url($value) : null,
        );
    }

    protected function checkoutPhotoUrl(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? Storage::disk('public')->url($value) : null,
        );
    }
}