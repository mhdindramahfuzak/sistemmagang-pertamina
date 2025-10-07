import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const ArrowLeft = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const Eye = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOff = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login - SIMAGANG" />
            
            <div className="min-h-screen flex">
                {/* Left Side - Image */}
                <div className="hidden lg:flex lg:w-1/2 relative">
                    <img 
                        src="/images/gedung-kpi.jpeg" 
                        alt="Gedung Pertamina" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-900/80"></div>
                    
                    {/* --- INI BAGIAN YANG DITAMBAHKAN --- */}
                    {/* Gradasi putih untuk menyatu dengan sisi kanan */}
                    <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-white pointer-events-none"></div>
                    {/* ------------------------------------ */}

                    {/* Logo Overlay on Image */}
                    <div className="relative z-10 p-12 flex flex-col justify-between w-full">
                        <div className="flex items-center space-x-3">
                            <img src="/images/logo-kpi.png" alt="Logo Pertamina" className="h-16 w-auto" />
                            <div>
                                <h1 className="text-2xl font-bold text-white">SIMAGANG</h1>
                                <p className="text-sm text-blue-200">Pertamina Sei Pakning</p>
                            </div>
                        </div>
                        
                        <div className="text-white">
                            <h2 className="text-4xl font-bold mb-4 leading-tight">
                                Sistem Pengelolaan<br />
                                Magang Terintegrasi
                            </h2>
                            <p className="text-lg text-blue-100">
                                Bergabunglah dengan program magang di industri energi terkemuka Indonesia
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md">
                        {/* Back Button */}
                        <Link 
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-700 transition mb-8 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Kembali ke Beranda</span>
                        </Link>

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center mb-8">
                            <img src="/images/logo-kpi.png" alt="Logo Pertamina" className="h-16 w-auto" />
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Selamat Datang di<br />
                                Sistem Pengelolaan Magang
                            </h2>
                            <p className="text-gray-600">Masuk untuk menggunakan layanan</p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm font-medium text-green-800">{status}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full"
                                    placeholder="name@gmail.com"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <InputLabel htmlFor="password" value="Password" />
                                <div className="relative mt-2">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="block w-full pr-12"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Remember me
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                                    >
                                        Lupa Password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end">
                                <PrimaryButton className="w-full justify-center" disabled={processing}>
                                    {processing ? 'Memproses...' : 'Masuk'}
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* Register Link */}
                        <div className="mt-8 text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{' '}
                                <Link 
                                    href={route('register')}
                                    className="text-blue-700 hover:text-blue-800 font-semibold"
                                >
                                    Registrasi
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}