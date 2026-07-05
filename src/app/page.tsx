"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ChevronRight, Mail } from "lucide-react";
import HeroSlider  from "@/components/HeroSlider";
import ReviewCard from "@/components/ReviewCard";
import SkeletonCard from "@/components/SkeletonCard";
import GenreDropdown from "@/components/GenreDropdown";
import SearchBar from "@/components/SearchBar";

/* ─── Inline subscribe form (used in Latest Reviews section) ─── */
function InlineSubscribeForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes("@")) { setStatus("error"); return; }
        setStatus("loading");
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            setStatus(res.ok ? "success" : "error");
            if (res.ok) setEmail("");
        } catch {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div style={{ padding: "1.5rem", backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--color-brand)", marginBottom: 4 }}>You're on the list!</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Check your inbox.</p>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", padding: "1rem", display: "flex", flexDirection: "column", gap: 10, height: "100%", justifyContent: "center", minWidth: 0, overflow: "hidden", boxSizing: "border-box" }}>
            {/* Icon */}
            <div style={{ width: 32, height: 32, border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail style={{ width: 14, height: 14, color: "var(--color-text-main)" }} />
            </div>

            <div>
                <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--color-text-main)", margin: "0 0 4px" }}>
                    Stay Updated
                </h4>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "var(--color-text-muted)", lineHeight: 1.4, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Join cinephiles. Get weekly top reviews straight to your inbox.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    style={{
                        padding: "8px 10px", fontFamily: "var(--font-sans)", fontSize: 11,
                        border: `1px solid ${status === "error" ? "var(--color-brand)" : "var(--color-border)"}`,
                        backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-main)", outline: "none",
                        width: "100%", boxSizing: "border-box", minWidth: 0,
                    }}
                    onFocus={e => (e.target.style.borderColor = "var(--color-brand)")}
                    onBlur={e => (e.target.style.borderColor = status === "error" ? "var(--color-brand)" : "var(--color-border)")}
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    style={{
                        padding: "8px", backgroundColor: "var(--color-brand)", color: "#fff",
                        border: "none", fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer",
                        opacity: status === "loading" ? 0.7 : 1,
                        width: "100%", boxSizing: "border-box",
                    }}
                >
                    {status === "loading" ? "Subscribing..." : "Subscribe Now →"}
                </button>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 8, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0, textAlign: "center" }}>
                    No spam, ever.
                </p>
            </form>
        </div>
    );
}

/* ─── Section heading ─── */
function SectionHeading({ title }: { title: string }) {
    return (
        <div style={{ paddingBottom: "0.5rem", borderBottom: "2px solid var(--color-text-main)", marginBottom: "1.5rem" }}>
            <h2 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "var(--color-text-main)",
                margin: 0,
                lineHeight: 1.15,
                letterSpacing: "0.01em",
            }}>
                {title}
            </h2>
        </div>
    );
}

/* ─── View All button — centered at bottom of section ─── */
function ViewAllButton({ href, label = "View All" }: { href: string; label?: string }) {
    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2.5rem" }}>
            <a
                href={href}
                style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 44px",
                    border: "2px solid var(--color-text-main)",
                    fontFamily: "var(--font-sans)",
                    fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.14em",
                    color: "var(--color-text-main)", textDecoration: "none",
                    transition: "all 0.2s ease",
                    backgroundColor: "transparent",
                }}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = "var(--color-brand)";
                    el.style.borderColor = "var(--color-brand)";
                    el.style.color = "#fff";
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = "transparent";
                    el.style.borderColor = "var(--color-text-main)";
                    el.style.color = "var(--color-text-main)";
                }}
            >
                {label} <ChevronRight style={{ width: 14, height: 14 }} />
            </a>
        </div>
    );
}

