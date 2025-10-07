import { Link, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Custom SVG Icons
const ChevronDown = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const Users = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const Building2 = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const BookOpen = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const Briefcase = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const CheckCircle = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [openFAQ, setOpenFAQ] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const divisi = [
        { 
            icon: <Building2 className="w-10 h-10" />, 
            name: "Engineering & Produksi", 
            desc: "Pengelolaan operasional kilang dan produksi minyak",
            color: "blue"
        },
        { 
            icon: <Briefcase className="w-10 h-10" />, 
            name: "Keuangan & Administrasi", 
            desc: "Manajemen keuangan, akuntansi, dan administrasi",
            color: "slate"
        },
        { 
            icon: <Users className="w-10 h-10" />, 
            name: "Human Resources", 
            desc: "Pengembangan SDM dan talent management",
            color: "indigo"
        },
        { 
            icon: <BookOpen className="w-10 h-10" />, 
            name: "IT & Digital", 
            desc: "Transformasi digital dan sistem informasi",
            color: "cyan"
        }
    ];

    const alurPendaftaran = [
        { step: "01", title: "Registrasi Akun", desc: "Buat akun dan lengkapi profil Anda dengan data yang valid" },
        { step: "02", title: "Unggah Dokumen", desc: "Upload CV, transkrip nilai, dan surat pengantar dari kampus" },
        { step: "03", title: "Seleksi Administrasi", desc: "Tim HR akan meninjau kelengkapan dan kesesuaian aplikasi" },
        { step: "04", title: "Interview", desc: "Wawancara teknis dan HR dengan supervisor divisi" },
        { step: "05", title: "Pengumuman", desc: "Penerimaan dan penempatan magang resmi" }
    ];

    const faqs = [
        {
            q: "Berapa lama durasi program magang?",
            a: "Program magang di Pertamina Sei Pakning berlangsung minimal 3 bulan hingga maksimal 6 bulan, disesuaikan dengan kebutuhan divisi dan kesepakatan dengan institusi pendidikan."
        },
        {
            q: "Apakah program magang ini dibayar?",
            a: "Ya, peserta magang akan mendapatkan uang saku bulanan sesuai dengan ketentuan yang berlaku di Pertamina, serta fasilitas pendukung lainnya."
        },
        {
            q: "Apa saja persyaratan untuk mendaftar?",
            a: "Persyaratan utama meliputi: mahasiswa aktif semester 6 ke atas, IPK minimal 3.00, surat pengantar dari kampus, CV, transkrip nilai, dan proposal kegiatan magang."
        },
        {
            q: "Kapan periode pendaftaran dibuka?",
            a: "Pendaftaran dibuka setiap semester (Januari dan Juli). Informasi lebih detail akan diumumkan melalui website dan media sosial resmi Pertamina."
        },
        {
            q: "Apakah bisa memilih divisi penempatan?",
            a: "Anda dapat mengajukan preferensi divisi saat pendaftaran, namun penempatan akhir akan disesuaikan dengan kebutuhan perusahaan dan latar belakang pendidikan."
        }
    ];

    const stats = [
        { number: "500+", label: "Mahasiswa Magang" },
        { number: "50+", label: "Universitas Partner" },
        { number: "95%", label: "Tingkat Kepuasan" },
        { number: "4", label: "Divisi Tersedia" }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: {
                bg: 'bg-blue-600',
                hover: 'hover:bg-blue-700',
                text: 'text-blue-600',
                border: 'border-blue-200'
            },
            slate: {
                bg: 'bg-slate-600',
                hover: 'hover:bg-slate-700',
                text: 'text-slate-600',
                border: 'border-slate-200'
            },
            indigo: {
                bg: 'bg-indigo-600',
                hover: 'hover:bg-indigo-700',
                text: 'text-indigo-600',
                border: 'border-indigo-200'
            },
            cyan: {
                bg: 'bg-cyan-600',
                hover: 'hover:bg-cyan-700',
                text: 'text-cyan-600',
                border: 'border-cyan-200'
            }
        };
        return colors[color];
    };

    return (
        <>
            <Head title="Welcome - SIMAGANG PERTAMINA" />
            
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200' 
                    : 'bg-white/10 backdrop-blur-sm'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center space-x-3">
                            <img src="/images/logo-kpi.png" alt="Logo Pertamina" className="h-12 w-auto" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">SIMAGANG</h1>
                                <p className="text-xs font-medium text-gray-600">Pertamina Sei Pakning</p>
                            </div>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#home" className="text-gray-700 hover:text-blue-700 transition font-medium relative group">
                                Beranda
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 group-hover:w-full transition-all"></span>
                            </a>
                            <a href="#divisi" className="text-gray-700 hover:text-blue-700 transition font-medium relative group">
                                Divisi
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 group-hover:w-full transition-all"></span>
                            </a>
                            <a href="#alur" className="text-gray-700 hover:text-blue-700 transition font-medium relative group">
                                Alur
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 group-hover:w-full transition-all"></span>
                            </a>
                            <a href="#faq" className="text-gray-700 hover:text-blue-700 transition font-medium relative group">
                                FAQ
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 group-hover:w-full transition-all"></span>
                            </a>
                        </div>

                        <div className="flex items-center space-x-4">
                            {auth && auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all font-semibold"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-5 py-2.5 text-gray-700 hover:text-blue-700 transition font-semibold"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all font-semibold"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/gedung-kpi.jpeg" 
                        alt="Gedung Pertamina" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-slate-900/90"></div>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-8">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                        <span className="text-blue-100 text-sm font-medium">Program Magang 2025</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        Bergabung dengan <br />
                        <span className="text-blue-400">
                            Industri Energi Terkemuka
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Kembangkan kemampuan teknis dan profesional Anda bersama <span className="text-blue-400 font-semibold">500+ mahasiswa</span> di Pertamina Sei Pakning
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link
                            href={route('register')}
                            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Daftar Sekarang
                        </Link>
                        <a
                            href="#alur"
                            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all"
                        >
                            Pelajari Lebih Lanjut
                        </a>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                                <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-8 h-8 text-white/60" />
                </div>
            </section>

            {/* Divisi Section */}
            <section id="divisi" className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
                            <span className="text-blue-700 text-sm font-semibold">DIVISI PENEMPATAN</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Temukan Divisi yang <span className="text-blue-700">Tepat</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            4 divisi strategis yang siap mengembangkan potensi terbaik Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {divisi.map((item, index) => {
                            const colors = getColorClasses(item.color);
                            return (
                                <div 
                                    key={index}
                                    className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200"
                                >
                                    <div className={`inline-flex p-3 rounded-lg ${colors.bg} text-white mb-4`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Alur Pendaftaran */}
            <section id="alur" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-2 bg-blue-600/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-4">
                            <span className="text-blue-300 text-sm font-semibold">PROSES PENDAFTARAN</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            5 Langkah Menuju <span className="text-blue-400">Kesuksesan</span>
                        </h2>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                            Proses pendaftaran yang transparan dan terstruktur
                        </p>
                    </div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700 transform -translate-y-1/2"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                            {alurPendaftaran.map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="relative inline-block mb-6">
                                        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg mx-auto">
                                            <span className="text-2xl">{item.step}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all"
                        >
                            <CheckCircle className="w-6 h-6" />
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
                            <span className="text-blue-700 text-sm font-semibold">FAQ</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Pertanyaan yang Sering <span className="text-blue-700">Ditanyakan</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            Temukan jawaban untuk pertanyaan Anda
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-blue-300 transition-all"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition"
                                >
                                    <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center transition-transform ${
                                        openFAQ === index ? 'rotate-180' : ''
                                    }`}>
                                        <ChevronDown className="w-5 h-5 text-white" />
                                    </div>
                                </button>
                                <div className={`overflow-hidden transition-all ${
                                    openFAQ === index ? 'max-h-96' : 'max-h-0'
                                }`}>
                                    <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
                                        <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Siap Memulai Perjalanan Karir Anda?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-3xl mx-auto">
                        Bergabunglah dengan ribuan mahasiswa yang telah mengembangkan keterampilan mereka di perusahaan energi terkemuka Indonesia
                    </p>
                    
                    <Link
                        href={route('register')}
                        className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-700 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                    >
                        Daftar Sekarang
                        <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                    </Link>
                    
                    <p className="mt-6 text-blue-200 text-sm">
                        ✓ Proses cepat • ✓ 100% online • ✓ Gratis biaya pendaftaran
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <img src="/images/logo-kpi.png" alt="Logo" className="h-12 w-auto" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">SIMAGANG</h3>
                                    <p className="text-sm text-gray-400">Pertamina Sei Pakning</p>
                                </div>
                            </div>
                            <p className="text-gray-400 leading-relaxed mb-4 max-w-md text-sm">
                                Sistem Manajemen Magang Terintegrasi untuk mengembangkan talenta muda Indonesia di industri energi.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Menu Cepat</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#home" className="text-gray-400 hover:text-blue-400 transition">Beranda</a></li>
                                <li><a href="#divisi" className="text-gray-400 hover:text-blue-400 transition">Divisi</a></li>
                                <li><a href="#alur" className="text-gray-400 hover:text-blue-400 transition">Alur Pendaftaran</a></li>
                                <li><a href="#faq" className="text-gray-400 hover:text-blue-400 transition">FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Hubungi Kami</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="text-gray-400">
                                    Pertamina Sei Pakning<br />
                                    Jl. Raya Sei Pakning<br />
                                    Bengkalis, Riau
                                </li>
                                <li>
                                    <a href="mailto:info@pertamina.com" className="text-gray-400 hover:text-blue-400 transition">
                                        info@pertamina.com
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+62" className="text-gray-400 hover:text-blue-400 transition">
                                        +62 xxx xxxx xxxx
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                            <p className="text-gray-400">
                                &copy; 2025 SIMAGANG Pertamina Sei Pakning. All rights reserved.
                            </p>
                            <div className="flex items-center gap-4 text-gray-500">
                                <span>Laravel v{laravelVersion}</span>
                                <span>•</span>
                                <span>PHP v{phpVersion}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}