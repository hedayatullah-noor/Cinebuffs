import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }

        const newSubscriber = await prisma.subscriber.create({
            data: { email }
        });

        return NextResponse.json(newSubscriber, { status: 201 });
    } catch (error: any) {
        console.error("POST Subscribe Error:", error);
        if (error.code === 'P2002') {
            // Unique constraint violation (already subscribed)
            return NextResponse.json({ error: "Email already subscribed" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }
}
