'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [unreadCount, setUnreadCount] = useState(0);

    const isActive = (path: string) => pathname === path;

    // Récupérer le nombre de messages non lus pour tous les utilisateurs connectés
    useEffect(() => {
        if (session?.user?.id) {
            const fetchUnreadCount = async () => {
                try {
                    const response = await fetch('/api/messages/unread-count');
                    if (response.ok) {
                        const data = await response.json();
                        setUnreadCount(data.count);
                    }
                } catch (error) {
                    console.error(
                        'Erreur lors de la récupération du nombre de messages non lus:',
                        error,
                    );
                }
            };

            fetchUnreadCount();
            // Rafraîchir toutes les 30 secondes
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [session?.user?.id]);

    return (
        <nav className='bg-white shadow-lg'>
            <div className='container mx-auto px-4'>
                <div className='flex justify-between h-16'>
                    <div className='flex'>
                        <div className='flex-shrink-0 flex items-center'>
                            <Link
                                href='/'
                                className='text-xl font-bold text-blue-600'
                            >
                                Artisans
                            </Link>
                        </div>
                        <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                            <Link
                                href='/search'
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    isActive('/search')
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Rechercher
                            </Link>
                            {session?.user && (
                                <>
                                    {session.user.role === 'ARTISAN' && (
                                        <>
                                            <Link
                                                href='/profile'
                                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                                    isActive('/profile')
                                                        ? 'border-blue-500 text-gray-900'
                                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                }`}
                                            >
                                                Mon Profil
                                            </Link>
                                            <Link
                                                href='/messages'
                                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium relative ${
                                                    isActive('/messages')
                                                        ? 'border-blue-500 text-gray-900'
                                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                }`}
                                            >
                                                Messages
                                                {unreadCount > 0 && (
                                                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                                                        {unreadCount > 9
                                                            ? '9+'
                                                            : unreadCount}
                                                    </span>
                                                )}
                                            </Link>
                                        </>
                                    )}
                                    {session.user.role === 'CLIENT' && (
                                        <Link
                                            href='/messages'
                                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium relative ${
                                                isActive('/messages')
                                                    ? 'border-blue-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        >
                                            Mes Messages
                                            {unreadCount > 0 && (
                                                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                                                    {unreadCount > 9
                                                        ? '9+'
                                                        : unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                        {status === 'loading' ? (
                            <div className='text-gray-500'>Chargement...</div>
                        ) : session?.user ? (
                            <div className='flex items-center space-x-4'>
                                <div className='flex flex-col items-end'>
                                    <span className='text-gray-700 text-sm font-medium'>
                                        {session.user.email}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                        {session.user.role === 'ARTISAN'
                                            ? 'Artisan'
                                            : 'Client'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className='text-gray-500 hover:text-gray-700 text-sm font-medium'
                                >
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <div className='flex items-center space-x-4'>
                                <Link
                                    href='/auth/login'
                                    className='text-gray-500 hover:text-gray-700 text-sm font-medium'
                                >
                                    Connexion
                                </Link>
                                <div className='relative group'>
                                    <button className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700'>
                                        Inscription
                                    </button>
                                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
                                        <Link
                                            href='/auth/register'
                                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                        >
                                            Devenir Artisan
                                        </Link>
                                        <Link
                                            href='/auth/register-client'
                                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                        >
                                            Créer un compte Client
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
