import { ClientAuthForm } from '@/components/auth/ClientAuthForm';
import Link from 'next/link';

export default function RegisterClientPage() {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center p-24'>
            <div className='w-full max-w-md space-y-8'>
                <div>
                    <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
                        Inscription Client
                    </h2>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Créez votre compte pour contacter des artisans
                    </p>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Ou{' '}
                        <Link
                            href='/auth/login'
                            className='font-medium text-blue-600 hover:text-blue-500'
                        >
                            se connecter
                        </Link>
                    </p>
                </div>

                <ClientAuthForm />
            </div>
        </div>
    );
}
