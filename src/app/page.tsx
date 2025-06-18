import Link from 'next/link';

export default function HomePage() {
    return (
        <div className='container mx-auto px-4 py-16'>
            <div className='max-w-4xl mx-auto text-center'>
                <h1 className='text-4xl font-bold text-gray-900 mb-6'>
                    Trouvez l&apos;artisan qu&apos;il vous faut
                </h1>
                <p className='text-xl text-gray-600 mb-8'>
                    Des artisans qualifiés près de chez vous pour tous vos
                    projets
                </p>

                <div className='grid md:grid-cols-2 gap-8 mb-12'>
                    <div className='bg-white p-8 rounded-lg shadow-md'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                            Vous cherchez un artisan ?
                        </h2>
                        <p className='text-gray-600 mb-6'>
                            Créez votre compte client pour contacter directement
                            les artisans et obtenir des devis.
                        </p>
                        <div className='space-y-3'>
                            <Link
                                href='/search'
                                className='block w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
                            >
                                Rechercher un artisan
                            </Link>
                            <Link
                                href='/auth/register-client'
                                className='block w-full inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50'
                            >
                                Créer un compte client
                            </Link>
                        </div>
                    </div>

                    <div className='bg-white p-8 rounded-lg shadow-md'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                            Vous êtes artisan ?
                        </h2>
                        <p className='text-gray-600 mb-6'>
                            Rejoignez notre plateforme pour trouver de nouveaux
                            clients et développer votre activité.
                        </p>
                        <div className='space-y-3'>
                            <Link
                                href='/auth/register'
                                className='block w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700'
                            >
                                Devenir artisan
                            </Link>
                            <Link
                                href='/search'
                                className='block w-full inline-flex items-center justify-center px-6 py-3 border border-green-600 text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50'
                            >
                                Voir les artisans
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='text-center'>
                    <p className='text-gray-600 mb-4'>Déjà un compte ?</p>
                    <Link
                        href='/auth/login'
                        className='inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        </div>
    );
}
