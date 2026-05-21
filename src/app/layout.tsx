import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import RouteProgressBar from "@/components/RouteProgressBar";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

export const metadata: Metadata = {
    title: "CineBuffs — Film & Series Reviews",
    description: "High-quality movie and series reviews by passionate cinephiles.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            try {
                                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                    document.documentElement.classList.add('dark');
                                } else {
                                    document.documentElement.classList.remove('dark');
                                }
                            } catch (_) {}
                        `,
                    }}
                />
            </head>
            <body
                className={`${inter.variable} ${playfair.variable} min-h-screen antialiased`}
                suppressHydrationWarning
            >
                {/* Crimson progress bar on route change */}
                <Suspense fallback={null}>
                    <RouteProgressBar />
                </Suspense>

                {/* Fixed header + navbar */}
                <Suspense fallback={null}>
                    <Header />
                    <Navbar />
                </Suspense>

                {/*
                    pt-[124px] = Header (80px) + Navbar (44px)
                    PageTransition wraps all page content for smooth fade
                */}
                <main className="w-full min-h-screen pt-[124px]">
                    <Suspense fallback={null}>
                        <PageTransition>
                            {children}
                        </PageTransition>
                    </Suspense>
                </main>

                <Footer />
            </body>
        </html>
    );
}
