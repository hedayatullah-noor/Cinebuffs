import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone as WhatsApp } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-[var(--color-text-main)] dark:bg-[var(--color-bg-dark)] mt-20 border-t-4 border-[var(--color-brand)]">

            {/* ── Main footer grid ── */}
            <div className="page-container pt-14 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

                    {/* Left: Logo + tagline (5 cols) */}
                    <div className="md:col-span-5 flex flex-col gap-5">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/uploads/logo.png"
                                alt="CineBuffs"
                                width={140}
                                height={42}
                                className="h-10 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="text-[var(--color-text-muted)] text-xs font-[var(--font-sans)] leading-relaxed max-w-xs">
                            The ultimate platform for high-quality movie and series reviews.
                            Join our growing community of cinephiles today.
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-2 mt-1">
                            {[
                                { Icon: Facebook, href: "#", label: "Facebook" },
                                { Icon: Instagram, href: "#", label: "Instagram" },
                                { Icon: WhatsApp, href: "#", label: "WhatsApp" },
                                { Icon: Youtube, href: "#", label: "YouTube" },
                            ].map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="
                                        w-8 h-8 border border-[#3A3A3A] dark:border-[var(--color-border-dark)]
                                        flex items-center justify-center
                                        text-[var(--color-text-muted)]
                                        hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]
                                        transition-colors duration-200
                                    "
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Middle: Explore links (4 cols) */}
                    <div className="md:col-span-4">
                        <h3 className="
                            font-[var(--font-sans)] text-[10px] font-bold uppercase tracking-widest
                            text-[var(--color-text-muted)] mb-5 pb-2
                            border-b border-[#3A3A3A] dark:border-[var(--color-border-dark)]
                        ">
                            Explore
                        </h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            {[
                                { name: "Home", href: "/" },
                                { name: "Series Review", href: "/series" },
                                { name: "About Us", href: "/about" },
                                { name: "Contact Us", href: "/contact" },
                                { name: "Movie Review", href: "/movies" },
                                { name: "Blog", href: "/blog" },
                                { name: "Contributors", href: "/contributors" },
                                { name: "Subscribe", href: "/subscribe" },
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="
                                        text-[11px] font-[var(--font-sans)]
                                        text-[var(--color-text-muted)]
                                        hover:text-white dark:hover:text-white
                                        transition-colors duration-200
                                    "
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right: Newsletter CTA (3 cols) */}
                    <div className="md:col-span-3">
                        <h3 className="
                            font-[var(--font-sans)] text-[10px] font-bold uppercase tracking-widest
                            text-[var(--color-text-muted)] mb-5 pb-2
                            border-b border-[#3A3A3A] dark:border-[var(--color-border-dark)]
                        ">
                            Newsletter
                        </h3>
                        <p className="text-[var(--color-text-muted)] text-xs font-[var(--font-sans)] leading-relaxed mb-4">
                            Get the latest reviews delivered to your inbox.
                        </p>
                        <Link
                            href="/subscribe"
                            className="
                                inline-flex items-center gap-2
                                px-4 py-2
                                bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)]
                                text-white
                                text-[10px] font-bold uppercase tracking-widest
                                font-[var(--font-sans)]
                                transition-colors duration-200
                            "
                        >
                            Subscribe Now
                        </Link>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="border-t border-[#3A3A3A] dark:border-[var(--color-border-dark)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[var(--color-text-muted)] text-[10px] font-[var(--font-sans)] uppercase tracking-widest">
                        CineBuffs &copy;{currentYear} &nbsp;|&nbsp; All Rights Reserved
                    </p>
                    <div className="flex items-center gap-5">
                        <Link href="/privacy" className="text-[var(--color-text-muted)] hover:text-white dark:hover:text-white text-[10px] font-[var(--font-sans)] uppercase tracking-widest transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-[var(--color-text-muted)] hover:text-white dark:hover:text-white text-[10px] font-[var(--font-sans)] uppercase tracking-widest transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
