<?php

namespace App\Services;

class GeolocationService
{
    /**
     * Menghitung jarak antara dua titik koordinat menggunakan formula Haversine.
     *
     * @param float $lat1 Latitude titik pertama.
     * @param float $lon1 Longitude titik pertama.
     * @param float $lat2 Latitude titik kedua.
     * @param float $lon2 Longitude titik kedua.
     * @return float Jarak dalam meter.
     */
    public function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371000; // Radius bumi dalam meter

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}