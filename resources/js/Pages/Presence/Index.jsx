// File: resources/js/Pages/Presence/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function PresenceIndex({ auth, internship, todayPresence, flash }) {
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef();

    const { data, setData, post, errors, clearErrors } = useForm({
        latitude: '',
        longitude: '',
        photo: null,
    });

    useEffect(() => {
        if (location) {
            setData({ ...data, latitude: location.latitude, longitude: location.longitude });
        }
    }, [location]);
    
    useEffect(() => {
        if (photo) {
            setData({ ...data, photo: photo });
        }
    }, [photo]);


    const handleGetLocation = () => {
        setIsProcessing(true);
        setLocationError('');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setIsProcessing(false);
                },
                (error) => {
                    setLocationError(`Error: ${error.message}. Pastikan izin lokasi telah diberikan.`);
                    setIsProcessing(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setLocationError("Geolocation tidak didukung oleh browser ini.");
            setIsProcessing(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
            clearErrors('photo');
        }
    };

    const submitCheckIn = (e) => {
        e.preventDefault();
        post(route('presence.checkin', internship.id), {
            onStart: () => setIsProcessing(true),
            onFinish: () => setIsProcessing(false),
            forceFormData: true,
        });
    };
    
    const submitCheckOut = (e) => {
        e.preventDefault();
        // Inertia tidak mendukung method PUT/PATCH dengan multipart/form-data, jadi kita gunakan _method
        post(route('presence.checkout', internship.id), {
            onStart: () => setIsProcessing(true),
            onFinish: () => setIsProcessing(false),
            forceFormData: true,
        });
    };

    const renderPresenceStatus = () => {
        if (!todayPresence) {
            return (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Informasi</p>
                    <p>Anda belum melakukan check-in hari ini.</p>
                </div>
            );
        }

        if (todayPresence && !todayPresence.checkout_time) {
            return (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Anda Sudah Check-in</p>
                    <p>Waktu Check-in: {new Date(todayPresence.checkin_time).toLocaleTimeString('id-ID')}</p>
                    <p>Status Lokasi: {todayPresence.location_verified ? 'Terverifikasi' : 'Menunggu Review'}</p>
                </div>
            );
        }

        if (todayPresence && todayPresence.checkout_time) {
            return (
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Presensi Hari Ini Selesai</p>
                    <p>Check-in: {new Date(todayPresence.checkin_time).toLocaleTimeString('id-ID')}</p>
                    <p>Check-out: {new Date(todayPresence.checkout_time).toLocaleTimeString('id-ID')}</p>
                </div>
            );
        }
    };

    const canCheckIn = !todayPresence;
    const canCheckOut = todayPresence && !todayPresence.checkout_time;
    const actionType = canCheckIn ? 'in' : (canCheckOut ? 'out' : 'none');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Presensi Harian</h2>}
        >
            <Head title="Presensi" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-6">
                            {flash.success && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    <span className="block sm:inline">{flash.success}</span>
                                </div>
                            )}
                            {flash.error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    <span className="block sm:inline">{flash.error}</span>
                                </div>
                            )}

                            {!internship ? (
                                <p>Anda tidak memiliki program magang yang sedang aktif.</p>
                            ) : (
                                <>
                                    <div className="text-center text-lg font-medium">
                                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>

                                    {renderPresenceStatus()}

                                    {(canCheckIn || canCheckOut) && (
                                        <form onSubmit={actionType === 'in' ? submitCheckIn : submitCheckOut} className="space-y-4">
                                            {/* Location Section */}
                                            <div>
                                                <h3 className="font-medium text-gray-700 mb-2">1. Verifikasi Lokasi</h3>
                                                <PrimaryButton type="button" onClick={handleGetLocation} disabled={isProcessing}>
                                                    {isProcessing && !location ? 'Mengambil Lokasi...' : 'Ambil Lokasi Saat Ini'}
                                                </PrimaryButton>
                                                {location && <p className="text-sm text-green-600 mt-2">Lokasi berhasil didapat!</p>}
                                                {locationError && <p className="text-sm text-red-600 mt-2">{locationError}</p>}
                                                <InputError message={errors.latitude || errors.longitude} className="mt-2" />
                                            </div>

                                            {/* Photo Section */}
                                            <div>
                                                <h3 className="font-medium text-gray-700 mb-2">2. Ambil Foto</h3>
                                                <PrimaryButton type="button" onClick={() => fileInputRef.current.click()} disabled={isProcessing}>
                                                    Pilih/Ambil Foto
                                                </PrimaryButton>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    ref={fileInputRef}
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                {photoPreview && (
                                                    <div className="mt-4 border rounded-lg p-2 max-w-xs">
                                                        <img src={photoPreview} alt="Preview" className="rounded-md" />
                                                    </div>
                                                )}
                                                <InputError message={errors.photo} className="mt-2" />
                                            </div>

                                            <div className="border-t pt-4">
                                                <PrimaryButton type="submit" disabled={isProcessing || !location || !photo}>
                                                    {isProcessing ? 'Memproses...' : `Submit Check-${actionType === 'in' ? 'In' : 'Out'}`}
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

