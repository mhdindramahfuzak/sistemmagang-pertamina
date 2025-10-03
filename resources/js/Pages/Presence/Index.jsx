import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2'; // <-- IMPORT SWEETALERT

// Komponen untuk menampilkan jam digital
const DigitalClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="text-4xl font-bold text-gray-800">
            {time.toLocaleTimeString('id-ID')}
        </div>
    );
};


export default function Index({ auth, activeInternship, todayPresence }) {
    const { flash, errors: validationErrors } = usePage().props; // Ambil flash & errors
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [facingMode, setFacingMode] = useState('user'); // 'user' untuk kamera depan

    const webcamRef = useRef(null);
    const { data, setData, post, processing, errors } = useForm({
        photo: null,
        latitude: '',
        longitude: '',
    });

    // --- EFEK UNTUK MENAMPILKAN NOTIFIKASI DARI SERVER ---
    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: flash.success,
                showConfirmButton: false,
                timer: 3000,
            });
        } else if (flash.error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: flash.error,
                showConfirmButton: false,
                timer: 4000,
            });
        }
    }, [flash]);

    // --- EFEK UNTUK MENAMPILKAN ERROR VALIDASI ---
    useEffect(() => {
        const errorValues = Object.values(validationErrors);
        if (errorValues.length > 0) {
            const errorMessage = errorValues.join('<br>');
            Swal.fire({
                icon: 'error',
                title: 'Oops... Terjadi Kesalahan',
                html: errorMessage,
            });
        }
    }, [validationErrors]);


    const getLocation = () => {
        setLocationError('');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setData(prevData => ({
                        ...prevData,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }));
                },
                (error) => {
                    setLocationError('Gagal mendapatkan lokasi. Pastikan GPS aktif dan berikan izin akses.');
                    Swal.fire('Error Lokasi', 'Gagal mendapatkan lokasi. Pastikan GPS aktif dan Anda telah memberikan izin akses.', 'error');
                }
            );
        } else {
            setLocationError('Geolocation tidak didukung oleh browser ini.');
        }
    };

    const handlePresence = (type) => {
        setIsCameraOpen(true);
        getLocation();
    };

    const capturePhoto = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            // Convert base64 to Blob
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "presence-photo.jpg", { type: "image/jpeg" });
                    setData('photo', file);
                });
        }
        setIsCameraOpen(false);
    }, [webcamRef, setData]);

    useEffect(() => {
        if (data.photo && data.latitude) {
            // Tentukan route berdasarkan apakah sudah check-in atau belum
            const targetRoute = todayPresence && !todayPresence.checkout_time ? 'presence.checkout' : 'presence.checkin';
            const actionText = targetRoute === 'presence.checkin' ? 'Check-in' : 'Check-out';

            Swal.fire({
                title: `Konfirmasi ${actionText}`,
                text: "Anda akan mengirimkan data presensi sekarang.",
                imageUrl: URL.createObjectURL(data.photo),
                imageHeight: 200,
                imageAlt: 'Foto Presensi',
                showCancelButton: true,
                confirmButtonColor: '#16a34a',
                cancelButtonColor: '#d33',
                confirmButtonText: `Ya, Lakukan ${actionText}!`,
                cancelButtonText: 'Ambil Ulang Foto',
            }).then((result) => {
                if (result.isConfirmed) {
                    post(route(targetRoute), {
                        onStart: () => {
                            Swal.fire({
                                title: 'Mengirim data...',
                                text: 'Mohon tunggu sebentar.',
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                },
                            });
                        },
                        onFinish: () => {
                           // SweetAlert untuk success/error akan ditangani oleh useEffect flash
                        }
                    });
                } else {
                    // Reset foto jika batal
                    setData('photo', null);
                }
            });
        }
    }, [data.photo]);

    const toggleCameraFacingMode = () => {
        setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
    };

    const renderPresenceStatus = () => {
        if (!activeInternship) {
            return <div className="rounded-md bg-yellow-100 p-4 text-center text-yellow-800">Anda tidak memiliki jadwal magang yang aktif saat ini.</div>;
        }

        if (todayPresence) {
            return (
                <div className="space-y-4 text-center">
                    <div className="rounded-lg bg-green-100 p-4">
                        <p className="font-semibold text-green-800">Check-in hari ini berhasil pada:</p>
                        <p className="text-lg font-bold text-green-900">{new Date(todayPresence.checkin_time).toLocaleTimeString('id-ID')}</p>
                    </div>
                    {todayPresence.checkout_time && (
                        <div className="rounded-lg bg-blue-100 p-4">
                            <p className="font-semibold text-blue-800">Check-out hari ini berhasil pada:</p>
                            <p className="text-lg font-bold text-blue-900">{new Date(todayPresence.checkout_time).toLocaleTimeString('id-ID')}</p>
                        </div>
                    )}
                </div>
            );
        }
        return <div className="rounded-md bg-gray-200 p-4 text-center text-gray-700">Anda belum melakukan presensi hari ini.</div>;
    };

    const canCheckout = todayPresence && !todayPresence.checkout_time;
    const isPresenceDone = todayPresence && todayPresence.checkout_time;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Presensi Harian</h2>}
        >
            <Head title="Presensi" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex flex-col items-center p-6 text-gray-900">

                            <DigitalClock />
                            <p className="mb-6 text-lg text-gray-600">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

                            <div className="w-full mb-6">
                                {renderPresenceStatus()}
                            </div>

                            {locationError && <p className="mb-4 text-sm text-red-600">{locationError}</p>}

                            {!isPresenceDone && activeInternship && (
                                <button
                                    onClick={() => handlePresence(canCheckout ? 'checkout' : 'checkin')}
                                    disabled={processing}
                                    className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50
                                    ${canCheckout ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}
                                `}
                                >
                                    {processing ? 'Memproses...' : (canCheckout ? 'Lakukan Check-out' : 'Lakukan Check-in')}
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {isCameraOpen && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="w-full max-w-lg rounded-lg bg-white p-4">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                facingMode: facingMode
                            }}
                            className="h-full w-full rounded"
                        />
                        <div className="mt-4 flex justify-between gap-2">
                             <button onClick={() => setIsCameraOpen(false)} className="w-full rounded bg-red-500 px-4 py-2 text-white">Batal</button>
                             <button onClick={toggleCameraFacingMode} className="w-full rounded bg-gray-500 px-4 py-2 text-white">Ganti Kamera</button>
                             <button onClick={capturePhoto} className="w-full rounded bg-indigo-600 px-4 py-2 text-white">Ambil Foto</button>
                        </div>
                    </div>
                 </div>
            )}
        </AuthenticatedLayout>
    );
}

