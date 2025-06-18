import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { message: 'Non autorisé' },
                { status: 401 },
            );
        }

        const { id } = await params;

        // Vérifier que le message existe et appartient à l'utilisateur
        const message = await prisma.message.findUnique({
            where: { id },
        });

        if (!message) {
            return NextResponse.json(
                { message: 'Message non trouvé' },
                { status: 404 },
            );
        }

        // Seuls les destinataires peuvent marquer un message comme lu
        if (message.receiverId !== session.user.id) {
            return NextResponse.json(
                { message: 'Non autorisé' },
                { status: 403 },
            );
        }

        // Marquer le message comme lu
        const updatedMessage = await prisma.message.update({
            where: { id },
            data: { isRead: true },
        });

        return NextResponse.json(updatedMessage);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du message:', error);
        return NextResponse.json(
            { message: 'Une erreur est survenue' },
            { status: 500 },
        );
    }
}
