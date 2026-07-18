"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Calendar, MessageCircle,
    User, Link as LinkIcon, Facebook, Twitter, X,
    Users, Clapperboard, MonitorPlay
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RatingStars from "@/components/RatingStars";

export default function ReviewDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [user, setUser] = useState<any>(null);
    const [review, setReview] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data && !data.error) setUser(data); })
            .catch(() => {});

        if (slug) {
            fetch(`/api/reviews/${slug}`)
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && !data.error) {
                        setReview(data);
                        setComments(data.comments || []);
                    }
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        }
    }, [slug]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !review) return;
        if (!user) { setIsLoginModalOpen(true); return; }
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: newComment, reviewId: review.id, userId: user?.id }),
            });
            if (res.ok) {
                const newCmt = await res.json();
                setComments([newCmt, ...comments]);
                setNewComment("");
            }
        } catch {}
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="load-more-spinner" style={{ width: 28, height: 28 }} />
            </div>
        );
    }

    if (!review) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>Review not found.</p>
            </div>
        );
    }

    const {
        title = "", type = "Movie", genre = "", rating = 0,
        author = {}, createdAt = "", director, cast, availableOn,
        posterImage, gallery = "[]", content = ""
    } = review;

    const authorName = author.name || "Unknown Author";
    const publishDate = createdAt
        ? new Date(createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : "";
    const isBlog = type === "Blog";

    let parsedGallery: string[] = [];
    try {
        parsedGallery = JSON.parse(gallery);
        if (!Array.isArray(parsedGallery)) parsedGallery = [];
    } catch { parsedGallery = []; }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>

            {/* ── Login modal ── */}
            <AnimatePresence>
                {isLoginModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: '1rem' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.93 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.93 }}
                            style={{
                                backgroundColor: 'var(--color-bg-card)', maxWidth: 380, width: '100%',
                                padding: '2.5rem', border: '1px solid var(--color-border)',
                                position: 'relative', textAlign: 'center',
                            }}
                        >
                            <button onClick={() => setIsLoginModalOpen(false)}
                                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                                <X style={{ width: 18, height: 18 }} />
                            </button>
                            <div style={{ width: 56, height: 56, backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <User style={{ width: 24, height: 24, color: 'var(--color-text-muted)' }} />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 8 }}>
                                Sign In Required
                            </h3>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                                You need to be signed in to leave a comment and join the discussion.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <Link href="/login" style={{ display: 'block', padding: '11px', backgroundColor: 'var(--color-brand)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', textDecoration: 'none' }}>
                                    Sign In
                                </Link>
                                <Link href="/signup" style={{ display: 'block', padding: '11px', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', textDecoration: 'none' }}>
                                    Create Account
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Hero banner ── */}
            <div style={{ position: 'relative', width: '100%', backgroundColor: '#0D0D0D', overflow: 'hidden' }}>
                {/* Background poster blurred */}
                {posterImage && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                        <img src={posterImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, filter: 'blur(2px)', display: 'block' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,13,13,0.5) 0%, rgba(13,13,13,0.95) 100%)' }} />
                    </div>
                )}

                <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '3rem 1.25rem 2.5rem', display: 'flex', gap: '2.5rem', alignItems: 'flex-end' }}>

                    {/* Poster card */}
                    {posterImage && (
                        <div style={{ width: 160, flexShrink: 0, aspectRatio: '2/3', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', display: 'none' }}
                            className="md:block">
                            <img src={posterImage} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                    )}

                    {/* Meta */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Badges */}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span className="tag-label">{type}</span>
                            {!isBlog && genre && (
                                <span style={{
                                    display: 'inline-block', fontFamily: 'var(--font-sans)', fontSize: 10,
                                    fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                                    padding: '3px 8px', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)',
                                }}>
                                    {genre}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontFamily: 'var(--font-serif)', fontWeight: 700, margin: 0,
                            fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', color: '#F7F4EF',
                            lineHeight: 1.1, letterSpacing: '-0.02em',
                        }}>
                            {title}
                        </h1>

                        {/* Author + date + rating */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
                            {/* Author */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {author.image
                                        ? <img src={author.image} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{authorName.charAt(0).toUpperCase()}</span>
                                    }
                                </div>
                                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)' }}>
                                    By <span style={{ color: '#fff' }}>{authorName}</span>
                                </span>
                            </div>

                            {/* Divider */}
                            <span style={{ width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.2)' }} />

                            {/* Date */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Calendar style={{ width: 13, height: 13, color: 'rgba(255,255,255,0.4)' }} />
                                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
                                    {publishDate}
                                </span>
                            </div>

                            {/* Rating */}
                            {!isBlog && (
                                <>
                                    <span style={{ width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                    <RatingStars rating={Number(rating) / 2} size={16} gap={3} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main content + sidebar ── */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.25rem' }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

                    {/* ── Left: review body ── */}
                    <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                        {/* Review text */}
                        <div
                            className="prose prose-lg max-w-none"
                            style={{
                                fontFamily: 'var(--font-sans)', fontSize: '1rem',
                                lineHeight: 1.85, color: 'var(--color-text-main)',
                            }}
                            dangerouslySetInnerHTML={{ __html: content }}
                        />

                        {/* Gallery */}
                        {parsedGallery.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', paddingBottom: 8, borderBottom: '2px solid var(--color-text-main)', display: 'inline-block', margin: 0 }}>
                                    Screenshots & Stills
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {parsedGallery.map((img: string, idx: number) => (
                                        <div key={idx} style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                            <img src={img} alt={`Still ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div style={{ height: 1, backgroundColor: 'var(--color-border)' }} />

                        {/* Comments */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} id="comments">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <MessageCircle style={{ width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
                                    Public Comments ({comments.length})
                                </h3>
                            </div>

                            {/* Comment form */}
                            <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
                                <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)' }}>
                                    Post a Comment
                                </label>
                                <textarea
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    placeholder="What's your take on this cinematic piece?"
                                    rows={4}
                                    style={{
                                        width: '100%', resize: 'vertical', padding: '10px 12px',
                                        fontFamily: 'var(--font-sans)', fontSize: 14,
                                        border: '1px solid var(--color-border)', outline: 'none',
                                        backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-main)',
                                        transition: 'border-color 0.2s ease',
                                    }}
                                    onFocus={e => (e.target.style.borderColor = 'var(--color-brand)')}
                                    onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" style={{
                                        padding: '10px 24px', backgroundColor: 'var(--color-brand)', color: '#fff', border: 'none',
                                        fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700,
                                        textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer',
                                        transition: 'background-color 0.2s ease',
                                    }}
                                        onMouseEnter={e => ((e.target as HTMLElement).style.backgroundColor = 'var(--color-brand-hover)')}
                                        onMouseLeave={e => ((e.target as HTMLElement).style.backgroundColor = 'var(--color-brand)')}
                                    >
                                        Broadcast Comment
                                    </button>
                                </div>
                            </form>

                            {/* Comment list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {comments.length === 0 ? (
                                    <div style={{ padding: '2.5rem', textAlign: 'center', border: '1px dashed var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}>
                                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>
                                            Join the conversation
                                        </p>
                                    </div>
                                ) : comments.map((comment: any) => (
                                    <div key={comment.id} style={{ display: 'flex', gap: 14, padding: '1.25rem', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                                        <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: '50%', backgroundColor: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {comment.user?.image
                                                ? <img src={comment.user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                : <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{(comment.user?.name || 'U').charAt(0).toUpperCase()}</span>
                                            }
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, paddingBottom: 6, borderBottom: '1px solid var(--color-border)' }}>
                                                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-main)' }}>
                                                    {comment.user?.name || "Anonymous"}
                                                </span>
                                                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--color-text-muted)' }}>
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-text-main)', lineHeight: 1.65, margin: 0 }}>
                                                {comment.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Sidebar ── */}
                    <div>
                        <div style={{ position: 'sticky', top: 130, display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}>

                            {/* Project Credits */}
                            {!isBlog && (
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                                        Project Credits
                                    </h3>

                                    {[
                                        { Icon: Clapperboard, label: 'Director / Creator', value: director },
                                        { Icon: Users, label: 'Cast Ensemble', value: cast },
                                        { Icon: MonitorPlay, label: 'Available On', value: availableOn },
                                    ].map(({ Icon, label, value }) => (
                                        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: '1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Icon style={{ width: 12, height: 12, color: 'var(--color-text-muted)', flexShrink: 0 }} />
                                                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>
                                                    {label}
                                                </span>
                                            </div>
                                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--color-text-main)', margin: 0, lineHeight: 1.5, paddingLeft: 18 }}>
                                                {value || "No record available"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Share */}
                            <div style={{ padding: '1.25rem 1.5rem' }}>
                                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                    Share
                                </h4>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {[
                                        { Icon: Facebook, onClick: () => {} },
                                        { Icon: Twitter, onClick: () => {} },
                                        { Icon: LinkIcon, onClick: copyToClipboard },
                                    ].map(({ Icon, onClick }, i) => (
                                        <button key={i} onClick={onClick} style={{
                                            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)',
                                            color: 'var(--color-text-muted)', cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-brand)';
                                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-brand)';
                                                (e.currentTarget as HTMLElement).style.color = '#fff';
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg-primary)';
                                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                                                (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
                                            }}
                                        >
                                            <Icon style={{ width: 14, height: 14 }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
