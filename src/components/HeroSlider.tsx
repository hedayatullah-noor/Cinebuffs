"use client";

import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

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
        const fetchLatestReviews = async () => {
            try {
                const res = await fetch("/api/reviews?limit=5&status=APPROVED");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setReviews(data);
                }
            } catch (err) {
                console.error("Failed to fetch reviews for hero slider:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestReviews();
    }, []);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const resetInterval = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(nextSlide, 6000);
    };

    useEffect(() => {
        resetInterval();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [reviews.length]);

    if (loading) {
        return (
            <div className="w-full h-[50vh] flex items-center justify-center bg-white dark:bg-zinc-950 pt-16">
                <div className="w-12 h-12 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (reviews.length === 0) return null;

    const review = reviews[activeIndex];

    return (
        <section className="relative w-full overflow-hidden bg-white dark:bg-zinc-950 mb-6 border-b-2 border-black dark:border-white transition-colors">
            <div className="w-full max-w-[1500px] mx-auto flex flex-col lg:flex-row min-h-[60vh]">
                
                {/* Image Side */}
                <div className="w-full lg:w-2/3 relative h-[50vh] lg:h-auto bg-black overflow-hidden group border-r-2 border-black dark:border-white">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-0"
                        >
                            <img
                                src={review.posterImage}
                                alt={review.title}
                                className="w-full h-full object-cover opacity-90"
                            />
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Badge */}
                    <div className="absolute top-6 left-6 bg-[var(--color-brand)] px-4 py-2 font-black text-white uppercase tracking-widest text-xs z-10 shadow-lg">
                        {review.type}
                    </div>

                    <div className="absolute bottom-6 right-6 flex gap-3 z-10">
                        <button onClick={() => { prevSlide(); resetInterval(); }} className="w-10 h-10 bg-white dark:bg-zinc-950 border-2 border-black dark:border-white text-black dark:text-white flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => { nextSlide(); resetInterval(); }} className="w-10 h-10 bg-white dark:bg-zinc-950 border-2 border-black dark:border-white text-black dark:text-white flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/3 flex flex-col justify-center px-8 py-12 lg:px-12 bg-white dark:bg-zinc-900 relative z-10">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col h-full justify-center"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-4 h-4 text-[var(--color-brand)] fill-[var(--color-brand)]" />
                                <span className="font-black text-lg font-serif italic text-black dark:text-white">{review.rating} / 10</span>
                            </div>
                            
                            <h2 className="text-4xl sm:text-5xl lg:text-5xl font-black font-serif text-black dark:text-white leading-tight mb-6 hover:text-[var(--color-brand)] transition-colors line-clamp-4 uppercase">
                                <Link href={`/reviews/${review.slug}`}>{review.title}</Link>
                            </h2>
                            
                            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
                                Featured In: {review.genre}
                            </p>

                            <Link href={`/reviews/${review.slug}`} className="inline-block border-2 border-black dark:border-white px-8 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all w-fit">
                                Read Full Article
                            </Link>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
