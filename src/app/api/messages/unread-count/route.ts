import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { message: 'Non autorisé' },
                { status: 401 },
            );
        }

        // Seuls les artisans peuvent voir le nombre de messages non lus
        if (session.user.role !== 'ARTISAN') {
            return NextResponse.json(
                { message: 'Non autorisé' },
                { status: 403 },
            );
        }

        // Compter les messages non lus reçus par l'artisan
        const count = await prisma.message.count({
            where: {
                receiverId: session.user.id,
                isRead: false,
            },
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error('Erreur lors du comptage des messages non lus:', error);
        return NextResponse.json(
            { message: 'Une erreur est survenue' },
            { status: 500 },
        );
    }
}
