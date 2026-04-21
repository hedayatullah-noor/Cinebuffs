"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReviewCard from "./ReviewCard";
import SkeletonCard from "./SkeletonCard";
import GenreDropdown from "./GenreDropdown";
import SearchBar from "./SearchBar";

interface Review {
    id: string;
    slug: string;
    title: string;
    posterImage: string;
    rating: number;
    genre: string;
    authorName: string;
    authorImage: string;
    category: string;
    publishDate: string;
}

export function ReviewGridInner({ defaultType = "All", hideHeader = false }: { defaultType?: "All" | "Movie" | "Series" | "Blog", hideHeader?: boolean }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [visibleCount, setVisibleCount] = useState(10);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const activeGenre = searchParams.get('genre');
    const searchQuery = searchParams.get('search');

    const fetchReviews = async (genreFilter: string | null, searchFilter: string | null) => {
        if (reviews.length > 0) setIsFiltering(true);
        else setIsLoading(true);

        try {
            const url = new URL("/api/reviews", window.location.origin);
            url.searchParams.set("status", "APPROVED"); // Only approved reviews on homepage
            if (genreFilter) url.searchParams.set("genre", genreFilter);
            if (searchFilter) url.searchParams.set("search", searchFilter);
            if (defaultType !== "All") url.searchParams.set("type", defaultType);

            const response = await fetch(url.toString());
            const data = await response.json();

            if (Array.isArray(data)) {
                const mappedReviews: Review[] = data.map((item: any) => ({
                    id: item.id,
                    slug: item.slug,
                    title: item.title,
                    posterImage: item.posterImage || "",
                    rating: Number(item.rating) || 0,
                    genre: item.genre || "",
                    authorName: item.author?.name || "Unknown Author",
                    authorImage: item.author?.image || "",
                    category: item.type,
                    publishDate: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                }));
                setReviews(mappedReviews);
                
                // Calculate initial count to exactly 2 rows based on screen width
                const width = window.innerWidth;
                let initialCount = 10;
                if (width >= 1280) initialCount = 10; // xl: 5 cols (10)
                else if (width >= 1024) initialCount = 6; // lg: 3 cols (6)
                else if (width >= 640) initialCount = 4; // sm: 2 cols (4)
                else initialCount = 2; // base: 1 col (2)
                setVisibleCount(initialCount);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setIsLoading(false);
            setIsFiltering(false);
        }
    };

    useEffect(() => {
        fetchReviews(activeGenre, searchQuery);
    }, [activeGenre, searchQuery, defaultType]);

    // Infinite scroll observer
    useEffect(() => {
        if (isLoading || isFiltering || visibleCount >= reviews.length) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Calculate how many to load (load 2 more rows at a time)
                let cols = 5;
                const width = window.innerWidth;
                if (width < 640) cols = 1;
                else if (width < 1024) cols = 2;
                else if (width < 1280) cols = 3;

                setVisibleCount(prev => Math.min(prev + (cols * 2), reviews.length));
            }
        }, { rootMargin: "150px" });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [visibleCount, reviews.length, isLoading, isFiltering]);

    const getHeadingText = () => {
        if (searchQuery) return `Search Results: "${searchQuery}"`;
        if (activeGenre) return `${activeGenre} Reviews`;
        if (defaultType !== "All") return defaultType === "Blog" ? "Latest Blogs" : `${defaultType} Reviews`;
        return "All Reviews";
    };

    return (
        <div className="w-full max-w-[1500px] mx-auto px-6 pb-12 pt-0">
            {/* Category selection row above heading */}
            <div className="mb-6">
                <GenreDropdown />
            </div>

            {!hideHeader && (
                <div className="flex flex-col md:flex-row justify-start items-start md:items-end mb-10 border-b-2 border-black dark:border-white pb-4 gap-8">
                    <div className="shrink-0">
                        <h2 className="text-4xl md:text-5xl font-black font-serif text-black dark:text-white uppercase tracking-tighter break-words leading-tight">
                            {getHeadingText()}
                        </h2>
                        <div className="w-20 h-1 mt-3 bg-[var(--color-brand)] rounded-none mr-auto"></div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto md:pb-1">
                        <SearchBar compact={true} />
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 xl:gap-8">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonCard key={`skel-${i}`} />
                    ))}
                </div>
            ) : (
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 xl:gap-8 items-start transition-opacity duration-300 ${isFiltering ? 'opacity-40 animate-pulse' : 'opacity-100'}`}>
                    {reviews.length > 0 ? (
                        <>
                            {reviews.slice(0, visibleCount).map((review) => (
                                <ReviewCard key={review.id} {...review} isBlog={defaultType === "Blog" || review.category === "Blog"} />
                            ))}
                            
                            {/* Sentinel for infinite scroll */}
                            {visibleCount < reviews.length && (
                                <div ref={loadMoreRef} className="col-span-full flex justify-center py-10 my-4 border-t-2 border-transparent">
                                    <div className="flex gap-2 items-center">
                                        <div className="w-2.5 h-2.5 bg-[var(--color-brand)] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-2.5 h-2.5 bg-[var(--color-brand)] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                        <div className="w-2.5 h-2.5 bg-[var(--color-brand)] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                        <span className="ml-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Loading</span>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 px-4 text-center bg-gray-50 dark:bg-zinc-900 border-2 border-dashed border-gray-300 dark:border-zinc-800 transition-colors">
                            <h3 className="text-2xl font-black text-gray-400 dark:text-gray-600 font-serif uppercase tracking-[0.2em]">Zero Records Found</h3>
                            <p className="text-gray-500 dark:text-gray-500 mt-4 font-black uppercase tracking-widest text-[10px]">Your search query did not yield any cinematic matches.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ReviewGrid(props: { defaultType?: "All" | "Movie" | "Series" | "Blog", hideHeader?: boolean }) {
    return (
        <Suspense fallback={<div className="w-full max-w-[1500px] mx-auto px-6 py-12">Loading...</div>}>
            <ReviewGridInner {...props} />
        </Suspense>
    );
}
