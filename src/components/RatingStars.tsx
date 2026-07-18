"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
    rating: number;         // rating on a 0–5 scale
    maxRating?: number;      // number of stars to render (default 5)
    size?: number;           // star size in px (default 14)
    gap?: number;            // gap between stars in px (default 2)
    filledColor?: string;    // color for the filled portion (default gold)
    unfilledColor?: string;  // color for the empty portion (default neutral border)
}

export default function RatingStars({
    rating,
    maxRating = 5,
    size = 14,
    gap = 2,
    filledColor = 'var(--color-gold)',
    unfilledColor = 'var(--color-border)',
}: RatingStarsProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap }}>
            {[...Array(maxRating)].map((_, i) => {
                const fillAmount = Math.max(0, Math.min(1, rating - i));
                return (
                    <div key={i} style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
                        {/* Empty star (base) */}
                        <Star
                            style={{ width: size, height: size, fill: 'none', color: unfilledColor }}
                        />
                        {/* Filled star, clipped to the rated proportion */}
                        {fillAmount > 0 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: `${fillAmount * 100}%`,
                                    overflow: 'hidden',
                                }}
                            >
                                <Star
                                    style={{ width: size, height: size, fill: filledColor, color: filledColor }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
