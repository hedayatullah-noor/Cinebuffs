"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface LatestReviewCardProps {
    slug: string;
    title: string;
    posterImage: string;
    sliderImage?: string;
    rating: number;
    authorName: string;
}

export default function LatestReviewCard({
    slug,
    title,
    posterImage,
    sliderImage,
    rating,
    authorName,
}: LatestReviewCardProps) {
    const bgImage = sliderImage || posterImage;
    const maxStars = 5;
    const currentRating = rating / 2; // Rating is out of 10

    return (
        <motion.div
            className="latest-card-wrap"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4 }}
            style={{
                position: 'relative',
                borderRadius: '6px',
                overflow: 'hidden',
                aspectRatio: '16/9',
                cursor: 'pointer',
                backgroundColor: '#111',
            }}
        >
            <Link href={`/reviews/${slug}`} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
                {/* Background Image */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                    <img
                        src={bgImage}
                        alt={title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                        }}
                        className="latest-card-img"
                    />
                </div>

                {/* Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.25rem',
                }}>
                    <h3 className="latest-card-title" style={{
                        fontFamily: 'var(--font-serif)',
                        color: '#fff',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        margin: '0 0 8px 0',
                        lineHeight: 1.25,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        transition: 'color 0.2s ease',
                    }}>
                        {title}
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Rating stars */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            {Array.from({ length: maxStars }).map((_, i) => (
                                <Star 
                                    key={i} 
                                    style={{ 
                                        width: 12, height: 12, 
                                        fill: i < currentRating ? '#fff' : 'transparent', 
                                        color: i < currentRating ? '#fff' : 'rgba(255,255,255,0.3)' 
                                    }} 
                                />
                            ))}
                        </div>
                        {/* Author */}
                        <span style={{
                            color: '#fff',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                        }}>
                            {authorName}
                        </span>
                    </div>
                </div>

                <style>{`
                    .latest-card-wrap:hover .latest-card-img { transform: scale(1.05); }
                    .latest-card-wrap:hover .latest-card-title { color: var(--color-gold) !important; }
                `}</style>
            </Link>
        </motion.div>
    );
}
