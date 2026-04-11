"use client";

import { useEffect, useState, useRef } from "react";
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
                if (currentScrollY > lastScrollY) {
                    setIsVisible(false); // Scrolling down
                } else {
                    setIsVisible(true); // Scrolling up
                }
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
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: -100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed top-20 left-0 right-0 h-10 bg-white dark:bg-zinc-950 border-b-2 border-black dark:border-gray-800 z-40 px-6 flex items-center justify-between transition-colors duration-300 shadow-sm"
                >
                    <ul className="flex items-center gap-8 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden w-full md:w-auto h-full px-2">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <li key={link.name} className="h-full flex items-center">
                                    <Link
                                        href={link.href}
                                        className={`text-[10px] font-black uppercase tracking-widest transition-colors hover:text-[var(--color-brand)] h-full flex items-center relative whitespace-nowrap ${isActive ? "text-[var(--color-brand)]" : "text-black dark:text-gray-300"}`}
                                    >
                                        {link.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand)]"
                                            />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <Link href="/subscribe" className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-black dark:bg-white text-white dark:text-black hover:bg-[var(--color-brand)] dark:hover:bg-[var(--color-brand)] dark:hover:text-white text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border border-black dark:border-white">
                        <Mail className="w-3 h-3" />
                        Subscribe
                    </Link>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
