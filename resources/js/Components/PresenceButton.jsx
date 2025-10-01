import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function PresenceButton({ internshipId }) {
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef();

    const handleCheckIn = () => {
        setIsLoading(true);
        setStatus('Mendapatkan lokasi...');
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation tidak didukung oleh browser Anda.');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setStatus('Silakan ambil foto untuk check-in.');
                // Memicu input file secara programatik
                fileInputRef.current.click();
                // Menyimpan lokasi untuk digunakan saat file dipilih
                fileInputRef.current.position = position;
            },
            () => {
                setError('Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan.');
                setIsLoading(false);
            }
        );
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const position = fileInputRef.current.position;

        if (file && position) {
            setStatus('Mengunggah data...');
            
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('latitude', position.coords.latitude);
            formData.append('longitude', position.coords.longitude);

            axios.post(`/api/internships/${internshipId}/presence/checkin`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                setStatus('Check-in berhasil! ' + new Date(response.data.presence.checkin_time).toLocaleTimeString());
                setIsLoading(false);
                alert('Check-in berhasil!');
            })
            .catch(err => {
                const errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat check-in.';
                setError(errorMessage);
                setIsLoading(false);
            });
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-bold mb-2">Presensi Harian</h3>
            <button
                onClick={handleCheckIn}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
                {isLoading ? status : 'Check-In Sekarang'}
            </button>

            {/* Input file tersembunyi */}
            <input 
                type="file" 
                accept="image/*" 
                capture="user" // 'user' untuk kamera depan, 'environment' untuk kamera belakang
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }} 
            />

            {error && <p className="text-red-500 mt-2">{error}</p>}
            {!error && status && <p className="text-green-600 mt-2">{status}</p>}
        </div>
    );
}