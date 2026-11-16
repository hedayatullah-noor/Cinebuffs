import { MetadataRoute } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://cinebuffs.org";

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
        { url: `${baseUrl}/movies`,       lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
        { url: `${baseUrl}/series`,       lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
        { url: `${baseUrl}/blog`,         lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
        { url: `${baseUrl}/contributors`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/about`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/contact`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/subscribe`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ];

    // Dynamic review pages
    let reviewPages: MetadataRoute.Sitemap = [];
    try {
        const reviews = await prisma.review.findMany({
            where: { status: "APPROVED" },
            select: { slug: true, updatedAt: true },
            orderBy: { updatedAt: "desc" },
        });

        reviewPages = reviews.map((review) => ({
            url: `${baseUrl}/reviews/${review.slug}`,
            lastModified: review.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch (e) {
        console.error("Sitemap: failed to fetch reviews", e);
    } finally {
        await prisma.$disconnect();
    }

    return [...staticPages, ...reviewPages];
}
