import { MessagesList } from '@/components/messages/MessagesList';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

interface MessageWithRelations {
    id: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    senderId: string;
    receiverId: string;
    sender?: {
        email: string;
        artisan?: {
            name: string;
        };
    };
    receiver?: {
        email: string;
        artisan?: {
            name: string;
        };
    };
}

export default async function MessagesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth/login');
    }

    // Récupérer tous les messages de l'utilisateur (envoyés et reçus)
    let messages: MessageWithRelations[] = [];

    if (session.user.role === 'CLIENT') {
        // Les clients voient tous leurs messages (envoyés et reçus)
        const sentMessages = (await prisma.message.findMany({
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
        })) as MessageWithRelations[];

        const receivedMessages = (await prisma.message.findMany({
            where: {
                receiverId: session.user.id,
            },
            include: {
                sender: {
                    include: {
                        artisan: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })) as MessageWithRelations[];

        // Combiner et trier par date
        messages = [...sentMessages, ...receivedMessages].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    } else if (session.user.role === 'ARTISAN') {
        // Les artisans voient tous leurs messages (envoyés et reçus)
        const sentMessages = (await prisma.message.findMany({
            where: {
                senderId: session.user.id,
            },
            include: {
                receiver: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })) as MessageWithRelations[];

        const receivedMessages = (await prisma.message.findMany({
            where: {
                receiverId: session.user.id,
            },
            include: {
                sender: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })) as MessageWithRelations[];

        // Combiner et trier par date
        messages = [...sentMessages, ...receivedMessages].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='max-w-4xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        {session.user.role === 'CLIENT'
                            ? 'Mes conversations'
                            : 'Messages reçus'}
                    </h1>
                    <p className='text-gray-600 mt-2'>
                        {session.user.role === 'CLIENT'
                            ? 'Historique de vos échanges avec les artisans'
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
