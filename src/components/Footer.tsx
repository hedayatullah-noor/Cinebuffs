import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone as WhatsApp } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-white dark:bg-zinc-950 border-t-4 border-black dark:border-white pt-16 pb-8 px-6 mt-20 transition-colors">
            <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                {/* Left: Logo + CineBuffs */}
                <div className="flex flex-col gap-4 items-start">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-3xl font-black font-serif tracking-tight text-black dark:text-white uppercase transition-colors">Cine<span className="text-[var(--color-brand)]">Buffs</span></span>
                    </Link>
                    <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest max-w-sm mt-2 leading-relaxed">
                        The ultimate platform for high-quality movie and series reviews. Join our growing community of cinephiles today.
                    </p>
                </div>

                {/* Middle: Navigation Links */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-black dark:text-white font-black font-serif text-lg uppercase tracking-tight mb-2 border-b-2 border-black dark:border-white w-fit pr-4 pb-1 transition-colors">Explore</h3>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                        <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Home</Link>
                        <Link href="/series" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Series Review</Link>
                        <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">About Us</Link>
                        <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Contact Us</Link>
                        <Link href="/movies" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Movie Review</Link>
                        <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Blog</Link>
                    </div>
                </div>

                {/* Right: Follow Us */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-black dark:text-white font-black font-serif text-lg uppercase tracking-tight mb-2 border-b-2 border-black dark:border-white w-fit pr-4 pb-1 transition-colors">Follow Us</h3>
                    <div className="flex items-center gap-3">
                        <a href="#" className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"><Facebook className="w-4 h-4" /></a>
                        <a href="#" className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"><Instagram className="w-4 h-4" /></a>
                        <a href="#" className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"><WhatsApp className="w-4 h-4" /></a>
                        <a href="#" className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"><Youtube className="w-4 h-4" /></a>
                    </div>
                </div>
            </div>

            <div className="max-w-[1500px] mx-auto border-t-2 border-black dark:border-white pt-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest transition-colors">CineBuffs @2026 | All Rights Reserved</p>
                <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                    <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
