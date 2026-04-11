"use client";

import Image from "next/image";
import Link from "next/link";
import RatingStars from "./RatingStars";

interface ReviewCardProps {
    id: string;
    slug: string;
    title: string;
    posterImage: string;
    rating: number;
    genre: string;
    authorName: string;
    authorImage: string;
    category?: string;
    publishDate?: string;
    isBlog?: boolean;
}

export default function ReviewCard({ slug, title, posterImage, rating, genre, authorName, authorImage, category = "Movie", publishDate = "Just now", isBlog = false }: ReviewCardProps) {
    return (
        <div className="group flex flex-col w-full bg-white dark:bg-zinc-900 overflow-hidden transition-all cursor-pointer border-2 border-transparent hover:border-black dark:hover:border-white">
            <Link href={`/reviews/${slug}`} className="flex flex-col w-full">
                {/* Poster Image */}
                <div className="w-full relative overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-4" style={{ aspectRatio: "2 / 3" }}>
                    <Image
                        src={posterImage}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 will-change-transform"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                    />
                    {/* Badge */}
                    <div className="absolute top-0 left-0 bg-[var(--color-brand)] px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest z-10">
                        {category}
                    </div>
                </div>

                {/* Content Details */}
                <div className="flex flex-col px-3">
                    {!isBlog && (
                        <div className="flex items-center gap-1 mb-1.5 pt-2">
                            <RatingStars rating={rating} size="sm" />
                        </div>
                    )}
                    
                    <h3 className="text-black dark:text-white font-serif font-black text-xl md:text-2xl leading-tight line-clamp-3 mb-3 group-hover:text-[var(--color-brand)] transition-colors">
                        {title}
                    </h3>

                    <div className="flex items-center pt-2 pb-3 border-t-2 border-gray-100 dark:border-zinc-800 transition-colors mt-3">
                        <span className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            By {authorName}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
