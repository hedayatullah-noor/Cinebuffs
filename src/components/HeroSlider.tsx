"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RatingStars from "@/components/RatingStars";

interface Review {
    id: string;
    slug: string;
    title: string;
    posterImage: string;
    rating: number;
    genre: string;
    type: string;
}

export default function HeroSlider() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetch("/api/reviews?limit=5&status=APPROVED")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setReviews(data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const nextSlide = useCallback(() => {
        setActiveIndex(prev => (prev + 1) % reviews.length);
    }, [reviews.length]);

    const resetInterval = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(nextSlide, 6000);
    }, [nextSlide]);

    useEffect(() => {
        if (reviews.length === 0) return;
        resetInterval();
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [reviews.length, resetInterval]);

    if (loading) {
        return (
            <div className="page-container" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <div className="w-full bg-[var(--color-bg-card)] animate-pulse" style={{ height: 500 }} />
            </div>
        );
    }

    if (reviews.length === 0) return null;

    const review = reviews[activeIndex];

    return (
        <>
            <style>{`
                .cb-hero-outer {
                    width: 100%;
                    border: 1px solid var(--color-border);      /* border added */
                    border-left: 4px solid var(--color-brand);  /* left accent border */
                    margin-bottom: 0;
                    margin-top: 1.5rem;
                }
                .cb-hero-inner {
                    display: flex;
                    flex-direction: column;
                }
                .cb-hero-img {
                    position: relative;
                    width: 100%;
                    height: 320px;
                    flex-shrink: 0;
                    overflow: hidden;
                    background: #111;
                }
                .cb-hero-img img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: 50% 30%;
                    display: block;
                }
                .cb-hero-panel {
                    background-color: var(--color-bg-primary);
                    border-top: 1px solid var(--color-border);
                    padding: 0.75rem 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    /* NO height/overflow — always fully visible */
                }
                @media (min-width: 1024px) {
                    .cb-hero-inner {
                        flex-direction: row;
                        min-height: 500px;
                    }
                    .cb-hero-img {
                        width: 62%;
                        height: auto;   /* stretches with row */
                        min-height: 500px;
                    }
                    .cb-hero-panel {
                        flex: 1;
                        border-top: none;
                        border-left: 1px solid var(--color-border);
                        padding: 2rem 2.5rem;
                        justify-content: center;
                    }
                }
                .dark .cb-hero-panel {
                    background-color: var(--color-bg-dark);
                    border-color: var(--color-border-dark);
                }
                .cb-arrow:hover {
                    background-color: var(--color-brand-hover) !important;
                }
            `}</style>

            <div className="page-container">
            <section className="cb-hero-outer">
                <div className="cb-hero-inner">

                    {/* ── Image panel ── */}
                    <div className="cb-hero-img">
                        <AnimatePresence mode="sync">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 1.03 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                                style={{ position: 'absolute', inset: 0 }}
                            >
                                <img
                                    src={(review as any).sliderImage || review.posterImage}
                                    alt={review.title}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Type badge */}
                        <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}>
                            <span className="tag-label">{review.type}</span>
                        </div>

                        {/* Star rating — overlay graphic, bottom-right corner of poster */}
                        <div style={{
                            position: 'absolute',
                            bottom: 14,
                            right: 14,
                            zIndex: 10,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            padding: '6px 10px',
                        }}>
                            <RatingStars rating={Number(review.rating) / 2} size={14} gap={3} />
                        </div>

                        {/* Dot indicators */}
                        <div style={{ position: 'absolute', bottom: 14, left: 14, zIndex: 10, display: 'flex', gap: 6 }}>
                            {reviews.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setActiveIndex(i); resetInterval(); }}
                                    aria-label={`Slide ${i + 1}`}
                                    style={{
                                        height: 3,
                                        width: i === activeIndex ? 24 : 8,
                                        padding: 0, border: 'none', cursor: 'pointer',
                                        backgroundColor: i === activeIndex
                                            ? 'var(--color-brand)'
                                            : 'rgba(255,255,255,0.6)',
                                        transition: 'all 0.3s ease',
                                        flexShrink: 0,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── Content panel ── */}
                    <div className="cb-hero-panel">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', flex: 1 }}
                            >
                                {/* Title */}
                                <h2 style={{
                                    fontFamily: 'var(--font-serif)', fontWeight: 700, lineHeight: 1.2, margin: 0,
                                    fontSize: 'clamp(1.35rem, 2vw, 2rem)', color: 'var(--color-text-main)',
                                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                }}>
                                    {review.title}
                                </h2>

                                {/* Genre */}
                                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', margin: 0 }}>
                                    Featured in: <span style={{ color: 'var(--color-text-main)' }}>{review.genre}</span>
                                </p>

                                <span className="rule-red" style={{ marginLeft: 'auto', marginRight: 'auto' }} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>
            </div>
        </>
    );
}
