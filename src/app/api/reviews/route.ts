import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const genre       = searchParams.get('genre');
        const type        = searchParams.get('type');
        const excludeType = searchParams.get('excludeType');  // ← NEW
        const status      = searchParams.get('status') || 'APPROVED';
        const authorId    = searchParams.get('authorId');
        const limitStr    = searchParams.get('limit');
        const limit       = limitStr ? parseInt(limitStr) : undefined;
        const search      = searchParams.get('search');

        const baseFilter: any = {
            status: status !== 'ALL' ? status : undefined,
        };
        if (genre)                    baseFilter.genre    = genre;
        if (type && type !== 'All')   baseFilter.type     = type;
        if (excludeType)              baseFilter.type     = { not: excludeType };  // ← NEW
        if (authorId)                 baseFilter.authorId = authorId;

        let finalWhere: any = { ...baseFilter };

        if (search) {
            finalWhere = {
                AND: [
                    baseFilter,
                    {
                        OR: [
                            { title:    { contains: search } },
                            { slug:     { contains: search } },
                            { genre:    { contains: search } },
                            { cast:     { contains: search } },
                            { director: { contains: search } },
                            { author:   { name: { contains: search } } },
                        ],
                    },
                ],
            };
        }

        const reviews = await prisma.review.findMany({
            where:   finalWhere,
            orderBy: { createdAt: 'desc' },
            select: {
                id:          true,
                title:       true,
                slug:        true,
                posterImage: true,
                sliderImage: true,   // ← NEW
                rating:      true,
                genre:       true,
                type:        true,
                authorId:    true,
                status:      true,
                createdAt:   true,
                author: {
                    select: { id: true, name: true, image: true },
                },
            },
            take: limit,
        });

        return NextResponse.json(reviews);
    } catch (error: any) {
        console.error("GET Reviews Error:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData   = await req.formData();
        const mediaType  = formData.get("mediaType") as string;
        const title      = formData.get("title") as string;
        const content    = formData.get("content") as string;
        const genre      = formData.get("genre") as string;
        const rating     = parseFloat(formData.get("rating") as string) || 0;
        const director   = formData.get("director") as string || null;
        const cast       = formData.get("cast") as string || null;
        const availableOn = formData.get("availableOn") as string || null;
        const posterImage = formData.get("posterImage") as string || "";
        const sliderImage = formData.get("sliderImage") as string || null;  // ← NEW
        const gallery    = formData.get("gallery") as string || null;
        const authorOverride = formData.get("authorOverride") as string || null;

        if (!title || !content || !posterImage) {
            return NextResponse.json(
                { error: "Title, content and poster image are required" },
                { status: 400 }
            );
        }

        // Slug generation
        const baseSlug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        const uniqueSlug = `${baseSlug}--${Date.now()}`;

        const authorId = authorOverride || (session.id as string);

        const review = await (prisma.review as any).create({
            data: {
                title,
                slug:        uniqueSlug,
                posterImage,
                sliderImage,   // ← NEW
                rating,
                genre:       genre || (mediaType === 'Blog' ? 'Blog Post' : ''),
                type:        mediaType,
                authorId,
                content,
                director,
                cast,
                availableOn,
                gallery,
                status:      session.role === 'ADMIN' || session.role === 'MODERATOR'
                               ? 'APPROVED'
                               : 'PENDING',
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error: any) {
        console.error("POST Review Error:", error.message);
        return NextResponse.json(
            { error: "Failed to create review" },
            { status: 500 }
        );
    }
}
