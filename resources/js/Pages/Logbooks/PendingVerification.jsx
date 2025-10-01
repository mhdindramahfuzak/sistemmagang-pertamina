import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

// Komponen untuk satu baris logbook
function LogbookItem({ logbook }) {
    const { data, setData, put, processing, errors } = useForm({
        status: '',
        supervisor_comment: '',
    });

    const handleVerification = (e, newStatus) => {
        e.preventDefault();
        setData('status', newStatus); // Set status sebelum submit
        put(route('logbooks.verify', { logbook: logbook.id }), {
            preserveScroll: true,
            onSuccess: () => alert('Verifikasi berhasil!'),
        });
    };

    return (
        <div className="border rounded-lg p-4 mb-4">
            <p><strong>{logbook.user.name}</strong> - {logbook.date}</p>
            <h4 className="font-bold text-lg">{logbook.title}</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{logbook.description}</p>

            <form className="mt-4">
                <textarea
                    value={data.supervisor_comment}
                    onChange={(e) => setData('supervisor_comment', e.target.value)}
                    placeholder="Tambahkan komentar (opsional)"
                    className="w-full border-gray-300 rounded-md shadow-sm"
                ></textarea>

                <div className="flex items-center gap-4 mt-2">
                    <button onClick={(e) => handleVerification(e, 'verified')} disabled={processing} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400">
                        Setujui
                    </button>
                    <button onClick={(e) => handleVerification(e, 'rejected')} disabled={processing} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400">
                        Tolak
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function PendingVerification({ auth, pendingLogbooks }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl">Verifikasi Logbook</h2>}>
            <Head title="Verifikasi Logbook" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {pendingLogbooks.length > 0 ? (
                        pendingLogbooks.map(logbook => <LogbookItem key={logbook.id} logbook={logbook} />)
                    ) : (
                        <p className="text-center text-gray-500">Tidak ada logbook yang perlu diverifikasi saat ini.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}