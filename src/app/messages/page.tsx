import { MessagesList } from '@/components/messages/MessagesList';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function MessagesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth/login');
    }

    // Récupérer les messages selon le rôle de l'utilisateur
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let messages: any[] = [];

    if (session.user.role === 'CLIENT') {
        // Les clients voient les messages qu'ils ont envoyés

        messages = (await prisma.message.findMany({
            where: {
                senderId: session.user.id,
            },
            include: {
                receiver: {
                    include: {
                        artisan: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })) as any[];
    } else if (session.user.role === 'ARTISAN') {
        // Les artisans voient les messages qu'ils ont reçus

        messages = (await prisma.message.findMany({
            where: {
                receiverId: session.user.id,
            },
            include: {
                sender: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })) as any[];
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='max-w-4xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        {session.user.role === 'CLIENT'
                            ? 'Mes messages envoyés'
                            : 'Messages reçus'}
                    </h1>
                    <p className='text-gray-600 mt-2'>
                        {session.user.role === 'CLIENT'
                            ? 'Historique de vos messages envoyés aux artisans'
                            : 'Messages reçus de clients potentiels'}
                    </p>
                </div>

                <MessagesList
                    messages={messages}
                    userRole={session.user.role}
                />
            </div>
        </div>
    );
}
