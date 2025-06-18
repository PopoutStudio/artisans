'use client';

import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Message {
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

interface MessagesListProps {
    messages: Message[];
    userRole: string;
}

export function MessagesList({ messages, userRole }: MessagesListProps) {
    const { data: session } = useSession();
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Marquer automatiquement les messages comme lus pour les artisans
    useEffect(() => {
        if (userRole === 'ARTISAN' && session?.user?.id) {
            const unreadMessages = messages.filter(
                (msg) => !msg.isRead && msg.receiverId === session.user.id,
            );

            unreadMessages.forEach(async (message) => {
                try {
                    await fetch(`/api/messages/${message.id}/read`, {
                        method: 'PUT',
                    });
                } catch (error) {
                    console.error(
                        'Erreur lors du marquage du message comme lu:',
                        error,
                    );
                }
            });
        }
    }, [messages, userRole, session?.user?.id]);

    const handleReply = async (messageId: string) => {
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/messages/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    originalMessageId: messageId,
                    content: replyContent,
                }),
            });

            if (response.ok) {
                setReplyContent('');
                setReplyingTo(null);
                // Recharger la page pour afficher le nouveau message
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.message || "Erreur lors de l'envoi de la réponse");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi de la réponse:", error);
            alert("Erreur lors de l'envoi de la réponse");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Grouper les messages par conversation
    const groupMessagesByConversation = (messages: Message[]) => {
        const conversations: { [key: string]: Message[] } = {};

        messages.forEach((message) => {
            // Créer une clé unique pour chaque conversation
            const otherUserId =
                message.senderId === 'currentUserId'
                    ? message.receiverId
                    : message.senderId;
            const conversationKey = otherUserId;

            if (!conversations[conversationKey]) {
                conversations[conversationKey] = [];
            }
            conversations[conversationKey].push(message);
        });

        // Trier les messages dans chaque conversation par date
        Object.keys(conversations).forEach((key) => {
            conversations[key].sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime(),
            );
        });

        return conversations;
    };

    if (messages.length === 0) {
        return (
            <div className='text-center py-12'>
                <div className='text-gray-400 text-6xl mb-4'>📭</div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    {userRole === 'CLIENT'
                        ? 'Aucune conversation'
                        : 'Aucun message reçu'}
                </h3>
                <p className='text-gray-600'>
                    {userRole === 'CLIENT'
                        ? "Vous n'avez pas encore échangé avec des artisans."
                        : "Vous n'avez pas encore reçu de messages de clients."}
                </p>
            </div>
        );
    }

    // Pour l'affichage simple, on garde l'ordre chronologique
    return (
        <div className='space-y-4'>
            {messages.map((message) => {
                const isSentByMe = message.senderId === session?.user?.id;
                const isReceivedByMe = message.receiverId === session?.user?.id;

                return (
                    <div
                        key={message.id}
                        className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                            message.isRead
                                ? 'border-gray-200'
                                : 'border-blue-500'
                        } ${isSentByMe ? 'bg-blue-50' : ''}`}
                    >
                        <div className='flex justify-between items-start mb-4'>
                            <div>
                                <h3 className='font-semibold text-gray-900'>
                                    {userRole === 'CLIENT'
                                        ? isSentByMe
                                            ? `À ${
                                                  message.receiver?.artisan
                                                      ?.name ||
                                                  message.receiver?.email
                                              }`
                                            : `De ${
                                                  message.sender?.artisan
                                                      ?.name ||
                                                  message.sender?.email
                                              }`
                                        : isSentByMe
                                        ? `À ${message.receiver?.email}`
                                        : `De ${message.sender?.email}`}
                                </h3>
                                <div className='flex items-center space-x-2'>
                                    <p className='text-sm text-gray-500'>
                                        {formatDistanceToNow(
                                            new Date(message.createdAt),
                                            {
                                                addSuffix: true,
                                                locale: fr,
                                            },
                                        )}
                                    </p>
                                    {isSentByMe && (
                                        <span className='text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded'>
                                            Envoyé
                                        </span>
                                    )}
                                    {isReceivedByMe && !message.isRead && (
                                        <span className='text-xs text-red-600 bg-red-100 px-2 py-1 rounded'>
                                            Nouveau
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center space-x-2'>
                                {userRole === 'ARTISAN' && isReceivedByMe && (
                                    <button
                                        onClick={() =>
                                            setReplyingTo(
                                                replyingTo === message.id
                                                    ? null
                                                    : message.id,
                                            )
                                        }
                                        className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                                    >
                                        {replyingTo === message.id
                                            ? 'Annuler'
                                            : 'Répondre'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className='prose max-w-none'>
                            <p className='text-gray-700 whitespace-pre-wrap'>
                                {message.content}
                            </p>
                        </div>

                        {/* Formulaire de réponse pour les artisans */}
                        {userRole === 'ARTISAN' &&
                            isReceivedByMe &&
                            replyingTo === message.id && (
                                <div className='mt-4 pt-4 border-t border-gray-200'>
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) =>
                                            setReplyContent(e.target.value)
                                        }
                                        placeholder='Tapez votre réponse...'
                                        className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        rows={3}
                                    />
                                    <div className='mt-3 flex justify-end space-x-2'>
                                        <button
                                            onClick={() => {
                                                setReplyingTo(null);
                                                setReplyContent('');
                                            }}
                                            className='px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium'
                                            disabled={isSubmitting}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleReply(message.id)
                                            }
                                            disabled={
                                                !replyContent.trim() ||
                                                isSubmitting
                                            }
                                            className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            {isSubmitting
                                                ? 'Envoi...'
                                                : 'Envoyer la réponse'}
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>
                );
            })}
        </div>
    );
}
