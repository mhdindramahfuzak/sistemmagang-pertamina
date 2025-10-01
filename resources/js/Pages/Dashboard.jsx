import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PresenceButton from '@/Components/PresenceButton'; // Pastikan import ini ada

// Komponen kecil untuk menampilkan kartu statistik
const StatCard = ({ title, value }) => (
    <div className="bg-white rounded-lg shadow px-5 py-4">
        <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
);


export default function Dashboard({ auth, stats, activeInternship }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Tampilkan statistik untuk Admin/Supervisor */}
                    {(auth.user.role === 'admin' || auth.user.role === 'supervisor') && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <StatCard title="Logbook Perlu Diverifikasi" value={stats.pending_logbooks} />
                            <StatCard title="Presensi Perlu Direview" value={stats.review_presences} />
                            <StatCard title="Magang Aktif" value={stats.active_internships} />
                        </div>
                    )}
                    
                    {/* Tampilkan tombol presensi hanya untuk Intern dengan magang aktif */}
                    {activeInternship && (
                         <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <PresenceButton internshipId={activeInternship.id} />
                        </div>
                    )}

                    {/* Pesan jika tidak ada magang aktif */}
                    {auth.user.role === 'intern' && !activeInternship && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                            <p>Saat ini Anda tidak memiliki program magang yang aktif.</p>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}