/* ─── Featured Review (horizontal full-width card) ─── */
function FeaturedReview({ review }: { review: any }) {
    const sliderImg = review.sliderImage || review.posterImage;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Link href={`/reviews/${review.slug}`} style={{ display: "flex", flexDirection: "row", textDecoration: "none", border: "1px solid var(--color-border)", overflow: "hidden", backgroundColor: "var(--color-bg-card)" }}
                className="featured-review-card">
                <style>{`
                    .featured-review-card { flex-direction: column; }
                    @media (min-width: 768px) { .featured-review-card { flex-direction: row; height: 430px; } }
                    .featured-review-img { width: 100%; height: 260px; flex-shrink: 0; }
                    @media (min-width: 768px) { .featured-review-img { width: 58%; height: 100%; } }
                `}</style>

                {/* Image */}
                <div className="featured-review-img" style={{ position: "relative", overflow: "hidden", backgroundColor: "#111", flexShrink: 0 }}>
                    <img
                        src={sliderImg}
                        alt={review.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", transition: "transform 0.5s ease" }}
                        className="featured-img-el"
                    />
                    <style>{`.featured-review-card:hover .featured-img-el { transform: scale(1.03); }`}</style>
                    <div style={{ position: "absolute", top: 14, left: 14 }}>
                        <span className="tag-label">{review.type}</span>
                    </div>
                    {/* Latest badge */}
                    <div style={{ position: "absolute", top: 14, right: 14, backgroundColor: "var(--color-gold)", padding: "3px 8px" }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#1A1A1A" }}>Latest</span>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem", gap: 14, overflow: "hidden" }}>
                    {/* Rating */}
                    {review.type !== "Blog" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Star style={{ width: 14, height: 14, fill: "var(--color-brand)", color: "var(--color-brand)", flexShrink: 0 }} />
                            <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text-main)" }}>
                                {(Number(review.rating) / 2).toFixed(1)} / 5
                            </span>
                        </div>
                    )}

                    <h3 style={{
                        fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0,
                        fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)",
                        color: "var(--color-text-main)", lineHeight: 1.2,
                        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                        {review.title}
                    </h3>

                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)", margin: 0 }}>
                        {review.genre} · By {review.author?.name}
                    </p>

                    <span style={{ display: "block", width: 36, height: 3, backgroundColor: "var(--color-brand)" }} />

                    <span style={{ display: "inline-flex", alignSelf: "flex-start", padding: "8px 18px", border: "1px solid var(--color-text-main)", fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-main)" }}>
                        Read Full Article
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

/* ─── Blog horizontal card ─── */
function BlogCard({ review, large = false }: { review: any; large?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4 }}
        >
            <Link
                href={`/reviews/${review.slug}`}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    textDecoration: "none",
                    border: "1px solid var(--color-border)",
                    overflow: "hidden",
                    backgroundColor: "var(--color-bg-card)",
                    height: large ? 400 : 120,
                    
                }}
                className="blog-card-wrap"
            >
                <style>{`.blog-card-wrap:hover .blog-card-img { transform: scale(1.04); } .blog-card-wrap:hover .blog-card-title { color: var(--color-brand) !important; }`}</style>

                {/* Image */}
                <div style={{ width: large ? "50%" : 140, flexShrink: 0, overflow: "hidden", backgroundColor: "#111", position: "relative" }}>
                    <img
                        src={review.sliderImage || review.posterImage}
                        alt={review.title}
                        className="blog-card-img"
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", transition: "transform 0.4s ease" }}
                    />
                    <div style={{ position: "absolute", top: 0, left: 0 }}>
                        <span className="tag-label">{review.type || "Blog"}</span>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: large ? "1.5rem 2rem" : "0.875rem 1rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: large ? 10 : 6, overflow: "hidden", borderLeft: "1px solid var(--color-border)" }}>
                    {large && (
                        <span style={{ display: "block", width: 28, height: 2, backgroundColor: "var(--color-brand)" }} />
                    )}
                    <h4 className="blog-card-title" style={{
                        fontFamily: "var(--font-serif)", fontWeight: 700,
                        fontSize: large ? "2.2rem" : "0.9rem",
                        color: "var(--color-text-main)", margin: 0,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: large ? 3 : 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        transition: "color 0.2s ease",
                    }}>
                        {review.title}
                    </h4>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", margin: 0 }}>
                        By {review.author?.name}
                    </p>
                    {large && (
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-brand)", marginTop: 4 }}>
                            Read Article →
                        </span>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}

