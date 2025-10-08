import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';

export default function Index({ auth, activeInternship }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        final_report: null,
        internship_id: activeInternship?.id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (!data.internship_id) {
            alert('Tidak ada periode magang aktif yang ditemukan.');
            return;
        }
        post(route('final-report.store'), {
            forceFormData: true,
        });
    };

    // Helper untuk melihat file yang sudah diupload
    const FileLink = ({ path, label }) => path ? 
        <a href={`/storage/${path}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
            Lihat {label} Saat Ini
        </a> : null;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Akhir Magang</h2>}
        >
            <Head title="Laporan Akhir" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {activeInternship ? (
                                <section>
                                    <header>
                                        <h2 className="text-lg font-medium text-gray-900">Upload Laporan Akhir</h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Silakan unggah file laporan akhir magang Anda dalam format PDF (maksimal 10MB).
                                        </p>
                                    </header>

                                    <form onSubmit={submit} className="mt-6 space-y-6 max-w-xl">
                                        <div>
                                            <InputLabel htmlFor="final_report" value="File Laporan Akhir" />
                                            <input
                                                id="final_report"
                                                type="file"
                                                className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                onChange={(e) => setData('final_report', e.target.files[0])}
                                                accept=".pdf"
                                                required
                                            />
                                            <FileLink path={activeInternship?.final_report_path} label="Laporan Akhir" />
                                            <InputError message={errors.final_report} className="mt-2" />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <PrimaryButton disabled={processing}>
                                                {processing ? 'Mengunggah...' : 'Unggah Laporan'}
                                            </PrimaryButton>
                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-gray-600">Berhasil diunggah.</p>
                                            </Transition>
                                        </div>
                                    </form>

                                    <div className="mt-6">
                                        <p className="text-sm font-medium">Status Laporan: 
                                            <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                                activeInternship.final_report_status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                                activeInternship.final_report_status === 'approved' ? 'bg-green-100 text-green-800' :
                                                activeInternship.final_report_status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {activeInternship.final_report_status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </p>
                                    </div>

                                </section>
                            ) : (
                                <p>Anda tidak memiliki periode magang yang sedang aktif. Fitur ini hanya tersedia untuk peserta magang aktif.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}