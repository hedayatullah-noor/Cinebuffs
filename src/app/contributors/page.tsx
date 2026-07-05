"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail } from "lucide-react";

export default function ContributorsPage() {
    const [contributors, setContributors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/contributors")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setContributors(data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const getRoleLabel = (role: string) => {
        if (role === 'ADMIN') return 'Chief Editor';
        if (role === 'MODERATOR') return 'Senior Contributor';
        return 'Story Contributor';
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg-primary)" }}>

            {/* ── Page header ── */}
            <div className="w-full px-5 pt-10 pb-10" style={{ borderBottom: "2px solid var(--color-text-main)" }}>
                <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
                    <p style={{
                        fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        color: "var(--color-brand)", marginBottom: 16,
                    }}>
                        CineBuffs / Contributors
                    </p>
                    <h1 style={{
                        fontFamily: "var(--font-serif)", fontWeight: 700,
                        fontSize: "clamp(2rem, 5vw, 3.5rem)",
                        color: "var(--color-text-main)", lineHeight: 1.1,
                        letterSpacing: "-0.02em", marginBottom: 16,
                    }}>
                        Featured Contributors
                    </h1>
                    <p style={{
                        fontFamily: "var(--font-sans)", fontSize: 13,
                        color: "var(--color-text-muted)", maxWidth: 500,
                        lineHeight: 1.6, margin: "0 auto",
                    }}>
                        The critics, writers, and cinephiles behind every review and essay on CineBuffs.
                    </p>
                </div>
            </div>

            {/* ── Loading ── */}
            {loading && (
                <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
                    <div className="load-more-spinner" />
                </div>
            )}

            {/* ── Contributors list — Roger Ebert style ── */}
            {!loading && (
                <div style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0", borderTop: "1px solid var(--color-border)" }}>
                        {contributors.map((person, idx) => (
                            <motion.div
                                key={person.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08, duration: 0.4 }}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "1.5rem",
                                    padding: "2.5rem",
                                    borderBottom: "1px solid var(--color-border)",
                                    borderRight: idx % 2 === 0 ? "1px solid var(--color-border)" : "none",
                                }}
                            >
                                {/* ── Circular avatar — Roger Ebert style ── */}
                                <div style={{ flexShrink: 0 }}>
                                    <div style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        border: "2px solid var(--color-border)",
                                        backgroundColor: "#e8e5e0",
                                        flexShrink: 0,
                                    }}>
                                        {person.image ? (
                                            <img
                                                src={person.image}
                                                alt={person.name}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    objectPosition: "center top",
                                                    display: "block",
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: "100%", height: "100%",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                backgroundColor: "var(--color-brand)",
                                            }}>
                                                <span style={{
                                                    color: "#fff",
                                                    fontSize: "2rem",
                                                    fontFamily: "var(--font-serif)",
                                                    fontWeight: 700,
                                                }}>
                                                    {person.name?.charAt(0)?.toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ── Info ── */}
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                                    {/* Name */}
                                    <h2 style={{
                                        fontFamily: "var(--font-serif)",
                                        fontWeight: 700,
                                        fontSize: "clamp(1.25rem, 2.5vw, 1.6rem)",
                                        color: "var(--color-text-main)",
                                        margin: 0,
                                        lineHeight: 1.2,
                                    }}>
                                        {person.name}
                                    </h2>

                                    {/* Role */}
                                    <p style={{
                                        fontFamily: "var(--font-sans)",
                                        fontSize: 11,
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        color: "var(--color-brand)",
                                        margin: 0,
                                    }}>
                                        {getRoleLabel(person.role)}
                                    </p>

                                    {/* Bio */}
                                    <p style={{
                                        fontFamily: "var(--font-sans)",
                                        fontSize: 14,
                                        color: person.bio ? "var(--color-text-main)" : "var(--color-text-muted)",
                                        lineHeight: 1.75,
                                        fontStyle: person.bio ? "normal" : "italic",
                                        margin: 0,
                                        maxWidth: 600,
                                    }}>
                                        {person.bio || "No bio available for this contributor yet."}
                                    </p>

                                    {/* Links */}
                                    <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                                        {person.email && (
                                            <a
                                                href={`mailto:${person.email}`}
                                                style={{
                                                    display: "flex", alignItems: "center", gap: 5,
                                                    fontFamily: "var(--font-sans)", fontSize: 11,
                                                    fontWeight: 700, textTransform: "uppercase",
                                                    letterSpacing: "0.08em",
                                                    color: "var(--color-text-muted)",
                                                    textDecoration: "none",
                                                    transition: "color 0.2s ease",
                                                }}
                                                onMouseEnter={e => (e.currentTarget.style.color = "var(--color-brand)")}
                                                onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
                                            >
                                                <Mail style={{ width: 12, height: 12 }} />
                                                Contact
                                            </a>
                                        )}
                                        <Link
                                            href={`/profile/${person.id}`}
                                            style={{
                                                display: "flex", alignItems: "center", gap: 5,
                                                fontFamily: "var(--font-sans)", fontSize: 11,
                                                fontWeight: 700, textTransform: "uppercase",
                                                letterSpacing: "0.08em",
                                                color: "var(--color-brand)",
                                                textDecoration: "none",
                                            }}
                                        >
                                            Full Profile →
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer note */}
                    <p style={{
                        textAlign: "center",
                        marginTop: "3rem",
                        fontFamily: "var(--font-sans)",
                        fontSize: 10,
                        color: "var(--color-text-muted)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                    }}>
                        CineBuffs Editorial Board · Established 2024
                    </p>
                </div>
            )}
        </div>
    );
}
