<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Pengaturan Presensi
    |--------------------------------------------------------------------------
    |
    | Atur jam operasional untuk check-in dan check-out.
    | Format waktu adalah 'HH:MM' (24 jam).
    |
    */
    'presence' => [
        'checkin_start'  => env('CHECKIN_START_TIME', '07:00'),
        'checkin_end'    => env('CHECKIN_END_TIME', '08:00'),
        'checkout_start' => env('CHECKOUT_START_TIME', '16:00'),
        'checkout_end'   => env('CHECKOUT_END_TIME', '17:00'),
    ],
];