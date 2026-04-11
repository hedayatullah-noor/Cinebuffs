import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const genre = searchParams.get('genre');
        const type = searchParams.get('type');
        const status = searchParams.get('status') || 'APPROVED';
        const authorId = searchParams.get('authorId');
        const limitStr = searchParams.get('limit');
        const limit = limitStr ? parseInt(limitStr) : undefined;
        const search = searchParams.get('search');

        const baseFilter: any = { status: status !== 'ALL' ? status : undefined };
        if (genre) baseFilter.genre = genre;
        if (type && type !== 'All') baseFilter.type = type;
        if (authorId) baseFilter.authorId = authorId;

        let finalWhere: any = { ...baseFilter };

        if (search) {
            const searchLower = search.toLowerCase();
            finalWhere = {
                AND: [
                    baseFilter,
                    {
                        OR: [
                            { title: { contains: search } },
                            { title: { contains: searchLower } },
                            { slug: { contains: searchLower } },
                            { genre: { contains: search } },
                            { cast: { contains: search } },
                            { director: { contains: search } },
                            { author: { name: { contains: search } } },
                            { author: { name: { contains: searchLower } } },
                            { authorId: { contains: search } }
                        ]
                    }
                ]
            };
        }

        console.log("DEBUG: Final Database Filter:", JSON.stringify(finalWhere));

        const reviews = await prisma.review.findMany({
            where: finalWhere,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                posterImage: true,
                rating: true,
                genre: true,
                type: true,
                authorId: true,
                status: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            take: limit
        });

        console.log(`DEBUG: Found ${reviews.length} reviews. Search query: "${search}"`);

        return NextResponse.json(reviews);
    } catch (error: any) {
        console.error("GET Reviews Error Details:", {
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack
        });
        return NextResponse.json({ 
            error: "Failed to fetch reviews", 
            details: error.message,
            prismaCode: error.code
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // Here we'll read formData
        const formData = await req.formData();

        const type = formData.get("mediaType") as string;
        const title = formData.get("title") as string;
        const cast = formData.get("cast") as string;
        const director = formData.get("director") as string;
        const genre = formData.get("genre") as string;
        const availableOn = formData.get("availableOn") as string;
        const content = formData.get("content") as string;

        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized. You must be logged in to post reviews." }, { status: 401 });
        }

        const isAdmin = session.role === "ADMIN";
        const authorOverride = formData.get("authorOverride") as string;
        const actualAuthorId = (isAdmin && authorOverride) ? authorOverride : session.id as string;

        if (!actualAuthorId) {
            return NextResponse.json({ error: "Failed to determine author" }, { status: 400 });
        }

        const posterImageURL = formData.get("posterImage") as string || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=400";
        const galleryURLs = formData.get("gallery") as string;
        const ratingStr = formData.get("rating") as string;
        const parsedRating = ratingStr ? parseFloat(ratingStr) : 0;

        const safeTitle = title || "Untitled Review";

        // Determine if user is Admin to auto-approve (Moderator posts stay PENDING)
        let initialStatus = "PENDING";
        if (actualAuthorId) {
            const authorData = await prisma.user.findUnique({ where: { id: actualAuthorId } });
            if (authorData && authorData.role === "ADMIN") {
                initialStatus = "APPROVED";
            }
        }

        let createData: any = {
            title: safeTitle,
            slug: safeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
            type,
            genre,
            content: content || "No content",
            rating: parsedRating,
            posterImage: posterImageURL,
            authorId: actualAuthorId,
            status: initialStatus
        };

        // Try to attach new fields without blowing up if Prisma is older
        if (cast) createData.cast = cast;
        if (director) createData.director = director;
        if (availableOn) createData.availableOn = availableOn;
        if (galleryURLs) createData.gallery = galleryURLs;

        let newReview;
        try {
            newReview = await (prisma.review as any).create({
                data: createData
            });
        } catch (firstError: any) {
            console.log("Prisma failed with new fields. Falling back to old schema shape.");
            // Remove the new fields that might not exist in the stale Prisma client
            delete createData.cast;
            delete createData.director;
            delete createData.availableOn;
            delete createData.gallery;

            newReview = await (prisma.review as any).create({
                data: createData
            });

            // Bypass stale JS compilation by updating via Raw SQL directly!
            try {
                const c = cast || null;
                const d = director || null;
                const a = availableOn || null;
                const g = galleryURLs || null;

                await prisma.$executeRaw`UPDATE "Review" SET "cast" = ${c}, "director" = ${d}, "availableOn" = ${a}, "gallery" = ${g} WHERE "slug" = ${createData.slug}`;

                // mutate newReview so response includes it
                newReview.cast = c;
                newReview.director = d;
                newReview.availableOn = a;
                newReview.gallery = g;
            } catch (sqlErr: any) {
                console.error("Execute raw also failed:", sqlErr.message);
            }
        }

        return NextResponse.json(newReview);
    } catch (error: any) {
        console.error("POST Review Error:", error);
        return NextResponse.json({ error: "Failed to create review", details: error.message }, { status: 500 });
    }
}
