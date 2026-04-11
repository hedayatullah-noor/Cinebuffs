"use client";

import { motion } from "framer-motion";

interface AdSpaceProps {
    type?: "leaderboard" | "billboard" | "rectangle" | "banner";
    className?: string;
}

export default function AdSpace({ type = "leaderboard", className = "" }: AdSpaceProps) {
    const variants = {
        leaderboard: {
            container: "w-full py-8 bg-[var(--color-bg-dark)] dark:bg-black/20 border-y border-[var(--color-black)]/10 dark:border-white/5",
            content: "w-full max-w-[1240px] h-[90px] mx-auto",
            size: "728 x 90 Leaderboard"
        },
        billboard: {
            container: "w-full py-12 bg-[var(--color-bg-dark)] dark:bg-black/40 border-y border-[var(--color-black)]/10 dark:border-white/5 my-8",
            content: "w-full max-w-[1500px] h-[300px] lg:h-[450px] mx-auto px-6",
            size: "1500 x 450 Standard Banner"
        },
        rectangle: {
            container: "w-full bg-[var(--color-bg-card)] dark:bg-white/5 rounded-2xl border border-[var(--color-black)]/10 dark:border-white/10 p-4",
            content: "w-full aspect-square max-w-[300px] mx-auto",
            size: "300 x 250 Rectangle"
        },
        banner: {
            container: "w-full pt-8 pb-4",
            content: "w-full h-[120px] rounded-2xl border border-[var(--color-black)]/10 dark:border-white/10 bg-[var(--color-bg-card)] dark:bg-white/5",
            size: "Standard Feed Banner"
        }
    };

    const config = variants[type];

    return (
        <div className={`${config.container} ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`${config.content} relative rounded-xl overflow-hidden group border border-black/5 dark:border-white/10 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-dark)] shadow-sm dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]`}
            >
                {/* Visual Flair */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 grayscale group-hover:opacity-10 transition-all duration-700" />
                <div className="absolute top-2 right-4 bg-[var(--color-brand)]/10 px-2 py-0.5 rounded text-[10px] text-[var(--color-brand)] uppercase tracking-widest border border-[var(--color-brand)]/20 font-bold">Advertisement</div>

                <h3 className="relative z-10 text-xl font-black text-black/20 dark:text-white/30 uppercase tracking-[0.25em] group-hover:text-[var(--color-brand)] transition-colors italic">SPACE AVAILABLE</h3>
                <p className="relative z-10 mt-1 text-[10px] text-white/20 uppercase tracking-widest font-bold font-mono">{config.size}</p>

                {/* Glow Effect */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--color-brand)]/5 blur-3xl rounded-full" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full" />
            </motion.div>
        </div>
    );
}
