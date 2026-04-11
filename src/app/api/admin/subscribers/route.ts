import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const subscribers = await prisma.subscriber.findMany({
            orderBy: { subscribedAt: 'desc' }
        });

        // Try to match subscribers with registered users to get their full name
        const emails = subscribers.map(s => s.email);
        const users = await prisma.user.findMany({
            where: { email: { in: emails } },
            select: { email: true, name: true }
        });

        const updatedSubscribers = subscribers.map(sub => {
            const userMatch = users.find(u => u.email === sub.email);
            return {
                ...sub,
                name: userMatch ? userMatch.name : "Newsletter Guest"
            };
        });

        return NextResponse.json(updatedSubscribers);
    } catch (error) {
        console.error("GET Subscribers Error:", error);
        return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
    }
}
