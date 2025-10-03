import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function PresenceReview({ auth, presences }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Verifikasi Presensi" />

            <div className="space-y-6">
                 <h1 className="text-2xl font-bold text-gray-800">Verifikasi Presensi Bermasalah</h1>
                 <p className="text-gray-600">Berikut adalah daftar presensi yang lokasinya berada di luar radius yang diizinkan dan memerlukan verifikasi manual.</p>
            
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Intern</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Check-in</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jarak (Meter)</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {presences.data.map((presence) => (
                                <tr key={presence.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{presence.user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(presence.date).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(presence.checkin_time).toLocaleTimeString('id-ID')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{presence.location_distance_m} m</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <a href={presence.checkin_photo_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">Lihat Foto</a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link 
                                            href={route('presence.verify', presence.id)} 
                                            method="put" 
                                            as="button" 
                                            className="text-green-600 hover:text-green-900"
                                            onBefore={() => confirm('Apakah Anda yakin ingin memverifikasi presensi ini?')}
                                        >
                                            Verifikasi
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                 {/* Tambahkan pagination jika ada */}
            </div>

        </AuthenticatedLayout>
    );
}
