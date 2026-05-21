"use client";

import { useEffect, useState } from "react";
import { User, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>

            {/* ── Page header ── */}
            <div className="w-full px-5 pt-10 pb-8" style={{ borderBottom: '2px solid var(--color-text-main)' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: 'var(--color-brand)', marginBottom: 12,
                    }}>
                        CineBuffs / Contributors
                    </p>
                    <h1 style={{
                        fontFamily: 'var(--font-serif)', fontWeight: 700,
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        color: 'var(--color-text-main)', lineHeight: 1.1,
                        letterSpacing: '-0.02em', marginBottom: 14,
                    }}>
                        Featured Contributors
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: 13,
                        color: 'var(--color-text-muted)', maxWidth: 500, lineHeight: 1.6,
                    }}>
                        The critics, writers, and cinephiles behind every review and essay on CineBuffs.
                    </p>
                </div>
            </div>

            {/* ── Loading ── */}
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                    <div className="load-more-spinner" />
                </div>
            )}

            {/* ── Contributors grid ── */}
            {!loading && (
                <div style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 1.25rem' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px"
                        style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-border)' }}>
                        {contributors.map((person, idx) => (
                            <motion.div
                                key={person.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08, duration: 0.4 }}
                                style={{
                                    backgroundColor: 'var(--color-bg-card)',
                                    padding: '2rem',
                                    display: 'flex',
                                    gap: '1.5rem',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: 80, height: 80, flexShrink: 0,
                                    overflow: 'hidden', backgroundColor: '#e8e5e0',
                                    border: '1px solid var(--color-border)',
                                }}>
                                    {person.image ? (
                                        <img
                                            src={person.image}
                                            alt={person.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User style={{ width: 28, height: 28, color: '#aaa' }} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                                    {/* Name + role */}
                                    <div>
                                        <h2 style={{
                                            fontFamily: 'var(--font-serif)', fontWeight: 700,
                                            fontSize: '1.15rem', color: 'var(--color-text-main)', margin: 0,
                                        }}>
                                            {person.name}
                                        </h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                            <span style={{
                                                display: 'block', width: 16, height: 2,
                                                backgroundColor: 'var(--color-brand)', flexShrink: 0,
                                            }} />
                                            <span style={{
                                                fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700,
                                                textTransform: 'uppercase', letterSpacing: '0.1em',
                                                color: 'var(--color-text-muted)',
                                            }}>
                                                {person.role === 'ADMIN' ? 'Chief Editor' :
                                                 person.role === 'MODERATOR' ? 'Senior Contributor' : 'Story Contributor'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <p style={{
                                        fontFamily: 'var(--font-sans)', fontSize: 13,
                                        color: 'var(--color-text-muted)', lineHeight: 1.6,
                                        fontStyle: person.bio ? 'normal' : 'italic',
                                    }}>
                                        {person.bio || "No bio available for this contributor yet."}
                                    </p>

                                    {/* Links */}
                                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                                        {person.email && (
                                            <a
                                                href={`mailto:${person.email}`}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 4,
                                                    fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700,
                                                    textTransform: 'uppercase', letterSpacing: '0.08em',
                                                    color: 'var(--color-text-muted)',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.2s ease',
                                                }}
                                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-brand)')}
                                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                                            >
                                                <Mail style={{ width: 11, height: 11 }} /> Contact
                                            </a>
                                        )}
                                        <Link
                                            href={`/profile/${person.id}`}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 4,
                                                fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700,
                                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                                color: 'var(--color-brand)', textDecoration: 'none',
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
                        textAlign: 'center', marginTop: '3rem',
                        fontFamily: 'var(--font-sans)', fontSize: 10,
                        color: 'var(--color-text-muted)', letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                    }}>
                        CineBuffs Editorial Board · Established 2024
                    </p>
                </div>
            )}
        </div>
    );
}
