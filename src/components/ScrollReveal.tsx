"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;          /* seconds, default 0 */
    duration?: number;       /* seconds, default 0.45 */
    y?: number;              /* initial y offset, default 20 */
    once?: boolean;          /* animate only first time, default true */
    className?: string;
    style?: React.CSSProperties;
}

export default function ScrollReveal({
    children,
    delay = 0,
    duration = 0.45,
    y = 20,
    once = true,
    className,
    style,
}: ScrollRevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, margin: "-40px" }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}
