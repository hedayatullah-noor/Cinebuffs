"use client";

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Menu, X, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const urlSearch = searchParams?.get("search") || "";
    const [searchQuery, setSearchQuery] = useState(urlSearch);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        fetch('/api/auth/me', { cache: 'no-store' })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && !data.error) setUser(data);
                else setUser(null);
            })
            .catch(() => setUser(null));
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isSearchFocused && urlSearch !== searchQuery) {
            setSearchQuery(urlSearch);
        }
    }, [urlSearch, isSearchFocused]);

    useEffect(() => {
        if (!isSearchFocused) return;
        const timer = setTimeout(() => {
            if (searchQuery === urlSearch) return;
            const params = new URLSearchParams(searchParams?.toString());
            if (searchQuery) params.set("search", searchQuery);
            else params.delete("search");
            const queryString = params.toString();
            const target = pathname === '/' ? '' : '/';
            const finalUrl = target + (queryString ? '?' + queryString : '');
            startTransition(() => {
                router.push(finalUrl || '/', { scroll: false });
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, router, pathname, searchParams, isSearchFocused]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Contributors", href: "/contributors" },
        { name: "Movie Review", href: "/movies" },
        { name: "Series Review", href: "/series" },
        { name: "Blog", href: "/blog" },
        { name: "Contact Us", href: "/contact" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* ── Top bar ── */}
            <div className="glass border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
                <div className="page-container flex items-center justify-between h-20">

                    {/* Left: Mobile menu + Logo */}
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-1.5 text-[var(--color-text-main)] dark:text-[var(--color-text-light)] hover:text-[var(--color-brand)] transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                            <img
                                src="/uploads/logo.png"
                                alt="CineBuffs"
                                style={{ height: '52px', width: 'auto', objectFit: 'contain', display: 'block' }}
                            />
                        </Link>
                    </div>

                    {/* Right: Search + Theme + User */}
                    <div className="flex items-center gap-3">

                        {/* Desktop search */}
                        <div className="hidden md:flex items-center relative" ref={searchRef}>
                            <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-60' : 'w-8'}`}>
                                {isSearchOpen && (
                                    <motion.input
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        type="text"
                                        placeholder="Search reviews..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        autoFocus
                                        className="w-full text-sm bg-transparent border-b border-[var(--color-text-main)] dark:border-[var(--color-text-light)] text-[var(--color-text-main)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-muted)] outline-none pb-1 pr-8 font-[var(--font-sans)]"
                                    />
                                )}
                            </div>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="p-1.5 text-[var(--color-text-main)] dark:text-[var(--color-text-light)] hover:text-[var(--color-brand)] transition-colors"
                                aria-label="Search"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Admin shortcut */}
                        {user && (user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                            <Link
                                href={user.role === 'ADMIN' ? '/admin' : '/moderator'}
                                className="hidden md:flex p-1.5 text-[var(--color-text-main)] dark:text-[var(--color-text-light)] hover:text-[var(--color-brand)] transition-colors"
                                title="Dashboard"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                            </Link>
                        )}

                        <ThemeToggle />

                        {/* User */}
                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--color-border)] dark:border-[var(--color-border-dark)] hover:border-[var(--color-brand)] transition-colors"
                                >
                                    {user.image ? (
                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[var(--color-brand)] flex items-center justify-center text-white text-xs font-bold">
                                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.18 }}
                                            className="absolute right-0 top-11 w-52 bg-[var(--color-bg-card)] dark:bg-[var(--color-bg-card-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] shadow-lg py-1 z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
                                                <p className="text-xs font-bold text-[var(--color-text-main)] dark:text-[var(--color-text-light)] truncate">{user.name}</p>
                                                <p className="text-[10px] text-[var(--color-text-muted)] truncate uppercase tracking-wider mt-0.5">{user.role}</p>
                                            </div>
                                            <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[var(--color-text-main)] dark:text-[var(--color-text-light)] hover:bg-[var(--color-bg-primary)] dark:hover:bg-[#222] hover:text-[var(--color-brand)] transition-colors">
                                                <User className="w-3.5 h-3.5" /> My Profile
                                            </Link>
                                            <Link href="/profile/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[var(--color-text-main)] dark:text-[var(--color-text-light)] hover:bg-[var(--color-bg-primary)] dark:hover:bg-[#222] hover:text-[var(--color-brand)] transition-colors">
                                                <Settings className="w-3.5 h-3.5" /> Settings
                                            </Link>
                                            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[var(--color-brand)] hover:bg-[var(--color-bg-primary)] dark:hover:bg-[#222] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
                                                <LogOut className="w-3.5 h-3.5" /> Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:flex items-center px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-main)] dark:text-[var(--color-text-light)] border border-[var(--color-text-main)] dark:border-[var(--color-text-light)] hover:bg-[var(--color-text-main)] hover:text-[var(--color-text-light)] dark:hover:bg-[var(--color-text-light)] dark:hover:text-[var(--color-text-main)] transition-all"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="md:hidden bg-[var(--color-bg-primary)] dark:bg-[var(--color-bg-dark)] border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)] overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
                            <div className="flex items-center gap-2 border-b border-[var(--color-text-main)] dark:border-[var(--color-text-light)] pb-1">
                                <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search reviews..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="w-full text-sm bg-transparent text-[var(--color-text-main)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-muted)] outline-none"
                                />
                            </div>
                        </div>
                        <nav className="px-4 py-3 flex flex-col">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`py-2.5 text-xs font-bold uppercase tracking-widest border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)] transition-colors ${isActive ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-main)] dark:text-[var(--color-text-light)] hover:text-[var(--color-brand)]'}`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <Link href="/subscribe" onClick={() => setIsMobileMenuOpen(false)} className="mt-3 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors">
                                Subscribe →
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}