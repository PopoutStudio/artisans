import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { message: 'Non autorisé' },
                { status: 401 },
            );
        }

        const { originalMessageId, content } = await req.json();

        if (!originalMessageId || !content) {
            return NextResponse.json(
                { message: 'ID du message original et contenu requis' },
                { status: 400 },
            );
        }

        // Récupérer le message original
        const originalMessage = await prisma.message.findUnique({
            where: { id: originalMessageId },
            include: {
                sender: true,
            },
        });

        if (!originalMessage) {
            return NextResponse.json(
                { message: 'Message original non trouvé' },
                { status: 404 },
            );
        }

        // Vérifier que l'utilisateur est bien le destinataire du message original
        if (originalMessage.receiverId !== session.user.id) {
            return NextResponse.json(
                { message: 'Non autorisé à répondre à ce message' },
                { status: 403 },
            );
        }

        // Vérifier que l'expéditeur et le destinataire ont des rôles différents
        if (originalMessage.sender.role === session.user.role) {
            return NextResponse.json(
                {
                    message:
                        "Vous ne pouvez répondre qu'aux messages d'utilisateurs ayant un rôle différent",
                },
                { status: 400 },
            );
        }

        // Créer la réponse (l'utilisateur actuel devient l'expéditeur, l'expéditeur original devient le destinataire)
        const reply = await prisma.message.create({
            data: {
                senderId: session.user.id, // L'utilisateur actuel répond
                receiverId: originalMessage.senderId, // L'expéditeur original reçoit la réponse
                content: content.trim(),
            },
        });

        return NextResponse.json(reply, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de l'envoi de la réponse:", error);
        return NextResponse.json(
            { message: 'Une erreur est survenue' },
            { status: 500 },
        );
    }
}