/* ─── Latest Blog grid card — image on top, title + writer below, no rating ─── */
function LatestBlogCard({ slug, title, posterImage, sliderImage, authorName }: {
    slug: string; title: string; posterImage: string; sliderImage?: string; authorName: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4 }}
        >
            <Link
                href={`/reviews/${slug}`}
                className="latest-blog-card-wrap"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-card)',
                    overflow: 'hidden',
                    height: '100%',
                    minWidth: 0,
                }}
            >
                <style>{`
                    .latest-blog-card-wrap:hover .latest-blog-card-img { transform: scale(1.04); }
                    .latest-blog-card-wrap:hover .latest-blog-card-title { color: var(--color-brand) !important; }
                `}</style>

                {/* Image on top */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: '#111', flexShrink: 0 }}>
                    <img
                        src={sliderImage || posterImage}
                        alt={title}
                        className="latest-blog-card-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 0.4s ease' }}
                    />
                    <div style={{ position: 'absolute', top: 0, left: 0 }}>
                        <span className="tag-label">Blog</span>
                    </div>
                </div>

                {/* Title + writer below — clean layout, no star rating */}
                <div style={{ padding: '0.75rem 0.9rem', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    <h4 className="latest-blog-card-title" style={{
                        fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '0.95rem',
                        color: 'var(--color-text-main)', margin: 0, lineHeight: 1.3,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        transition: 'color 0.2s ease',
                    }}>
                        {title}
                    </h4>
                    <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: 'var(--color-text-muted)', margin: 0, marginTop: 'auto',
                    }}>
                        By {authorName}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}

