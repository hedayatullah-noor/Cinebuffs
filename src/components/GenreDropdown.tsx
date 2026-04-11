"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function GenreDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const activeGenre = searchParams.get('genre');

    const genres = [
        "Action", "Adventure", "Comedy", "Drama", "Horror",
        "Sci-Fi", "Thriller", "Romance", "Documentary", "Animation"
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative z-30" ref={dropdownRef}>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-none border-2 transition-all duration-300 font-black uppercase tracking-widest text-[10px] ${isOpen
                        ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black"
                        : "bg-white dark:bg-zinc-950 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                        }`}
                >
                    <Filter className="w-3.5 h-3.5" />
                    {activeGenre ? activeGenre : "Browse Categories"}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white rounded-none shadow-2xl p-4 grid grid-cols-1 gap-1 z-50 transition-colors"
                        >
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className={`px-4 py-3 rounded-none transition-all flex items-center justify-between font-black text-[10px] uppercase tracking-widest ${!activeGenre ? "bg-black text-white dark:bg-white dark:text-black" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
                            >
                                All Genres
                                {!activeGenre && <div className="w-1.5 h-1.5 bg-[var(--color-brand)]"></div>}
                            </Link>
                            <div className="h-0.5 bg-black dark:bg-white my-1"></div>
                            {genres.map((genre) => (
                                <Link
                                    key={genre}
                                    href={`/?genre=${genre}`}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-4 py-3 rounded-none transition-all flex items-center justify-between font-black text-[10px] uppercase tracking-widest ${activeGenre === genre ? "bg-black text-white dark:bg-white dark:text-black" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
                                >
                                    {genre}
                                    {activeGenre === genre && <div className="w-1.5 h-1.5 bg-[var(--color-brand)]"></div>}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
