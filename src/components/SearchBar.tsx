"use client";

import { useState, useEffect, useTransition } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar({ compact = false }: { compact?: boolean }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlSearch = searchParams.get("search") || "";
    const [query, setQuery] = useState(urlSearch);
    const [isFocused, setIsFocused] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!isFocused && urlSearch !== query) {
            setQuery(urlSearch);
        }
    }, [urlSearch, isFocused]);

    useEffect(() => {
        if (!isFocused) return;
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (query) params.set("search", query);
            else params.delete("search");
            startTransition(() => {
                router.push(`?${params.toString()}`, { scroll: false });
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [query, router, searchParams, isFocused]);

    /* ── Compact mode: inline search bar matching GenreDropdown height ── */
    if (compact) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    border: `2px solid ${isFocused ? '#1A1A1A' : 'rgba(0,0,0,0.2)'}`,
                    backgroundColor: '#fff',
                    padding: '0 12px',
                    height: '38px',           /* same height as GenreDropdown button */
                    minWidth: '200px',
                    maxWidth: '260px',
                    transition: 'border-color 0.2s ease',
                }}
            >
                <Search style={{ width: 14, height: 14, color: isFocused ? '#1A1A1A' : '#999', flexShrink: 0 }} />
                <input
                    type="text"
                    placeholder="Search the archives..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontFamily: 'var(--font-sans)',
                        color: '#1A1A1A',
                        width: '100%',
                    }}
                />
            </div>
        );
    }

    /* ── Full mode: used on other pages ── */
    return (
        <div className="w-full">
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    border: `2px solid ${isFocused ? '#1A1A1A' : 'rgba(0,0,0,0.15)'}`,
                    backgroundColor: '#fff',
                    padding: '0 16px',
                    height: '44px',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: isFocused ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
                }}
            >
                <Search style={{ width: 16, height: 16, color: isFocused ? '#1A1A1A' : '#999', flexShrink: 0 }} />
                <input
                    type="text"
                    placeholder="Search the archives..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontFamily: 'var(--font-sans)',
                        color: '#1A1A1A',
                        width: '100%',
                    }}
                />
            </div>
        </div>
    );
}
