import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text, reviewId } = body;

        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized. Please login to comment." }, { status: 401 });
        }

        if (!text || !reviewId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newComment = await (prisma as any).comment.create({
            data: {
                text,
                reviewId,
                userId: session.id,
            },
            include: { user: true }
        });

        return NextResponse.json(newComment);
    } catch (error) {
        console.error("POST Comment Error:", error);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}
