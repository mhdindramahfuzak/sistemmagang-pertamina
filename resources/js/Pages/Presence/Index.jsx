import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2';

// --- Custom Hook untuk Validasi Waktu di Frontend ---
// Hook ini mengelola semua logika terkait waktu secara terpisah.
const useTimeValidation = (presenceConfig) => {
    const [timeState, setTimeState] = useState({
        isCheckinTime: false,
        isCheckoutTime: false,
        currentTime: new Date()
    });

    useEffect(() => {
        // Guard clause untuk memastikan config tidak null
        if (!presenceConfig) return;

        const checkTime = () => {
            const now = new Date();
            const [checkinStartHour, checkinStartMinute] = presenceConfig.checkin_start.split(':');
            const [checkinEndHour, checkinEndMinute] = presenceConfig.checkin_end.split(':');
            const [checkoutStartHour, checkoutStartMinute] = presenceConfig.checkout_start.split(':');
            const [checkoutEndHour, checkoutEndMinute] = presenceConfig.checkout_end.split(':');

            const checkinStartTime = new Date();
            checkinStartTime.setHours(checkinStartHour, checkinStartMinute, 0, 0);

            const checkinEndTime = new Date();
            checkinEndTime.setHours(checkinEndHour, checkinEndMinute, 0, 0);

            const checkoutStartTime = new Date();
            checkoutStartTime.setHours(checkoutStartHour, checkoutStartMinute, 0, 0);

            const checkoutEndTime = new Date();
            checkoutEndTime.setHours(checkoutEndHour, checkoutEndMinute, 0, 0);

            setTimeState({
                isCheckinTime: now >= checkinStartTime && now <= checkinEndTime,
                isCheckoutTime: now >= checkoutStartTime && now <= checkoutEndTime,
                currentTime: now
            });
        };

        checkTime(); // Panggil sekali saat komponen dimuat
        const timerId = setInterval(checkTime, 30000); // Update waktu setiap 30 detik

        return () => clearInterval(timerId); // Bersihkan interval saat komponen tidak lagi ditampilkan
    }, [presenceConfig]);

    return timeState;
};


// Komponen untuk menampilkan jam digital
const DigitalClock = ({ time }) => (
    <div className="text-4xl font-bold text-gray-800">
        {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
);


export default function Index({ auth, activeInternship, todayPresence, presenceConfig }) {
    const { flash, errors: validationErrors } = usePage().props;
    // Menggunakan custom hook untuk mendapatkan status waktu terkini
    const { isCheckinTime, isCheckoutTime, currentTime } = useTimeValidation(presenceConfig);

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [facingMode, setFacingMode] = useState('user');

    const webcamRef = useRef(null);
    const { data, setData, post, processing } = useForm({
        photo: null,
        latitude: '',
        longitude: '',
    });

    // useEffect untuk menampilkan notifikasi dari server (sukses/gagal)
    useEffect(() => {
        if (flash.success) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: flash.success, showConfirmButton: false, timer: 3000 });
        } else if (flash.error) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: flash.error, showConfirmButton: false, timer: 5000 });
        }
    }, [flash]);

    // useEffect untuk menampilkan error validasi
    useEffect(() => {
        const errorValues = Object.values(validationErrors);
        if (errorValues.length > 0) {
            Swal.fire({ icon: 'error', title: 'Oops... Terjadi Kesalahan', html: errorValues.join('<br>') });
        }
    }, [validationErrors]);

    const getLocation = () => {
        setLocationError('');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
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
        // Validasi waktu di frontend sebelum membuka kamera
        if (type === 'checkin' && !isCheckinTime) {
            Swal.fire('Di Luar Jam Kerja', `Check-in hanya bisa dilakukan antara pukul ${presenceConfig.checkin_start} dan ${presenceConfig.checkin_end}.`, 'warning');
            return;
        }
        if (type === 'checkout' && !isCheckoutTime) {
            Swal.fire('Di Luar Jam Kerja', `Check-out hanya bisa dilakukan antara pukul ${presenceConfig.checkout_start} dan ${presenceConfig.checkout_end}.`, 'warning');
            return;
        }

        setIsCameraOpen(true);
        getLocation();
    };

    const capturePhoto = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "presence-photo.jpg", { type: "image/jpeg" });
                    setData('photo', file);
                });
        }
        setIsCameraOpen(false);
    }, [webcamRef, setData]);

    // useEffect untuk memicu konfirmasi SweetAlert saat foto berhasil diambil
    useEffect(() => {
        if (data.photo && data.latitude) {
            const targetRoute = todayPresence && !todayPresence.checkout_time ? 'presence.checkout' : 'presence.checkin';
            const actionText = targetRoute === 'presence.checkin' ? 'Check-in' : 'Check-out';
            Swal.fire({
                title: `Konfirmasi ${actionText}`, text: "Anda akan mengirimkan data presensi sekarang.", imageUrl: URL.createObjectURL(data.photo), imageHeight: 200, imageAlt: 'Foto Presensi', showCancelButton: true, confirmButtonColor: '#16a34a', cancelButtonColor: '#d33', confirmButtonText: `Ya, Lakukan ${actionText}!`, cancelButtonText: 'Ambil Ulang Foto',
            }).then((result) => {
                if (result.isConfirmed) {
                    post(route(targetRoute), {
                        onStart: () => Swal.fire({ title: 'Mengirim data...', text: 'Mohon tunggu sebentar.', allowOutsideClick: false, didOpen: () => Swal.showLoading() }),
                    });
                } else {
                    setData('photo', null);
                }
            });
        }
    }, [data.photo]);

    const toggleCameraFacingMode = () => setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
    
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

    // Logika untuk menentukan status tombol
    const canCheckin = !todayPresence;
    const canCheckout = todayPresence && !todayPresence.checkout_time;
    const isPresenceDone = todayPresence && todayPresence.checkout_time;
    const presenceAction = canCheckin ? 'checkin' : (canCheckout ? 'checkout' : null);
    const isButtonDisabled = processing || (presenceAction === 'checkin' && !isCheckinTime) || (presenceAction === 'checkout' && !isCheckoutTime);

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
                            <DigitalClock time={currentTime} />
                            <p className="mb-6 text-lg text-gray-600">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <div className="w-full mb-6">{renderPresenceStatus()}</div>

                            {!isPresenceDone && activeInternship && (
                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={() => handlePresence(presenceAction)}
                                        disabled={isButtonDisabled}
                                        className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
                                        ${canCheckout ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}`}
                                    >
                                        {processing ? 'Memproses...' : (canCheckout ? 'Lakukan Check-out' : 'Lakukan Check-in')}
                                    </button>
                                    {isButtonDisabled && !processing && presenceConfig && (
                                         <p className="mt-3 text-sm text-red-600 text-center">
                                            {presenceAction === 'checkin' && `Check-in dibuka pukul ${presenceConfig.checkin_start} - ${presenceConfig.checkin_end}`}
                                            {presenceAction === 'checkout' && `Check-out dibuka pukul ${presenceConfig.checkout_start} - ${presenceConfig.checkout_end}`}
                                         </p>
                                    )}
                                </div>
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
                            videoConstraints={{ facingMode }}
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