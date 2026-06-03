import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
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
            sliderImage,   // ← NEW
            gallery,
            authorId,
        } = body;

        let updatedReview: any;

        try {
            updatedReview = await (prisma.review as any).update({
                where: { slug },
                data: {
                    title,
                    content,
                    rating,
                    genre,
                    type,
                    posterImage,
                    sliderImage: sliderImage ?? null,  // ← NEW (null clears it)
                    director,
                    cast,
                    availableOn,
                    gallery,
                    authorId: authorId || undefined,
                },
            });
        } catch (firstError: any) {
            console.log("Prisma update failed, falling back to raw SQL for strict schema.");

            updatedReview = await prisma.review.update({
                where: { slug },
                data:  { title, content, rating, genre, type, posterImage },
            });

            try {
                const c = cast        || null;
                const d = director    || null;
                const a = availableOn || null;
                const g = gallery     || null;
                const si = sliderImage || null;

                // MySQL raw update — backtick column names
                await prisma.$executeRaw`
                    UPDATE \`Review\`
                    SET \`cast\` = ${c},
                        \`director\` = ${d},
                        \`availableOn\` = ${a},
                        \`gallery\` = ${g},
                        \`sliderImage\` = ${si}
                    WHERE \`slug\` = ${slug}
                `;

                updatedReview.cast        = c;
                updatedReview.director    = d;
                updatedReview.availableOn = a;
                updatedReview.gallery     = g;
                (updatedReview as any).sliderImage = si;
            } catch (rawError: any) {
                console.error("Execute raw also failed:", rawError.message);
            }
        }

        return NextResponse.json(updatedReview);
    } catch (error) {
        console.error("PUT Admin Review Error:", error);
        return NextResponse.json(
            { error: "Failed to update review" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        await prisma.review.delete({ where: { slug } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Admin Review Error:", error);
        return NextResponse.json(
            { error: "Failed to delete review" },
            { status: 500 }
        );
    }
}
