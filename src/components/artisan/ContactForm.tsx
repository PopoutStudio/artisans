'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

interface ContactFormProps {
    artisanId: string;
    artisanName: string;
}

export function ContactForm({ artisanId, artisanName }: ContactFormProps) {
    const { data: session, status } = useSession();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: artisanId,
                    content: message,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Une erreur est survenue');
            }

            setSuccess(true);
            setMessage('');
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Une erreur est survenue',
            );
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className='text-center py-8'>
                <div className='text-gray-500'>Chargement...</div>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className='text-center py-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Connectez-vous pour contacter cet artisan
                </h3>
                <p className='text-gray-600 mb-6'>
                    Vous devez avoir un compte client pour pouvoir contacter{' '}
                    {artisanName}.
                </p>
                <div className='space-y-3'>
                    <Link
                        href='/auth/login'
                        className='block w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-center'
                    >
                        Se connecter
                    </Link>
                    <Link
                        href='/auth/register-client'
                        className='block w-full rounded-md border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50 text-center'
                    >
                        Créer un compte client
                    </Link>
                </div>
            </div>
        );
    }

    if (session.user.role !== 'CLIENT') {
        return (
            <div className='text-center py-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Accès réservé aux clients
                </h3>
                <p className='text-gray-600 mb-6'>
                    Seuls les clients peuvent contacter les artisans. Si vous
                    êtes artisan, vous ne pouvez pas contacter d&apos;autres
                    artisans.
                </p>
                <Link
                    href='/search'
                    className='inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                >
                    Retour à la recherche
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className='text-center py-8'>
                <div className='text-green-600 text-6xl mb-4'>✓</div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Message envoyé !
                </h3>
                <p className='text-gray-600 mb-6'>
                    Votre message a été envoyé à {artisanName}. Il vous répondra
                    dans les plus brefs délais.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className='inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                >
                    Envoyer un autre message
                </button>
            </div>
        );
    }

    return (
        <div className='py-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Contacter {artisanName}
            </h3>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label
                        htmlFor='message'
                        className='block text-sm font-medium text-gray-700 mb-2'
                    >
                        Votre message
                    </label>
                    <textarea
                        id='message'
                        name='message'
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Décrivez votre projet, vos besoins, votre budget, etc...'
                        required
                        className='block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                    />
                </div>

                {error && <div className='text-red-600 text-sm'>{error}</div>}

                <button
                    type='submit'
                    disabled={loading || !message.trim()}
                    className='w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
            </form>
        </div>
    );
}
