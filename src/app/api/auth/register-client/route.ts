import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: 'Tous les champs sont requis' },
                { status: 400 },
            );
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'Cet email est déjà utilisé' },
                { status: 400 },
            );
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur avec le rôle CLIENT
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'CLIENT',
            },
        });

        return NextResponse.json(
            { message: 'Inscription client réussie' },
            { status: 201 },
        );
    } catch (error) {
        console.error("Erreur lors de l'inscription client:", error);
        return NextResponse.json(
            { message: 'Une erreur est survenue' },
            { status: 500 },
        );
    }
}
