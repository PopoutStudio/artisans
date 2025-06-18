import { COMMUNES, Commune, SERVICES, Service } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { message: 'Non autorisé' },
                { status: 401 },
            );
        }

        const { name, description, services, commune, codePostal } =
            await req.json();

        if (!name) {
            return NextResponse.json(
                { message: 'Le nom est requis' },
                { status: 400 },
            );
        }

        // Validation des services
        if (services && Array.isArray(services)) {
            const invalidServices = services.filter(
                (service) => !SERVICES.includes(service as Service),
            );
            if (invalidServices.length > 0) {
                return NextResponse.json(
                    {
                        message: `Services invalides: ${invalidServices.join(
                            ', ',
                        )}`,
                    },
                    { status: 400 },
                );
            }
        }

        // Validation de la commune
        if (commune && !COMMUNES.includes(commune as Commune)) {
            return NextResponse.json(
                {
                    message: `Commune invalide: ${commune}`,
                },
                { status: 400 },
            );
        }

        const artisan = await prisma.artisan.update({
            where: {
                userId: session.user.id,
            },
            data: {
                name,
                description,
                services,
                commune: commune || null,
                codePostal: codePostal || null,
            },
        });

        return NextResponse.json(artisan);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        return NextResponse.json(
            { message: 'Une erreur est survenue' },
            { status: 500 },
        );
    }
}
