import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const body = await req.json();

        const {
            title,
            content,
            rating,
            genre,
            type,
            director,
            cast,
            availableOn,
            posterImage,
            gallery,
            authorId
        } = body;

        let updatedReview;

        try {
            // Standard Prisma Update
            updatedReview = await (prisma.review as any).update({
                where: { slug },
                data: {
                    title,
                    content,
                    rating,
                    genre,
                    type,
                    posterImage,
                    director,
                    cast,
                    availableOn,
                    gallery,
                    authorId: authorId || undefined
                }
            });
        } catch (firstError: any) {
            console.log("Prisma update failed with new fields. Falling back to raw SQL for strict schema.");

            const dataToUpdate: any = {
                title, content, rating, genre, type, posterImage
            };

            // Standard Prisma update for older columns
            updatedReview = await prisma.review.update({
                where: { slug },
                data: dataToUpdate
            });

            // Raw SQL update for uncompiled columns
            try {
                const c = cast || null;
                const d = director || null;
                const a = availableOn || null;
                const g = gallery || null;

                await prisma.$executeRaw`UPDATE "Review" SET "cast" = ${c}, "director" = ${d}, "availableOn" = ${a}, "gallery" = ${g} WHERE "slug" = ${slug}`;

                (updatedReview as any).cast = c;
                (updatedReview as any).director = d;
                (updatedReview as any).availableOn = a;
                (updatedReview as any).gallery = g;
            } catch (rawError: any) {
                console.error("Execute raw also failed:", rawError.message);
            }
        }

        return NextResponse.json(updatedReview);

    } catch (error) {
        console.error("PUT Admin Review Error:", error);
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;

        await prisma.review.delete({
            where: { slug }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Admin Review Error:", error);
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }
}
