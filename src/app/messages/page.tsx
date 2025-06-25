import { ChatConversation } from '@/components/messages/ChatConversation';
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
        id: string;
        email: string;
        artisan?: {
            name: string;
        };
    };
    receiver?: {
        id: string;
        email: string;
        artisan?: {
            name: string;
        };
    };
}

interface Conversation {
    id: string;
    participantId: string;
    participantName: string;
    participantEmail: string;
    lastMessage: Date;
    unreadCount: number;
    messages: MessageWithRelations[];
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
                createdAt: 'asc',
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
                createdAt: 'asc',
            },
        })) as MessageWithRelations[];

        // Combiner et trier par date
        messages = [...sentMessages, ...receivedMessages].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
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
                createdAt: 'asc',
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
                createdAt: 'asc',
            },
        })) as MessageWithRelations[];

        // Combiner et trier par date
        messages = [...sentMessages, ...receivedMessages].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
        );
    }

    // Regrouper les messages par conversation
    const conversations = new Map<string, Conversation>();

    messages.forEach((message) => {
        const isSentByMe = message.senderId === session.user.id;
        const otherParticipantId = isSentByMe ? message.receiverId! : message.senderId;
        const otherParticipant = isSentByMe ? message.receiver! : message.sender!;
        
        const conversationId = otherParticipantId;
        
        if (!conversations.has(conversationId)) {
            conversations.set(conversationId, {
                id: conversationId,
                participantId: otherParticipantId,
                participantName: session.user.role === 'CLIENT' 
                    ? (otherParticipant.artisan?.name || otherParticipant.email)
                    : otherParticipant.email,
                participantEmail: otherParticipant.email,
                lastMessage: message.createdAt,
                unreadCount: 0,
                messages: [],
            });
        }

        const conversation = conversations.get(conversationId)!;
        conversation.messages.push(message);
        
        if (message.createdAt > conversation.lastMessage) {
            conversation.lastMessage = message.createdAt;
        }
        
        if (!message.isRead && message.receiverId === session.user.id) {
            conversation.unreadCount++;
        }
    });

    // Convertir en tableau et trier par date du dernier message
    const conversationsList = Array.from(conversations.values()).sort(
        (a, b) => new Date(b.lastMessage).getTime() - new Date(a.lastMessage).getTime()
    );

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

                {conversationsList.length === 0 ? (
                    <div className='text-center py-12'>
                        <div className='text-gray-400 text-6xl mb-4'>📭</div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            {session.user.role === 'CLIENT'
                                ? 'Aucune conversation'
                                : 'Aucun message reçu'}
                        </h3>
                        <p className='text-gray-600'>
                            {session.user.role === 'CLIENT'
                                ? "Vous n'avez pas encore échangé avec des artisans."
                                : "Vous n'avez pas encore reçu de messages de clients."}
                        </p>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {conversationsList.map((conversation) => (
                            <ChatConversation
                                key={conversation.id}
                                conversation={conversation}
                                userRole={session.user.role}
                                currentUserId={session.user.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
