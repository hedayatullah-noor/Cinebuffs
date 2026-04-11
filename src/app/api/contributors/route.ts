import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        let contributors;
        try {
            // Try with bio field
            contributors = await (prisma.user as any).findMany({
                where: {
                    role: { in: ["ADMIN", "MODERATOR"] }
                },
                select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                    bio: true
                },
                orderBy: { name: 'asc' }
            });
        } catch (dbError: any) {
            // Fallback if bio column doesn't exist yet
            console.warn("Bio column missing, falling back...");
            contributors = await (prisma.user as any).findMany({
                where: {
                    role: { in: ["ADMIN", "MODERATOR"] }
                },
                select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true
                },
                orderBy: { name: 'asc' }
            });
            // Add empty bio to each contributor
            contributors = contributors.map((c: any) => ({ ...c, bio: "" }));
        }

        return NextResponse.json(contributors);
    } catch (error) {
        console.error("Contributors Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch contributors" }, { status: 500 });
    }
}
