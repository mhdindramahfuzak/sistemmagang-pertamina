import React, { useState, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';
import PrimaryButton from './PrimaryButton';

export default function PresenceButton({ internship, presenceToday }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [showCamera, setShowCamera] = useState(false);

    const handleCheckInOrOut = (type) => {
        setError('');
        if (!navigator.geolocation || !navigator.mediaDevices) {
            setError('Browser tidak mendukung fitur kamera atau lokasi.');
            return;
        }
        setShowCamera(true);
        // Start video stream
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => {
                setError('Tidak dapat mengakses kamera. Mohon izinkan akses.');
                setShowCamera(false);
            });
    };

    const captureAndSubmit = (type) => {
        setIsLoading(true);

        // 1. Capture Image from Video
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) {
            setError("Referensi kamera tidak ditemukan.");
            setIsLoading(false);
            return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        canvas.toBlob(blob => {
             // Stop camera stream
            if (video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop());
            }
            setShowCamera(false);

            // 2. Get Geolocation
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    // 3. Prepare FormData
                    const formData = new FormData();
                    formData.append('photo', blob, 'presence.jpg');
                    formData.append('latitude', latitude);
                    formData.append('longitude', longitude);
                    
                    // Inertia can't handle multipart/form-data directly for PUT/PATCH, so we use a POST override.
                    // Or better, use axios/fetch for file uploads.
                    
                    axios.post(route(`api.presence.${type}`, { internship: internship.id }), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }).then(response => {
                        alert(`Proses ${type} berhasil!`);
                        router.reload({ only: ['presenceToday'] }); // Refresh data
                    }).catch(err => {
                        const errorMessage = err.response?.data?.message || `Proses ${type} gagal. Coba lagi.`;
                        setError(errorMessage);
                        alert(errorMessage);
                    }).finally(() => {
                        setIsLoading(false);
                    });
                },
                (geoError) => {
                    setError('Tidak dapat mengakses lokasi. Pastikan GPS aktif dan izin telah diberikan.');
                    setIsLoading(false);
                    setShowCamera(false);
                },
                { enableHighAccuracy: true }
            );
        }, 'image/jpeg');
    };

    const renderButtons = () => {
        if (!presenceToday || !presenceToday.checkin_time) {
            return (
                <PrimaryButton onClick={() => handleCheckInOrOut('checkin')} disabled={isLoading}>
                    Check-In
                </PrimaryButton>
            );
        }
        if (presenceToday.checkin_time && !presenceToday.checkout_time) {
            return (
                <PrimaryButton onClick={() => handleCheckInOrOut('checkout')} disabled={isLoading} className="bg-red-500 hover:bg-red-700">
                    Check-Out
                </PrimaryButton>
            );
        }
        return <p className="text-green-600 font-semibold">Presensi hari ini sudah lengkap.</p>;
    };

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-lg mb-2">Presensi Hari Ini</h3>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            
            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <div className="mt-4 flex gap-4">
                        <PrimaryButton onClick={() => captureAndSubmit(presenceToday && presenceToday.checkin_time ? 'checkout' : 'checkin')} disabled={isLoading}>
                            {isLoading ? 'Memproses...' : 'Ambil Gambar & Kirim'}
                        </PrimaryButton>
                         <button onClick={() => {
                            setShowCamera(false)
                            if (videoRef.current && videoRef.current.srcObject) {
                                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                            }
                        }} className="text-white">Batal</button>
                    </div>
                </div>
            )}
            
            <div className="flex items-center gap-4">
                {renderButtons()}
            </div>
             <p className="text-xs text-gray-500 mt-2">Pastikan Anda berada di area Pertamina Sei Pakning dan mengizinkan akses kamera & lokasi.</p>
        </div>
    );
}