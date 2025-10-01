<?php

namespace App\Exports;

use App\Models\Presence;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AttendanceExport implements FromQuery, WithHeadings, WithMapping
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    /**
    * @return \Illuminate\Database\Query\Builder
    */
    public function query()
    {
        return Presence::query()
            ->with(['user', 'internship']) // Eager load relasi
            ->whereBetween('date', [$this->startDate, $this->endDate]);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Nama Peserta',
            'NIM',
            'Tanggal',
            'Check In',
            'Check Out',
            'Lokasi Verified',
            'Jarak (meter)',
            'Status',
        ];
    }

    /**
     * @param Presence $presence
     * @return array
     */
    public function map($presence): array
    {
        return [
            $presence->id,
            $presence->user->name,
            $presence->user->profile->nim ?? '-', // Ambil nim dari profil
            $presence->date,
            $presence->checkin_time,
            $presence->checkout_time,
            $presence->location_verified ? 'Ya' : 'Tidak',
            $presence->location_distance_m,
            $presence->status,
        ];
    }
}