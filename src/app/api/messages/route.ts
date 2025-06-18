import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { message: 'Non autorisé' },
                { status: 401 },
            );
        }

        // Vérifier que l'utilisateur est un client
        if (session.user.role !== 'CLIENT') {
            return NextResponse.json(
                { message: 'Seuls les clients peuvent envoyer des messages' },
                { status: 403 },
            );
        }

        const { receiverId, content } = await req.json();

        if (!receiverId || !content) {
            return NextResponse.json(
                { message: 'Destinataire et contenu requis' },
                { status: 400 },
            );
        }

        // Vérifier que le destinataire existe et est un artisan
        const receiver = await prisma.user.findUnique({
            where: { id: receiverId },
            include: { artisan: true },
        });

        if (!receiver || !receiver.artisan) {
            return NextResponse.json(
                { message: 'Destinataire non trouvé' },
                { status: 404 },
            );
        }

        // Vérifier que l'expéditeur n'essaie pas de s'envoyer un message à lui-même
        if (session.user.id === receiverId) {
            return NextResponse.json(
                {
                    message:
                        'Vous ne pouvez pas vous envoyer un message à vous-même',
                },
                { status: 400 },
            );
        }

        // Créer le message
        const message = await prisma.message.create({
            data: {
                senderId: session.user.id,
                receiverId,
                content: content.trim(),
            },
        });

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
        return NextResponse.json(
            { message: 'Une erreur est survenue' },
            { status: 500 },
        );
    }
}
