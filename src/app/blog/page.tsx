"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function BlogPage() {
    const [blogs, setBlogs]     = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/reviews?status=APPROVED&type=Blog")
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setBlogs(data); })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg-primary)" }}>

            {/* ── Editorial page header ── */}
            <div className="w-full px-5 pt-10 pb-8" style={{ borderBottom: "2px solid var(--color-text-main)" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <p style={{
                        fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        color: "var(--color-brand)", marginBottom: 12,
                    }}>
                        CineBuffs / Blog
                    </p>
                    <h1 style={{
                        fontFamily: "var(--font-serif)", fontWeight: 700,
                        fontSize: "clamp(2rem, 5vw, 3.5rem)",
                        color: "var(--color-text-main)", lineHeight: 1.1,
                        letterSpacing: "-0.02em", marginBottom: 14,
                    }}>
                        The Blog
                    </h1>
                    <p style={{
                        fontFamily: "var(--font-sans)", fontSize: 13,
                        color: "var(--color-text-muted)", maxWidth: 520,
                        lineHeight: 1.6,
                    }}>
                        Editorials, essays, and special features on the art of cinema.
                    </p>
                </div>
            </div>

            {/* ── Blog list ── */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.25rem" }}>

                {/* Loading */}
                {loading && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="skeleton-shimmer" style={{ height: 180, width: "100%" }} />
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!loading && blogs.length === 0 && (
                    <div style={{ textAlign: "center", padding: "4rem 0" }}>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--color-text-muted)" }}>
                            No blog posts yet.
                        </p>
                    </div>
                )}

                {/* Horizontal blog cards */}
                {!loading && blogs.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {blogs.map((blog, idx) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-20px" }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                            >
                                <Link
                                    href={`/reviews/${blog.slug}`}
                                    className="blog-horiz-card"
                                    style={{ display: "flex", flexDirection: "row", textDecoration: "none", backgroundColor: "var(--color-bg-card)", overflow: "hidden", border: "1px solid var(--color-border)" }}
                                >
                                    <style>{`
                                        .blog-horiz-card { height: auto; }
                                        @media (min-width: 640px) { .blog-horiz-card { height: 260px; } }
                                        .blog-horiz-thumb { width: 100%; height: 220px; flex-shrink: 0; }
                                        @media (min-width: 640px) { .blog-horiz-thumb { width: 380px; height: 100%; } }
                                        @media (min-width: 1024px) { .blog-horiz-thumb { width: 460px; } }
                                        .blog-horiz-card:hover .blog-horiz-img { transform: scale(1.04); }
                                        .blog-horiz-card:hover .blog-horiz-title { color: var(--color-brand) !important; }
                                    `}</style>

                                    {/* Image */}
                                    <div
                                        className="blog-horiz-thumb"
                                        style={{ position: "relative", overflow: "hidden", backgroundColor: "#111", flexShrink: 0 }}
                                    >
                                        <img
                                            src={blog.sliderImage || blog.posterImage}
                                            alt={blog.title}
                                            className="blog-horiz-img"
                                            style={{
                                                width: "100%", height: "100%",
                                                objectFit: "cover", objectPosition: "center",
                                                display: "block",
                                                transition: "transform 0.5s ease",
                                            }}
                                        />
                                        {/* Blog badge */}
                                        <div style={{ position: "absolute", top: 0, left: 0 }}>
                                            <span className="tag-label">Blog</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        padding: "1.5rem 2rem",
                                        gap: 12,
                                        overflow: "hidden",
                                        borderLeft: "1px solid var(--color-border)",
                                    }}>
                                        {/* Number indicator */}
                                        <span style={{
                                            fontFamily: "var(--font-serif)",
                                            fontSize: "2.5rem",
                                            fontWeight: 700,
                                            color: "var(--color-border)",
                                            lineHeight: 1,
                                            userSelect: "none",
                                        }}>
                                            {String(idx + 1).padStart(2, "0")}
                                        </span>

                                        {/* Title */}
                                        <h2
                                            className="blog-horiz-title"
                                            style={{
                                                fontFamily: "var(--font-serif)",
                                                fontWeight: 700,
                                                fontSize: "clamp(1rem, 2vw, 1.35rem)",
                                                color: "var(--color-text-main)",
                                                margin: 0,
                                                lineHeight: 1.3,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                transition: "color 0.2s ease",
                                            }}
                                        >
                                            {blog.title}
                                        </h2>

                                        {/* Meta */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                                            <span style={{
                                                fontFamily: "var(--font-sans)", fontSize: 10,
                                                fontWeight: 700, textTransform: "uppercase",
                                                letterSpacing: "0.1em", color: "var(--color-text-muted)",
                                            }}>
                                                By {blog.author?.name || "Unknown"}
                                            </span>
                                            <span style={{ width: 1, height: 12, backgroundColor: "var(--color-border)" }} />
                                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                <Calendar style={{ width: 11, height: 11, color: "var(--color-text-muted)" }} />
                                                <span style={{
                                                    fontFamily: "var(--font-sans)", fontSize: 10,
                                                    color: "var(--color-text-muted)",
                                                }}>
                                                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                        month: "long", day: "numeric", year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Red rule */}
                                        <span style={{ display: "block", width: 32, height: 2, backgroundColor: "var(--color-brand)" }} />

                                        {/* Read more */}
                                        <span style={{
                                            fontFamily: "var(--font-sans)", fontSize: 10,
                                            fontWeight: 700, textTransform: "uppercase",
                                            letterSpacing: "0.1em", color: "var(--color-brand)",
                                        }}>
                                            Read Article →
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
