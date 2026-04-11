import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await (prisma.user as any).findUnique({
        where: { id: session.id as string },
        select: { id: true, name: true, email: true, role: true, image: true }
    });

    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(user);
}

export async function PUT(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, email, password, image, bio } = await req.json();

        const dataToUpdate: any = {};
        if (name) dataToUpdate.name = name;
        if (email) dataToUpdate.email = email;
        if (image !== undefined) dataToUpdate.image = image;
        if (bio !== undefined) dataToUpdate.bio = bio;

        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const user = await (prisma.user as any).update({
            where: { id: session.id as string },
            data: dataToUpdate,
            select: { id: true, name: true, email: true, role: true, image: true }
        });

        return NextResponse.json(user);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
