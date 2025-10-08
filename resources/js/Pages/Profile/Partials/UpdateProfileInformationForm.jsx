import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '', profile }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        nim_nip: profile?.nim_nip || '',
        institution: profile?.institution || '',
        age: profile?.age || '',
        address: profile?.address || '',
        internship_duration: profile?.internship_duration || '',
        internship_field: profile?.internship_field || '',
        cv: null,
        transcript: null,
        cover_letter: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            // Inertia akan otomatis kirim multipart/form-data ketika flag ini aktif
            forceFormData: true,
        });
    };

    // Helper untuk melihat file yg sudah diupload (jika ada)
    const FileLink = ({ path, label }) =>
        path ? (
            <a
                href={`/storage/${path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
            >
                Lihat {label} Saat Ini
            </a>
        ) : null;

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and attached documents.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                {/* Name */}
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* NIM/NIP */}
                <div>
                    <InputLabel htmlFor="nim_nip" value="NIM/NIP" />
                    <TextInput
                        id="nim_nip"
                        className="mt-1 block w-full"
                        value={data.nim_nip}
                        onChange={(e) => setData('nim_nip', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.nim_nip} />
                </div>

                {/* Institusi */}
                <div>
                    <InputLabel htmlFor="institution" value="Asal Instansi" />
                    <TextInput
                        id="institution"
                        className="mt-1 block w-full"
                        value={data.institution}
                        onChange={(e) => setData('institution', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.institution} />
                </div>

                {/* Umur */}
                <div>
                    <InputLabel htmlFor="age" value="Umur" />
                    <TextInput
                        id="age"
                        type="number"
                        className="mt-1 block w-full"
                        value={data.age}
                        onChange={(e) => setData('age', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.age} />
                </div>

                {/* Alamat */}
                <div>
                    <InputLabel htmlFor="address" value="Alamat" />
                    <TextInput
                        id="address"
                        className="mt-1 block w-full"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.address} />
                </div>

                {/* Durasi Magang */}
                <div>
                    <InputLabel htmlFor="internship_duration" value="Lama Magang" />
                    <TextInput
                        id="internship_duration"
                        className="mt-1 block w-full"
                        value={data.internship_duration}
                        onChange={(e) => setData('internship_duration', e.target.value)}
                        placeholder="Contoh: 3 Bulan"
                    />
                    <InputError className="mt-2" message={errors.internship_duration} />
                </div>

                {/* Bidang Magang */}
                <div>
                    <InputLabel htmlFor="internship_field" value="Bidang Magang" />
                    <TextInput
                        id="internship_field"
                        className="mt-1 block w-full"
                        value={data.internship_field}
                        onChange={(e) => setData('internship_field', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.internship_field} />
                </div>

                <hr />

                {/* CV */}
                <div className="mt-4">
                    <InputLabel htmlFor="cv" value="Upload CV (PDF, maks 2MB)" />
                    <input
                        type="file"
                        id="cv"
                        className="mt-1 block w-full text-sm"
                        onChange={(e) => setData('cv', e.target.files[0])}
                        accept=".pdf"
                    />
                    <FileLink path={profile?.cv_path} label="CV" />
                    <InputError className="mt-2" message={errors.cv} />
                </div>

                {/* Transkrip */}
                <div className="mt-4">
                    <InputLabel htmlFor="transcript" value="Upload Transkrip Nilai (PDF, maks 2MB)" />
                    <input
                        type="file"
                        id="transcript"
                        className="mt-1 block w-full text-sm"
                        onChange={(e) => setData('transcript', e.target.files[0])}
                        accept=".pdf"
                    />
                    <FileLink path={profile?.transcript_path} label="Transkrip" />
                    <InputError className="mt-2" message={errors.transcript} />
                </div>

                {/* Surat Permohonan */}
                <div className="mt-4">
                    <InputLabel htmlFor="cover_letter" value="Upload Surat Permohonan (PDF, maks 2MB)" />
                    <input
                        type="file"
                        id="cover_letter"
                        className="mt-1 block w-full text-sm"
                        onChange={(e) => setData('cover_letter', e.target.files[0])}
                        accept=".pdf"
                    />
                    <FileLink path={profile?.cover_letter_path} label="Surat Permohonan" />
                    <InputError className="mt-2" message={errors.cover_letter} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
