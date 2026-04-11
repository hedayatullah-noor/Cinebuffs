import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const totalUsers = await prisma.user.count();
        const totalReviews = await prisma.review.count();
        const approvedReviews = await prisma.review.count({ where: { status: "APPROVED" } });
        const pendingReviews = await prisma.review.count({ where: { status: "PENDING" } });
        const totalSubscribers = await prisma.subscriber.count();

        return NextResponse.json({
            users: totalUsers,
            reviews: totalReviews,
            approved: approvedReviews,
            pending: pendingReviews,
            subscribers: totalSubscribers
        });
    } catch (error: any) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: "Failed to fetch stats", details: error.message }, { status: 500 });
    }
}
