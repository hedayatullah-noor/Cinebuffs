"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 80) {
                setIsVisible(currentScrollY < lastScrollY);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

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
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ y: -44 }}
                    animate={{ y: 0 }}
                    exit={{ y: -44 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="fixed left-0 right-0 h-11 z-40 border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg-primary)] dark:bg-[var(--color-bg-dark)]"
                    style={{ top: '80px' }} /* h-20 = 80px — exact header height */
                >
                    <div className="page-container h-full flex items-center justify-between">

                        {/* Nav links */}
                        <ul className="hidden md:flex items-center gap-0 h-full overflow-x-auto no-scrollbar">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.name} className="h-full flex items-center">
                                        <Link
                                            href={link.href}
                                            className={`
                                                relative h-full flex items-center px-4
                                                text-[10px] font-bold uppercase tracking-widest
                                                font-[var(--font-sans)]
                                                whitespace-nowrap
                                                transition-colors duration-200
                                                ${isActive
                                                    ? 'text-[var(--color-brand)]'
                                                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] dark:hover:text-[var(--color-text-light)]'
                                                }
                                            `}
                                        >
                                            {link.name}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-active-pill"
                                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-brand)]"
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Subscribe CTA */}
                        <Link
                            href="/subscribe"
                            className="
                                hidden sm:flex items-center gap-1.5
                                px-4 py-1.5
                                bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)]
                                text-white
                                text-[10px] font-bold uppercase tracking-widest
                                font-[var(--font-sans)]
                                transition-colors duration-200
                                whitespace-nowrap
                            "
                        >
                            <Mail className="w-3 h-3" />
                            Subscribe
                        </Link>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
