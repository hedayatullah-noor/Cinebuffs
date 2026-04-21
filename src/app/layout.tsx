import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "CineBuffs - Modern Film & Series Review Platform",
  description: "High-performance, scalable film and series review platform with curated community insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-white antialiased font-sans transition-colors duration-300`} suppressHydrationWarning>
        <Suspense fallback={null}>
          <Header />
          <Navbar />
        </Suspense>
        <main className="w-full h-full flex flex-col pt-[120px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
