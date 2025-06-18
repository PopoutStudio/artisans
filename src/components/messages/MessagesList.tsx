'use client';

import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
    id: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    sender?: {
        email: string;
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
    if (messages.length === 0) {
        return (
            <div className='text-center py-12'>
                <div className='text-gray-400 text-6xl mb-4'>📭</div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    {userRole === 'CLIENT'
                        ? 'Aucun message envoyé'
                        : 'Aucun message reçu'}
                </h3>
                <p className='text-gray-600'>
                    {userRole === 'CLIENT'
                        ? "Vous n'avez pas encore envoyé de messages aux artisans."
                        : "Vous n'avez pas encore reçu de messages de clients."}
                </p>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                        message.isRead ? 'border-gray-200' : 'border-blue-500'
                    }`}
                >
                    <div className='flex justify-between items-start mb-4'>
                        <div>
                            <h3 className='font-semibold text-gray-900'>
                                {userRole === 'CLIENT'
                                    ? `À ${
                                          message.receiver?.artisan?.name ||
                                          message.receiver?.email
                                      }`
                                    : `De ${message.sender?.email}`}
                            </h3>
                            <p className='text-sm text-gray-500'>
                                {formatDistanceToNow(
                                    new Date(message.createdAt),
                                    {
                                        addSuffix: true,
                                        locale: fr,
                                    },
                                )}
                            </p>
                        </div>
                        {!message.isRead && userRole === 'ARTISAN' && (
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                Nouveau
                            </span>
                        )}
                    </div>

                    <div className='prose max-w-none'>
                        <p className='text-gray-700 whitespace-pre-wrap'>
                            {message.content}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
