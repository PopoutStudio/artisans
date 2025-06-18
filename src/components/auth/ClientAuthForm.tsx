'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ClientAuthForm() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;

        try {
            const response = await fetch('/api/auth/register-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Une erreur est survenue');
            }

            // Après l'inscription, connecter l'utilisateur
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            router.push('/search');
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Une erreur est survenue',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
            <div>
                <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                >
                    Nom complet
                </label>
                <input
                    type='text'
                    name='name'
                    id='name'
                    required
                    placeholder='Votre nom complet'
                    className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                />
            </div>

            <div>
                <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700'
                >
                    Email
                </label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    required
                    placeholder='votre@email.com'
                    className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                />
            </div>

            <div>
                <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700'
                >
                    Mot de passe
                </label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    required
                    minLength={6}
                    placeholder='Au moins 6 caractères'
                    className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                />
            </div>

            {error && <div className='text-red-600 text-sm'>{error}</div>}

            <button
                type='submit'
                disabled={loading}
                className='w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
            >
                {loading ? 'Création du compte...' : 'Créer mon compte client'}
            </button>
        </form>
    );
}
