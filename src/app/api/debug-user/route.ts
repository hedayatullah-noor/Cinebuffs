import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const adminEmail = "admin@cinebuffs.org";
        const user = await prisma.user.findUnique({
            where: { email: adminEmail },
            select: { id: true, email: true, name: true, role: true }
        });

        if (!user) {
            return NextResponse.json({ error: "Admin user not found in database!" }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "User found",
            user: user
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
