"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setTimeout(() => setStatus("success"), 1500);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>

            {/* ── Page header ── */}
            <div className="w-full px-5 pt-10 pb-8" style={{ borderBottom: '2px solid var(--color-text-main)' }}>
                <div style={{ maxWidth: 860, margin: '0 auto' }}>
                    <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: 'var(--color-brand)', marginBottom: 12,
                    }}>
                        CineBuffs / Contact
                    </p>
                    <h1 style={{
                        fontFamily: 'var(--font-serif)', fontWeight: 700,
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        color: 'var(--color-text-main)', lineHeight: 1.1,
                        letterSpacing: '-0.02em', marginBottom: 14,
                    }}>
                        Get in Touch
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: 13,
                        color: 'var(--color-text-muted)', maxWidth: 520,
                        lineHeight: 1.6,
                    }}>
                        Questions, feedback, collaboration ideas, or guest contributions — we&apos;d love to hear from you.
                    </p>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '3.5rem 1.25rem' }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* Left: info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                <MessageSquare style={{ width: 18, height: 18, color: 'var(--color-brand)', flexShrink: 0 }} />
                                <h2 style={{
                                    fontFamily: 'var(--font-serif)', fontWeight: 700,
                                    fontSize: '1.35rem', color: 'var(--color-text-main)', margin: 0,
                                }}>
                                    Drop Us a Line
                                </h2>
                            </div>
                            <span style={{ display: 'block', width: 32, height: 2, backgroundColor: 'var(--color-brand)', marginBottom: 16 }} />
                            <p style={{
                                fontFamily: 'var(--font-sans)', fontSize: 14,
                                color: 'var(--color-text-muted)', lineHeight: 1.7,
                            }}>
                                Fill out the form and we&apos;ll get back to you as soon as possible. You can also connect with us on social media for the latest updates.
                            </p>
                        </div>

                        <div style={{
                            display: 'flex', flexDirection: 'column', gap: 16,
                            padding: '1.5rem', backgroundColor: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                        }}>
                            {[
                                { label: "Reviews & Ratings", desc: "Questions about our review methodology" },
                                { label: "Guest Contributions", desc: "Want to write for CineBuffs?" },
                                { label: "Advertising", desc: "Partnership and sponsorship inquiries" },
                                { label: "General Feedback", desc: "Help us improve the platform" },
                            ].map(({ label, desc }) => (
                                <div key={label} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
                                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-main)', marginBottom: 2 }}>
                                        {label}
                                    </p>
                                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--color-text-muted)' }}>
                                        {desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: form */}
                    <div>
                        {status === "success" ? (
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'center', gap: 16, padding: '3rem',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-card)',
                                textAlign: 'center', minHeight: 320,
                            }}>
                                <CheckCircle style={{ width: 40, height: 40, color: 'var(--color-brand)' }} />
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                                    Message Sent
                                </h3>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-text-muted)' }}>
                                    Thank you for reaching out. We&apos;ll be in touch shortly.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {/* Name + Email row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: "Your Name", placeholder: "John Doe", type: "text", required: true },
                                        { label: "Email Address", placeholder: "hello@example.com", type: "email", required: true },
                                    ].map(({ label, placeholder, type, required }) => (
                                        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                                                {label}
                                            </label>
                                            <input
                                                type={type}
                                                placeholder={placeholder}
                                                required={required}
                                                style={{
                                                    padding: '10px 14px', fontFamily: 'var(--font-sans)', fontSize: 13,
                                                    border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)',
                                                    color: 'var(--color-text-main)', outline: 'none',
                                                }}
                                                onFocus={e => (e.target.style.borderColor = 'var(--color-brand)')}
                                                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Subject */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Write a clear subject"
                                        required
                                        style={{
                                            padding: '10px 14px', fontFamily: 'var(--font-sans)', fontSize: 13,
                                            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)',
                                            color: 'var(--color-text-main)', outline: 'none',
                                        }}
                                        onFocus={e => (e.target.style.borderColor = 'var(--color-brand)')}
                                        onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                                    />
                                </div>

                                {/* Message */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                                        Your Message
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="How can we help you?"
                                        required
                                        style={{
                                            padding: '10px 14px', fontFamily: 'var(--font-sans)', fontSize: 13,
                                            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)',
                                            color: 'var(--color-text-main)', outline: 'none', resize: 'vertical',
                                        }}
                                        onFocus={e => (e.target.style.borderColor = 'var(--color-brand)')}
                                        onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    style={{
                                        alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '11px 28px', backgroundColor: 'var(--color-brand)',
                                        color: '#fff', border: 'none', cursor: status === "submitting" ? 'not-allowed' : 'pointer',
                                        fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700,
                                        textTransform: 'uppercase', letterSpacing: '0.12em',
                                        opacity: status === "submitting" ? 0.7 : 1,
                                        transition: 'opacity 0.2s ease',
                                    }}
                                >
                                    <Send style={{ width: 13, height: 13 }} />
                                    {status === "submitting" ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
