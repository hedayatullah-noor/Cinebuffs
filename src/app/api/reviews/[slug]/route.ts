import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        let review;
        try {
            review = await prisma.review.findFirst({
                where: { slug },
                include: {
                    author: true,
                    // @ts-ignore
                    comments: {
                        include: { user: true },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });
        } catch (err: any) {
            console.log("Failed to include comments (probably missing table). Fetching without comments...");
            review = await prisma.review.findFirst({
                where: { slug },
                include: { author: true }
            });
        }

        if (!review) {
            console.log("NOT FOUND SLUG:", slug);
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // Bypassing stale Prisma JS that strips uncompiled columns
        try {
            const rawQuery: any[] = await prisma.$queryRaw`SELECT "cast", "director", "availableOn", "gallery" FROM "Review" WHERE "slug" = ${slug}`;
            if (rawQuery && rawQuery.length > 0) {
                const row = rawQuery[0];
                if (row.cast) (review as any).cast = row.cast;
                if (row.director) (review as any).director = row.director;
                if (row.availableOn) (review as any).availableOn = row.availableOn;
                if (row.gallery) (review as any).gallery = row.gallery;
            }
        } catch (rawError: any) {
            console.error("Failed to query raw fields:", rawError.message);
        }

        return NextResponse.json(review);
    } catch (error) {
        console.error("GET Single Review Error:", error);
        return NextResponse.json({ error: "Failed to fetch review" }, { status: 500 });
    }
}
