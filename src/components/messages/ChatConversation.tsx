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
    messages: Message[];
}

interface ChatConversationProps {
    conversation: Conversation;
    userRole: string;
    currentUserId: string;
}

export function ChatConversation({ conversation, userRole, currentUserId }: ChatConversationProps) {
    const { data: session } = useSession();
    const [isExpanded, setIsExpanded] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [markedAsRead, setMarkedAsRead] = useState<Set<string>>(new Set());

    // Marquer automatiquement les messages reçus comme lus quand la conversation est ouverte
    useEffect(() => {
        if (isExpanded && session?.user?.id) {
            const unreadReceivedMessages = conversation.messages.filter(
                (msg) =>
                    !msg.isRead &&
                    msg.receiverId === session.user.id &&
                    !markedAsRead.has(msg.id),
            );

            unreadReceivedMessages.forEach(async (message) => {
                try {
                    await fetch(`/api/messages/${message.id}/read`, {
                        method: 'PUT',
                    });
                    setMarkedAsRead((prev) => new Set(prev).add(message.id));
                } catch (error) {
                    console.error(
                        'Erreur lors du marquage du message comme lu:',
                        error,
                    );
                }
            });
        }
    }, [isExpanded, conversation.messages, session?.user?.id, markedAsRead]);

    const handleReply = async () => {
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiverId: conversation.participantId,
                    content: replyContent,
                }),
            });

            if (response.ok) {
                setReplyContent('');
                // Recharger la page pour afficher le nouveau message
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.message || "Erreur lors de l'envoi du message");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du message:", error);
            alert("Erreur lors de l'envoi du message");
        } finally {
            setIsSubmitting(false);
        }
    };

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const isLastMessageFromMe = lastMessage?.senderId === currentUserId;

    return (
        <div className='bg-white rounded-lg shadow border'>
            {/* En-tête de la conversation */}
            <div 
                className='p-4 border-b cursor-pointer hover:bg-gray-50'
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className='flex justify-between items-center'>
                    <div className='flex items-center space-x-3'>
                        <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                            <span className='text-blue-600 font-semibold'>
                                {conversation.participantName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h3 className='font-semibold text-gray-900'>
                                {conversation.participantName}
                            </h3>
                            <p className='text-sm text-gray-500'>
                                {conversation.participantEmail}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center space-x-3'>
                        {conversation.unreadCount > 0 && (
                            <span className='bg-red-500 text-white text-xs rounded-full px-2 py-1'>
                                {conversation.unreadCount}
                            </span>
                        )}
                        <div className='text-right'>
                            <p className='text-sm text-gray-500'>
                                {formatDistanceToNow(new Date(conversation.lastMessage), {
                                    addSuffix: true,
                                    locale: fr,
                                })}
                            </p>
                            <p className='text-xs text-gray-400 truncate max-w-32'>
                                {isLastMessageFromMe ? 'Vous: ' : ''}
                                {lastMessage?.content.substring(0, 30)}
                                {lastMessage?.content.length > 30 ? '...' : ''}
                            </p>
                        </div>
                        <svg 
                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill='none' 
                            stroke='currentColor' 
                            viewBox='0 0 24 24'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Messages de la conversation */}
            {isExpanded && (
                <div className='max-h-96 overflow-y-auto'>
                    <div className='p-4 space-y-3'>
                        {conversation.messages.map((message) => {
                            const isSentByMe = message.senderId === currentUserId;
                            
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                            isSentByMe
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                        }`}
                                    >
                                        <p className='text-sm whitespace-pre-wrap'>
                                            {message.content}
                                        </p>
                                        <p className={`text-xs mt-1 ${
                                            isSentByMe ? 'text-blue-100' : 'text-gray-500'
                                        }`}>
                                            {formatDistanceToNow(new Date(message.createdAt), {
                                                addSuffix: true,
                                                locale: fr,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Formulaire de réponse */}
                    <div className='p-4 border-t bg-gray-50'>
                        <div className='flex space-x-2'>
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder='Tapez votre message...'
                                className='flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                                rows={2}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleReply();
                                    }
                                }}
                            />
                            <button
                                onClick={handleReply}
                                disabled={!replyContent.trim() || isSubmitting}
                                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isSubmitting ? 'Envoi...' : 'Envoyer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 