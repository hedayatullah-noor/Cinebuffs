"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteProgressBar() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [width, setWidth] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const prevPathRef = useRef(pathname);

    useEffect(() => {
        // Route changed
        if (pathname !== prevPathRef.current) {
            prevPathRef.current = pathname;

            // Start bar
            setVisible(true);
            setWidth(0);

            // Animate to 90% quickly
            setTimeout(() => setWidth(70), 50);
            setTimeout(() => setWidth(90), 300);

            // Complete after page renders
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setWidth(100);
                setTimeout(() => {
                    setVisible(false);
                    setWidth(0);
                }, 300);
            }, 500);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [pathname]);

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999,
                height: '2px',
                width: `${width}%`,
                backgroundColor: 'var(--color-brand)',
                transition: width === 100
                    ? 'width 0.2s ease, opacity 0.3s ease'
                    : 'width 0.4s ease',
                opacity: width === 100 ? 0 : 1,
                pointerEvents: 'none',
            }}
        />
    );
}
