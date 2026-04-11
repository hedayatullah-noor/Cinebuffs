import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const reviews = await (prisma.review as any).findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                rating: true,
                type: true,
                genre: true,
                status: true,
                createdAt: true,
                author: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(reviews);
    } catch (error: any) {
        console.error("GET All Reviews Error:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { reviewId, status } = body;

        if (!reviewId || !status) {
            return NextResponse.json({ error: "Missing reviewId or status" }, { status: 400 });
        }

        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: { status }
        });

        return NextResponse.json(updatedReview);
    } catch (error: any) {
        console.error("PATCH Review Status Error:", error);
        return NextResponse.json({ error: "Failed to update review status" }, { status: 500 });
    }
}
