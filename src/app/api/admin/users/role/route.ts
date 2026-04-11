import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId, role } = await req.json();

        if (!userId || !role) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });

        return NextResponse.json({ message: 'Role updated', user: updatedUser });
    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
