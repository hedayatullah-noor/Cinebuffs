"use client";

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Menu, X, Mail, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        fetch('/api/auth/me', { cache: 'no-store' })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && !data.error) {
                    setUser(data);
                } else {
                    setUser(null);
                }
            })
            .catch(() => { setUser(null); });
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
    };

    const searchParams = useSearchParams();
    const urlSearch = searchParams?.get("search") || "";
    const [searchQuery, setSearchQuery] = useState(urlSearch);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

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
            if (searchQuery) {
                params.set("search", searchQuery);
            } else {
                params.delete("search");
            }
            const queryString = params.toString();
            const target = pathname === '/' ? '' : '/';
            const finalUrl = target + (queryString ? '?' + queryString : '');
            startTransition(() => {
                router.push(finalUrl || '/', { scroll: false });
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, router, pathname, searchParams, isSearchFocused]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Contributors", href: "/contributors" },
        { name: "Movie Review", href: "/movies" },
        { name: "Series Review", href: "/series" },
        { name: "Contact Us", href: "/contact" },
        { name: "Blog", href: "/blog" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 h-20 glass z-50 flex items-center justify-between px-6 transition-all duration-300">
            <div className="flex items-center gap-4">
                {user && (user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                    <Link
                        href={user.role === 'ADMIN' ? '/admin' : '/moderator'}
                        className="p-2 -ml-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors hidden md:flex items-center"
                        title="Dashboard"
                    >
                        <Menu className="w-6 h-6" />
                    </Link>
                )}
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 group">
                    <span className="text-3xl font-black font-serif tracking-tight text-black dark:text-white">Cine<span className="text-[var(--color-brand)]">Buffs</span></span>
                </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
                <div className="hidden md:flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="pl-9 pr-4 py-1.5 rounded-none border-b-2 border-gray-300 dark:border-gray-700 bg-transparent focus:border-black dark:focus:border-white outline-none text-sm w-48 transition-all text-black dark:text-white font-medium"
                        />
                    </div>
                </div>

                <div className="hidden md:block">
                    <ThemeToggle />
                </div>

                <div className="hidden md:block">
                    {user ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-10 h-10 rounded-full border-2 border-black dark:border-gray-700 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-zinc-800 hover:border-[var(--color-brand)] transition-colors"
                            >
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                )}
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-[50px] right-0 w-64 bg-white dark:bg-zinc-900 border-2 border-black dark:border-gray-800 rounded-none shadow-xl p-4 flex flex-col gap-2 z-50 shadow-black/20"
                                    >
                                        <div className="px-3 pb-3 border-b-2 border-gray-100 dark:border-gray-800 mb-2">
                                            <p className="font-bold text-black dark:text-white font-serif truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 font-sans truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 transition-colors text-sm font-medium"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Profile Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-[var(--color-brand)] transition-colors text-sm font-medium w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="px-4 py-2 border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-black dark:text-white text-xs font-black uppercase tracking-widest transition-colors font-sans">
                                Log In
                            </Link>
                            <Link href="/signup" className="px-4 py-2 bg-[var(--color-brand)] border-2 border-[var(--color-brand)] hover:bg-[#800000] hover:border-[#800000] text-white text-xs font-black uppercase tracking-widest transition-colors font-sans">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                <div className="md:hidden flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-black dark:text-white hover:text-[var(--color-brand)] transition-colors relative z-50"
                    >
                        {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute top-20 left-0 right-0 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-gray-800 md:hidden overflow-y-auto"
                        style={{ height: 'calc(100vh - 80px)' }}
                    >
                        <div className="flex flex-col px-8 py-8 gap-8">
                            <div className="relative border-b-2 border-black dark:border-white pb-2">
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-black dark:text-white" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-xl transition-all text-black dark:text-white font-serif italic"
                                />
                            </div>

                            <nav className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-black dark:text-white font-serif text-3xl font-black hover:text-[var(--color-brand)] transition-colors py-2 border-b border-gray-100 dark:border-gray-800"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex flex-col gap-4 mt-auto pb-10 pt-4">
                                {user ? (
                                    <>
                                        {user.role === 'ADMIN' && (
                                            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-black font-bold uppercase tracking-widest text-lg">Admin Dashboard</Link>
                                        )}
                                        <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-black font-bold uppercase tracking-widest text-lg">Profile Settings</Link>
                                        <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="text-[var(--color-brand)] font-bold uppercase tracking-widest text-lg text-left">Sign Out</button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-black dark:text-white font-bold uppercase tracking-widest text-lg">Log In</Link>
                                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--color-brand)] font-bold uppercase tracking-widest text-lg">Sign Up</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
