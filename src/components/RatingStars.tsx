"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
    rating: number;
    maxRating?: number;
    size?: "sm" | "md" | "lg";
}

export default function RatingStars({ rating, maxRating = 5, size = "sm" }: RatingStarsProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    const renderStar = (index: number) => {
        const fillAmount = Math.max(0, Math.min(1, rating - index));

        // Unique ID for SVG gradient to avoid conflicts
        const gradientId = `star-grad-${index}-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div key={index} className={`relative ${sizeClasses[size]}`}>
                <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full text-white/20"
                    fill="currentColor"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {fillAmount > 0 && (
                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${fillAmount * 100}%` }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className={`text-yellow-500 fill-yellow-500 ${sizeClasses[size]}`}
                        >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(maxRating)].map((_, i) => renderStar(i))}
        </div>
    );
}
