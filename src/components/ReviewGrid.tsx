"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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

function getColCount(): number {
    if (typeof window === "undefined") return 5;
    const w = window.innerWidth;
    if (w >= 1280) return 5;
    if (w >= 1024) return 4;
    if (w >= 640)  return 3;
    return 2;
}

export function ReviewGridInner({
    defaultType = "All",
    hideHeader = false,
}: {
    defaultType?: "All" | "Movie" | "Series" | "Blog";
    hideHeader?: boolean;
}) {
    const [reviews, setReviews]               = useState<Review[]>([]);
    const [isLoading, setIsLoading]           = useState(true);
    const [isFiltering, setIsFiltering]       = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [visibleCount, setVisibleCount]     = useState(10);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const activeGenre  = searchParams.get("genre");
    const searchQuery  = searchParams.get("search");

    const fetchReviews = async (genre: string | null, search: string | null) => {
        if (reviews.length > 0) setIsFiltering(true);
        else setIsLoading(true);

        try {
            const url = new URL("/api/reviews", window.location.origin);
            url.searchParams.set("status", "APPROVED");
            if (genre)  url.searchParams.set("genre", genre);
            if (search) url.searchParams.set("search", search);
            if (defaultType !== "All") url.searchParams.set("type", defaultType);
            // Blogs have their own dedicated page — exclude from "All" grid
            if (defaultType === "All") url.searchParams.set("excludeType", "Blog");

            const res  = await fetch(url.toString());
            const data = await res.json();

            if (Array.isArray(data)) {
                const mapped: Review[] = data.map((item: any) => ({
                    id:          item.id,
                    slug:        item.slug,
                    title:       item.title,
                    posterImage: item.posterImage || "",
                    rating:      Number(item.rating) || 0,
                    genre:       item.genre || "",
                    authorName:  item.author?.name || "Unknown",
                    authorImage: item.author?.image || "",
                    category:    item.type,
                    publishDate: new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                    }),
                }));
                setReviews(mapped);
                setVisibleCount(getColCount() * 2);
            }
        } catch {
            // silent
        } finally {
            setIsLoading(false);
            setIsFiltering(false);
        }
    };

    useEffect(() => {
        fetchReviews(activeGenre, searchQuery);
    }, [activeGenre, searchQuery, defaultType]);

    /* ── Infinite scroll ── */
    useEffect(() => {
        if (isLoading || isFiltering || isFetchingMore) return;
        if (visibleCount >= reviews.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting) return;
                setIsFetchingMore(true);
                setTimeout(() => {
                    setVisibleCount(prev => prev + getColCount() * 2);
                    setIsFetchingMore(false);
                }, 600);
            },
            { rootMargin: "150px" }
        );

        const sentinel = loadMoreRef.current;
        if (sentinel) observer.observe(sentinel);
        return () => { if (sentinel) observer.unobserve(sentinel); };
    }, [isLoading, isFiltering, isFetchingMore, visibleCount, reviews.length]);

    const visibleReviews = reviews.slice(0, visibleCount);
    const hasMore        = visibleCount < reviews.length;

    return (
        <section className="w-full px-4 sm:px-5 pt-8 pb-12">

            {/* ── Section header ── */}
            {!hideHeader && (
                <div className="flex flex-col gap-3 mb-6">
                    {/* Filters — same line, right aligned */}
                    <div className="flex justify-end items-center gap-3">
                        <GenreDropdown />
                        <SearchBar compact={true} />
                    </div>
                    {/* Heading */}
                    <h2 className="section-heading w-full">All Reviews</h2>
                </div>
            )}

            {/* ── Loading skeletons ── */}
            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {/* ── Filtering overlay ── */}
            {!isLoading && isFiltering && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 opacity-40 pointer-events-none">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {/* ── Reviews ── */}
            {!isLoading && !isFiltering && (
                <>
                    {visibleReviews.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            <p className="font-[var(--font-serif)] text-2xl text-[var(--color-text-muted)] mb-2">
                                No reviews found
                            </p>
                            <p className="text-[10px] font-[var(--font-sans)] uppercase tracking-widest text-[var(--color-text-muted)]">
                                Try a different genre or search term
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                            {visibleReviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    {...review}
                                    isBlog={review.category === "Blog"}
                                />
                            ))}
                        </div>
                    )}

                    {/* Sentinel */}
                    {hasMore && (
                        <div
                            ref={loadMoreRef}
                            className="flex items-center justify-center gap-2 py-10"
                        >
                            {isFetchingMore && (
                                <>
                                    <div className="load-more-spinner" />
                                    <span className="text-[10px] font-[var(--font-sans)] uppercase tracking-widest text-[var(--color-text-muted)]">
                                        Loading more
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default function ReviewGrid(props: {
    defaultType?: "All" | "Movie" | "Series" | "Blog";
    hideHeader?: boolean;
}) {
    return (
        <Suspense fallback={null}>
            <ReviewGridInner {...props} />
        </Suspense>
    );
}