/* ─── Main homepage content ─── */
function HomePageContent() {
    const searchParams = useSearchParams();
    const activeGenre = searchParams.get("genre");
    const searchQuery = searchParams.get("search");

    // All reviews state
    const [allReviews, setAllReviews]       = useState<any[]>([]);
    const [loadingAll, setLoadingAll]       = useState(true);
    const [showMore, setShowMore]           = useState(false);
    const [loadingMore, setLoadingMore]     = useState(false);

    // Latest Blog grid (blogs only — movies/series filtered out)
    const [latestBlogs, setLatestBlogs]     = useState<any[]>([]);
    const [loadingLatest, setLoadingLatest] = useState(true);

    // Series reviews (replaces the old Blog Collection section)
    const [seriesReviews, setSeriesReviews] = useState<any[]>([]);
    const [loadingSeries, setLoadingSeries]  = useState(true);

    // Hit reviews (rating >= 8)
    const [hitReviews, setHitReviews]       = useState<any[]>([]);
    const [loadingHits, setLoadingHits]     = useState(true);

    // Featured review (latest single)
    const [featuredReview, setFeaturedReview] = useState<any>(null);

    // Cols per row
    const COLS = 5;
    const INITIAL_ROWS = 2;
    const MORE_ROWS = 3;
    const initialCount = COLS * INITIAL_ROWS;  // 10
    const moreCount    = COLS * MORE_ROWS;      // 15

    useEffect(() => {
        // All reviews
        const url = new URL("/api/reviews", window.location.origin);
        url.searchParams.set("status", "APPROVED");
        if (activeGenre) url.searchParams.set("genre", activeGenre);
        if (searchQuery) url.searchParams.set("search", searchQuery);

        fetch(url.toString())
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAllReviews(data);
                    // Featured = latest review of any type
                    if (data.length > 0) setFeaturedReview(data[0]);
                }
            })
            .finally(() => setLoadingAll(false));

        // Series reviews — limit 4 (Series Review section, replaces old Blog Collection)
        fetch("/api/reviews?status=APPROVED&type=Series&limit=4")
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setSeriesReviews(data.slice(0, 4)); })
            .finally(() => setLoadingSeries(false));

        // Latest Blog grid — separate limit-12 fetch so it doesn't affect Blog Collection below
        fetch("/api/reviews?status=APPROVED&type=Blog&limit=12")
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setLatestBlogs(data.slice(0, 12)); })
            .finally(() => setLoadingLatest(false));

        // Hit reviews — fetch all then filter rating >= 8, limit 10
        fetch("/api/reviews?status=APPROVED&limit=50")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const hits = data
                        .filter((r: any) => Number(r.rating) >= 4 && r.type !== "Blog")
                        .slice(0, 10);
                    setHitReviews(hits);
                }
            })
            .finally(() => setLoadingHits(false));
    }, [activeGenre, searchQuery]);

    const handleViewMore = () => {
        setLoadingMore(true);
        setTimeout(() => {
            setShowMore(true);
            setLoadingMore(false);
        }, 400);
    };

    const visibleAllReviews = showMore
        ? allReviews.slice(0, initialCount + moreCount)
        : allReviews.slice(0, initialCount);

    // Latest reviews grid: 4 per row, 3 rows = 12 cards
    // Last column (position 4, 8, 12) replaced by subscribe form in row 1
    const LATEST_COLS = 4;
    const LATEST_ROWS = 3;

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg-primary)" }}>

            {/* ── Hero Slider ── */}
            <HeroSlider />

            {/* ── ALL REVIEWS SECTION ── */}
            <section className="page-container" style={{ paddingTop: '3.5rem', paddingBottom: '1rem' }}>
                {/* Heading + Filters — same line */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap",
                    paddingBottom: "0.5rem",
                    borderBottom: "2px solid var(--color-text-main)",
                    marginBottom: "1.25rem",
                }}>
                    <h2 style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                        fontWeight: 700,
                        color: "var(--color-text-main)",
                        margin: 0,
                        lineHeight: 1.15,
                        letterSpacing: "0.01em",
                    }}>
                        All Reviews
                    </h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <GenreDropdown />
                        <SearchBar compact={true} />
                    </div>
                </div>

                {/* Grid */}
                {loadingAll ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {Array.from({ length: initialCount }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {visibleAllReviews.map(review => (
                            <ReviewCard
                                key={review.id}
                                {...review}
                                authorName={review.author?.name || "Unknown"}
                                authorImage={review.author?.image || ""}
                                category={review.type}
                                publishDate={new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                isBlog={review.type === "Blog"}
                            />
                        ))}
                    </div>
                )}

                {/* View More button */}
                {!loadingAll && !showMore && allReviews.length > initialCount && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
                        <button
                            onClick={handleViewMore}
                            disabled={loadingMore}
                            style={{
                                padding: "11px 32px", border: "2px solid var(--color-text-main)",
                                backgroundColor: "transparent", fontFamily: "var(--font-sans)",
                                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                                letterSpacing: "0.12em", color: "var(--color-text-main)",
                                cursor: "pointer", transition: "all 0.2s ease",
                                display: "flex", alignItems: "center", gap: 8,
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand)";
                                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand)";
                                (e.currentTarget as HTMLElement).style.color = "#fff";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-text-main)";
                                (e.currentTarget as HTMLElement).style.color = "var(--color-text-main)";
                            }}
                        >
                            {loadingMore ? (
                                <><div className="load-more-spinner" /> Loading...</>
                            ) : (
                                <>View More Reviews <ChevronRight style={{ width: 14, height: 14 }} /></>
                            )}
                        </button>
                    </div>
                )}
            </section>

            {/* ── FEATURED REVIEW (horizontal, latest) ── */}
            {featuredReview && (
                <section className="page-container py-8">
                    <FeaturedReview review={featuredReview} />
                </section>
            )}

            {/* ── LATEST BLOG SECTION ── */}
            <section className="page-container py-8">
                <SectionHeading title="Latest Blog" />

                {loadingLatest ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="skeleton-shimmer" style={{ width: '100%', aspectRatio: '16/9', borderRadius: '6px' }} />
                        ))}
                    </div>
                ) : (
                    <div
                        style={{ display: "grid", gap: "1.25rem", overflow: "hidden" }}
                        className="latest-blog-grid"
                    >
                        <style>{`
                            .latest-blog-grid {
                                grid-template-columns: repeat(2, minmax(0, 1fr));
                            }
                            @media (min-width: 640px) {
                                .latest-blog-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                            }
                            @media (min-width: 1024px) {
                                .latest-blog-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                            }
                        `}</style>

                        {Array.from({ length: LATEST_COLS * LATEST_ROWS }).map((_, idx) => {
                            // Position 3 (0-indexed) = 4th column, 1st row → subscribe form
                            const isSubscribeSlot = idx === LATEST_COLS - 1;
                            // Positions 7, 11 = 4th column, rows 2 & 3 → off-white filler
                            const isFillerSlot = idx === (LATEST_COLS * 2 - 1) || idx === (LATEST_COLS * 3 - 1);

                            if (isSubscribeSlot) {
                                return (
                                    <div key="subscribe" style={{ aspectRatio: '16/9', overflow: 'hidden', minWidth: 0 }}>
                                        <InlineSubscribeForm />
                                    </div>
                                );
                            }

                            if (isFillerSlot) {
                                return (
                                    <div key={`filler-${idx}`} style={{ backgroundColor: "var(--color-bg-primary)", border: "1px solid var(--color-border)", aspectRatio: '16/9', borderRadius: '6px', minWidth: 0 }} />
                                );
                            }

                            // Calculate actual review index: skip 4th column slots
                            const col = idx % LATEST_COLS;
                            const row = Math.floor(idx / LATEST_COLS);
                            const reviewIdx = row * (LATEST_COLS - 1) + col;
                            const review = latestBlogs[reviewIdx];

                            if (!review) return (
                                <div key={`empty-${idx}`} style={{ backgroundColor: "var(--color-bg-primary)", border: "1px dashed var(--color-border)", aspectRatio: '16/9', borderRadius: '6px', minWidth: 0 }} />
                            );

                            return (
                                <LatestBlogCard
                                    key={review.id}
                                    slug={review.slug}
                                    title={review.title}
                                    posterImage={review.posterImage}
                                    sliderImage={review.sliderImage}
                                    authorName={review.author?.name || "Unknown"}
                                />
                            );
                        })}
                    </div>
                )}
                <ViewAllButton href="/blog" label="View All Blogs" />
            </section>

            {/* ── BLOG COLLECTION SECTION ── */}
            <section className="page-container py-8" style={{ borderTop: "1px solid var(--color-border)" }}>
                <SectionHeading title="Series Review" />

                {loadingSeries ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="skeleton-shimmer" style={{ height: 120, width: "100%" }} />
                        ))}
                    </div>
                ) : seriesReviews.length === 0 ? (
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--color-text-muted)", textAlign: "center", padding: "2rem 0" }}>
                        No series reviews yet.
                    </p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {seriesReviews.map(series => <BlogCard key={series.id} review={series} large={true} />)}
                    </div>
                )}
                <ViewAllButton href="/series" label="View All Series" />
            </section>

            {/* ── HIT REVIEWS SECTION ── */}
            <section className="page-container py-8" style={{ borderTop: "1px solid var(--color-border)" }}>
                <SectionHeading title="Hit Reviews" />
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.5rem", marginTop: "-1rem" }}>
                    Rated 4 and above
                </p>

                {loadingHits ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : hitReviews.length === 0 ? (
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--color-text-muted)", textAlign: "center", padding: "2rem 0" }}>
                        No hit reviews yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {hitReviews.map(review => (
                            <ReviewCard
                                key={review.id}
                                {...review}
                                authorName={review.author?.name || "Unknown"}
                                authorImage={review.author?.image || ""}
                                category={review.type}
                                publishDate={new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                isBlog={false}
                            />
                        ))}
                    </div>
                )}
                <ViewAllButton href="/movies" label="View All Reviews" />
            </section>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={null}>
            <HomePageContent />
        </Suspense>
    );
}
