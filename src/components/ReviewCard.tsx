"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

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

export default function ReviewCard({
    slug,
    title,
    posterImage,
    rating,
    authorName,
    category = "Movie",
    publishDate = "",
    isBlog = false,
}: ReviewCardProps) {
    return (
        <motion.div
            className="review-card-wrap"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Link
                href={`/reviews/${slug}`}
                style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none', color: 'inherit' }}
            >

                {/* ── Poster: 3:4 movie poster ratio ── */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '133%',  /* 4/3 * 100 = 133.33% gives 3:4 ratio */
                    overflow: 'hidden',
                    backgroundColor: '#e8e5e0',
                    flexShrink: 0,
                }}>
                    {/* Category badge */}
                    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
                        <span className="tag-label">{category}</span>
                    </div>

                    {/* Image — uses .card-poster-img from globals.css for hover scale */}
                    {posterImage ? (
                        <img
                            src={posterImage}
                            alt={title}
                            className="card-poster-img"
                        />
                    ) : (
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#d0cdc8',
                        }}>
                            <span style={{ fontSize: 10, color: '#888', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                No Image
                            </span>
                        </div>
                    )}

                    {/* Hover overlay — darkens slightly on hover via globals.css */}
                    <div
                        className="card-hover-overlay"
                        style={{
                            position: 'absolute', inset: 0,
                            backgroundColor: 'rgba(0,0,0,0)',
                            transition: 'background-color 0.3s ease',
                            zIndex: 5,
                        }}
                    />
                </div>

                {/* ── Text content ── */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    padding: '10px 12px 12px',
                    gap: 6,
                }}>
                    {/* Star rating — not for blog posts */}
                    {!isBlog && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Star style={{ width: 11, height: 11, fill: 'var(--color-brand)', color: 'var(--color-brand)', flexShrink: 0 }} />
                            <span style={{
                                fontSize: 11, fontWeight: 700,
                                fontFamily: 'var(--font-sans)',
                                color: 'var(--color-text-main)',
                            }}>
                                {Number(rating).toFixed(1)}
                                <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}> / 5</span>
                            </span>
                        </div>
                    )}

                    {/* Title — .card-title-el gets color:brand on hover via globals.css */}
                    <h3
                        className="card-title-el"
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            lineHeight: 1.35,
                            color: 'var(--color-text-main)',
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            transition: 'color 0.2s ease',
                        }}
                    >
                        {title}
                    </h3>

                    {/* Author + date */}
                    <div
                        className="card-author-date"
                        style={{
                            marginTop: 'auto',
                            paddingTop: 8,
                            borderTop: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 4,
                        }}
                    >
                        <span style={{
                            fontSize: 10, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            fontFamily: 'var(--font-sans)',
                            color: 'var(--color-text-muted)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            By {authorName}
                        </span>
                        {publishDate && (
                            <span style={{
                                fontSize: 10,
                                fontFamily: 'var(--font-sans)',
                                color: 'var(--color-text-muted)',
                                whiteSpace: 'nowrap', flexShrink: 0,
                            }}>
                                {publishDate}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
