import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function Index({ auth, logbooks }) {
    
    const events = logbooks.map(log => ({
        title: log.title,
        start: log.date,
        // Atur warna berdasarkan status
        backgroundColor: log.status === 'verified' ? '#10B981' : (log.status === 'submitted' ? '#F59E0B' : '#6B7280'),
        borderColor: log.status === 'verified' ? '#10B981' : (log.status === 'submitted' ? '#F59E0B' : '#6B7280'),
    }));

    // Di sini Anda bisa menambahkan form untuk membuat logbook baru

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Logbook Harian</h2>}
        >
            <Head title="Logbook" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {/* Tambahkan Form untuk Create Logbook di sini */}
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            weekends={true}
                            events={events}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}