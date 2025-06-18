import { ContactForm } from '@/components/artisan/ContactForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface ArtisanWithUser {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    services: string[];
    commune: string | null;
    codePostal: string | null;
    rayon: number;
    createdAt: Date;
    updatedAt: Date;
    user: {
        email: string;
    };
}

interface ArtisanPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ArtisanPage({ params }: ArtisanPageProps) {
    const { id } = await params;
    const artisan = (await prisma.artisan.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    email: true,
                },
            },
        },
    })) as ArtisanWithUser | null;

    if (!artisan) {
        notFound();
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='max-w-3xl mx-auto'>
                <div className='bg-white rounded-lg shadow-lg p-8'>
                    <div className='mb-6'>
                        <h1 className='text-3xl font-bold text-gray-900'>
                            {artisan.name}
                        </h1>
                        {artisan.commune && (
                            <p className='text-gray-600 mt-2'>
                                {artisan.commune}{' '}
                                {artisan.codePostal &&
                                    `(${artisan.codePostal})`}
                            </p>
                        )}
                    </div>

                    {artisan.description && (
                        <div className='mb-6'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                                Description
                            </h2>
                            <p className='text-gray-600'>
                                {artisan.description}
                            </p>
                        </div>
                    )}

                    {artisan.services.length > 0 && (
                        <div className='mb-6'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                                Services proposés
                            </h2>
                            <div className='flex flex-wrap gap-2'>
                                {artisan.services.map((service: string) => (
                                    <span
                                        key={service}
                                        className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'
                                    >
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className='mt-8 pt-6 border-t border-gray-200'>
                        <ContactForm
                            artisanId={artisan.id}
                            artisanName={artisan.name}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
