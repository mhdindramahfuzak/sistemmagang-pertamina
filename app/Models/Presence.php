<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Presence extends Model
{
    protected function checkinPhotoUrl(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? Storage::disk('s3')->temporaryUrl($value, now()->addMinutes(15)) : null,
        );
    }
}
