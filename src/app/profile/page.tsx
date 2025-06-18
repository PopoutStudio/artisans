import { ProfileForm } from '@/components/profile/ProfileForm';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth/login');
    }

    const artisan = await prisma.artisan.findUnique({
        where: {
            userId: session.user.id,
        },
        select: {
            name: true,
            description: true,
            services: true,
            commune: true,
        },
    });

    if (!artisan) {
        redirect('/auth/login');
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='max-w-2xl mx-auto'>
                <h1 className='text-3xl font-bold mb-8'>Mon Profil</h1>
                <ProfileForm initialData={artisan} />
            </div>
        </div>
    );
}
