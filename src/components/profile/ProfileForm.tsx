'use client';

import { SERVICES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProfileFormProps {
    initialData: {
        name: string;
        description: string | null;
        services: string[];
        commune: string | null;
        codePostal: string | null;
    };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<string[]>(initialData.services);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            services,
            commune: formData.get('commune') as string,
            codePostal: formData.get('codePostal') as string,
        };

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Une erreur est survenue');
            }

            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Une erreur est survenue',
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleService = (service: string) => {
        if (services.includes(service)) {
            setServices(services.filter((s) => s !== service));
        } else {
            setServices([...services, service]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-6 w-full max-w-2xl'>
            <div>
                <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                >
                    Nom
                </label>
                <input
                    type='text'
                    name='name'
                    id='name'
                    defaultValue={initialData.name}
                    required
                    className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                />
            </div>

            <div>
                <label
                    htmlFor='description'
                    className='block text-sm font-medium text-gray-700'
                >
                    Description
                </label>
                <textarea
                    name='description'
                    id='description'
                    rows={4}
                    defaultValue={initialData.description || ''}
                    className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <label
                        htmlFor='commune'
                        className='block text-sm font-medium text-gray-700'
                    >
                        Commune
                    </label>
                    <input
                        type='text'
                        name='commune'
                        id='commune'
                        defaultValue={initialData.commune || ''}
                        placeholder='Ex: Paris, Lyon, Marseille'
                        className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                    />
                </div>

                <div>
                    <label
                        htmlFor='codePostal'
                        className='block text-sm font-medium text-gray-700'
                    >
                        Code Postal
                    </label>
                    <input
                        type='text'
                        name='codePostal'
                        id='codePostal'
                        defaultValue={initialData.codePostal || ''}
                        placeholder='Ex: 75001'
                        className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                    />
                </div>
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Services proposés
                </label>
                <div className='grid grid-cols-2 gap-2'>
                    {SERVICES.map((service) => (
                        <label
                            key={service}
                            className='flex items-center space-x-2 cursor-pointer'
                        >
                            <input
                                type='checkbox'
                                checked={services.includes(service)}
                                onChange={() => toggleService(service)}
                                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                            />
                            <span className='text-sm text-gray-700'>
                                {service}
                            </span>
                        </label>
                    ))}
                </div>
                {services.length > 0 && (
                    <div className='mt-3'>
                        <p className='text-sm text-gray-600 mb-2'>
                            Services sélectionnés :
                        </p>
                        <div className='flex flex-wrap gap-2'>
                            {services.map((service) => (
                                <span
                                    key={service}
                                    className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'
                                >
                                    {service}
                                    <button
                                        type='button'
                                        onClick={() => toggleService(service)}
                                        className='ml-1 text-blue-600 hover:text-blue-800'
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {error && <div className='text-red-600 text-sm'>{error}</div>}

            <button
                type='submit'
                disabled={loading}
                className='w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
            >
                {loading
                    ? 'Enregistrement...'
                    : 'Enregistrer les modifications'}
            </button>
        </form>
    );
}
