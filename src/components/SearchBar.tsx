"use client";

import { useState, useEffect, useTransition } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar({ compact = false }: { compact?: boolean }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlSearch = searchParams.get("search") || "";
    const [query, setQuery] = useState(urlSearch);
    const [isFocused, setIsFocused] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Sync from URL only if NOT focused
    useEffect(() => {
        if (!isFocused && urlSearch !== query) {
            setQuery(urlSearch);
        }
    }, [urlSearch, isFocused]);

    // Update URL as user types
    useEffect(() => {
        if (!isFocused) return; // ONLY push if user is typing HERE

        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (query) {
                params.set("search", query);
            } else {
                params.delete("search");
            }

            startTransition(() => {
                router.push(`?${params.toString()}`, { scroll: false });
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [query, router, searchParams, isFocused]);

    // Fallback UI as requested for "no [section]"
    const suggestions = query.length > 2 ? [
        { id: "empty", title: "No suggestions", type: "Empty" }
    ] : [];

    const containerClasses = compact
        ? "w-full max-w-md group"
        : "w-full max-w-[1500px] mx-auto px-6 py-12 flex flex-col items-center";

    const inputWrapperClasses = `relative flex items-center bg-white dark:bg-zinc-950 border-2 transition-all duration-300 ${isFocused
        ? 'border-black dark:border-white shadow-2xl'
        : 'border-black/20 dark:border-white/20'
        } ${compact ? 'py-1' : 'py-0'}`;

    const inputClasses = `w-full bg-transparent outline-none text-black dark:text-white placeholder-gray-500 font-bold uppercase tracking-widest text-[10px] ${compact ? 'pl-11 pr-4 py-2 text-[10px]' : 'pl-16 pr-6 py-5 text-sm'
        }`;

    const iconClasses = `absolute transition-colors ${compact ? 'left-4 w-4 h-4' : 'left-6 w-6 h-6'
        } ${isFocused ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`;

    return (
        <div className={containerClasses}>
            <motion.div
                className={`relative w-full ${!compact ? 'max-w-3xl' : ''}`}
                initial={!compact ? { opacity: 0, scale: 0.95 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className={inputWrapperClasses}>
                    <Search className={iconClasses} />
                    <input
                        type="text"
                        className={inputClasses}
                        placeholder={compact ? "QUERIES..." : "SEARCH THE ARCHIVES..."}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    />
                </div>

                <AnimatePresence>
                    {isFocused && query.length > 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-zinc-950 border-2 border-black dark:border-white shadow-2xl z-20"
                        >
                            <ul className="py-0">
                                {suggestions.length > 0 ? suggestions.map((suggestion) => (
                                    <li key={suggestion.id} className="px-5 py-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer transition-colors flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <Search className="w-3.5 h-3.5 opacity-50" />
                                            <span className="font-black uppercase tracking-widest text-[10px]">{suggestion.title}</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{suggestion.type}</span>
                                    </li>
                                )) : (
                                    <li className="px-5 py-4 text-center text-gray-400 font-black uppercase tracking-widest text-[10px] italic">
                                        No matches found in archives
                                    </li>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
