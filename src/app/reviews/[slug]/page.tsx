"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Star, StarHalf, Clock, Calendar, Share2,
    MessageCircle, ChevronLeft, ChevronRight,
    User, Link as LinkIcon, Facebook, Twitter, X,
    PlayCircle, Users, Clapperboard, MonitorPlay
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RatingStars from "@/components/RatingStars";

export default function ReviewDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [review, setReview] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    useEffect(() => {
        // Fetch user context if auth route exists
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && !data.error) setUser(data);
            })
            .catch(() => { });

        // Fetch Review
        if (slug) {
            console.log("Fetching review data for slug:", slug);
            fetch(`/api/reviews/${slug}`)
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && !data.error) {
                        setReview(data);
                        setComments(data.comments || []);
                    }
                })
                .catch(() => { })
                .finally(() => setLoading(false));
        }
    }, [slug]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !review) return;

        // Force Login
        if (!user) {
            setIsLoginModalOpen(true);
            return;
        }

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: newComment,
                    reviewId: review.id,
                    userId: user?.id, // Optional, goes to fallback user if missing
                })
            });

            if (res.ok) {
                const newCmt = await res.json();
                setComments([newCmt, ...comments]);
                setNewComment("");
            } else {
                alert("Failed to post comment.");
            }
        } catch (err) {
            console.error("Comment submit error:", err);
            alert("Error posting comment.");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) stars.push(<Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />);
            else if (rating >= i - 0.5) stars.push(<StarHalf key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />);
            else stars.push(<Star key={i} className="w-5 h-5 text-white/20" />);
        }
        return stars;
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center font-black tracking-widest text-xl uppercase">Loading...</div>;
    }

    if (!review) {
        return <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center font-black tracking-widest text-2xl uppercase font-serif">No review found</div>;
    }

    const {
        title = "No title",
        category = "No category",
        type = "No type",
        genre = "No genre",
        rating = 0,
        author = {},
        createdAt = "",
        director,
        cast,
        availableOn,
        posterImage,
        gallery = "[]",
        content = "No content"
    } = review;

    const authorName = author.name || "Unknown Author";
    const publishDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "No date";

    // Parse gallery JSON string
    let parsedGallery: string[] = [];
    try {
        parsedGallery = JSON.parse(gallery);
        if (!Array.isArray(parsedGallery)) parsedGallery = [];
    } catch {
        parsedGallery = [];
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white pb-20 transition-colors duration-300">

            {/* Login Required Modal */}
            <AnimatePresence>
                {isLoginModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-zinc-900 max-w-sm w-full rounded-none p-8 border-2 border-black dark:border-white text-center relative shadow-2xl"
                        >
                            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 border-2 border-black dark:border-white text-black dark:text-white flex items-center justify-center mx-auto mb-6">
                                <User className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black font-serif mb-2 uppercase">Login Required</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 font-black uppercase tracking-widest text-[10px]">You need to be signed in to leave a comment and join the discussion.</p>
                            <div className="flex flex-col gap-3">
                                <Link href="/login" className="w-full py-3 border-2 border-black bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest text-xs hover:bg-[var(--color-brand)] dark:hover:bg-[var(--color-brand)] dark:hover:text-white transition-colors">
                                    Log In
                                </Link>
                                <Link href="/signup" className="w-full py-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-950 text-black dark:text-white font-black uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors">
                                    Create an Account
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <div className="relative w-full min-h-[50vh] flex items-end pb-12 pt-32 bg-gray-50 dark:bg-zinc-900 border-b-2 border-black dark:border-white transition-colors">
                <div className="absolute inset-0 z-0">
                    {posterImage ? (
                        <Image src={posterImage} alt="Cover" fill className="object-cover opacity-10 mix-blend-multiply dark:mix-blend-overlay dark:opacity-20" priority />
                    ) : (
                         <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-600 uppercase tracking-widest font-black text-xs">No Cover Image</div>
                     )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-zinc-900 via-gray-50/80 dark:via-zinc-900/80 to-transparent" />
                </div>

                <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-8 items-end">
                    {/* Poster */}
                    <div className="hidden md:flex flex-col items-center justify-center w-64 aspect-[2/3] shrink-0 overflow-hidden shadow-2xl border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest relative">
                        {posterImage ? (
                            <Image src={posterImage} alt={title} fill className="object-cover" />
                        ) : "No Poster Image"}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 pb-4">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white">
                                {type}
                            </span>
                            {type !== "Blog" && (
                                <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black dark:border-white">
                                    {genre}
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tight mb-6 leading-tight max-w-4xl text-black dark:text-white uppercase">
                            {title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 border-2 border-black dark:border-white bg-gray-100 dark:bg-zinc-800 text-black dark:text-white flex items-center justify-center font-black overflow-hidden shadow-md">
                                    {review.author?.image ? (
                                        <img src={review.author.image} alt={authorName} className="w-full h-full object-cover" />
                                    ) : (
                                        authorName.charAt(0)
                                    )}
                                </div>
                                <span>By <strong className="text-black dark:text-white">{authorName}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{publishDate}</div>
                            {type !== "Blog" && (
                                <div className="flex items-center gap-3">
                                    <RatingStars rating={rating} size="md" />
                                    <span className="font-black text-black dark:text-white text-2xl ml-1 font-serif italic">{rating.toFixed(1)}/10</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content & Sidebar */}
            <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">

                {/* Left Column (Content) */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Review Text */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-800 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:text-black dark:prose-headings:text-white prose-headings:font-black prose-headings:font-serif prose-headings:uppercase prose-a:text-black dark:prose-a:text-white prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 prose-a:font-bold whitespace-pre-wrap font-serif text-lg md:text-xl md:leading-relaxed"
                    >
                        {content}
                    </div>

                    {/* Image Gallery */}
                    {parsedGallery.length > 0 ? (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black font-serif uppercase text-black dark:text-white border-b-2 border-black dark:border-white w-fit pr-4 pb-1">Screenshots & Stills</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {parsedGallery.map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-video border-2 border-black dark:border-white bg-gray-100 dark:bg-zinc-800 shadow-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                                        <Image src={img} alt={`Gallery image ${idx + 1}`} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="h-0.5 bg-black dark:bg-white w-full"></div>

                    {/* Comments Section */}
                    <div className="space-y-8" id="comments">
                        <div className="flex items-center gap-3">
                            <MessageCircle className="w-8 h-8 text-black dark:text-white" />
                            <h3 className="text-2xl font-black font-serif uppercase">Public Comments ({comments.length})</h3>
                        </div>

                        {/* Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="bg-white dark:bg-zinc-900 p-8 border-2 border-black dark:border-white shadow-2xl">
                            <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-black dark:text-white mb-4">Post a comment</label>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="What's your take on this cinematic piece?"
                                className="w-full min-h-[140px] bg-gray-50 dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-800 focus:border-black dark:focus:border-white px-4 py-3 resize-none outline-none transition-all mb-4 text-black dark:text-white font-serif text-lg placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:italic"
                            />
                            <div className="flex justify-end">
                                <button type="submit" className="bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[10px] py-4 px-10 border-2 border-black dark:border-white hover:bg-[var(--color-brand)] dark:hover:bg-[var(--color-brand)] dark:hover:text-white transition-all">
                                    Broadcast Comment
                                </button>
                            </div>
                        </form>

                        {/* Existing Comments */}
                        <div className="space-y-6">
                            {comments.length > 0 ? comments.map((comment: any) => (
                                <div key={comment.id} className="flex gap-4 p-6 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white shadow-xl">
                                    <div className="w-12 h-12 shrink-0 border-2 border-black dark:border-white bg-gray-100 dark:bg-zinc-800 text-black dark:text-white flex items-center justify-center font-black uppercase text-xl shadow-inner">
                                        {comment.user?.image ? (
                                            <img src={comment.user.image} alt={comment.user?.name || "User"} className="w-full h-full object-cover" />
                                        ) : (
                                            (comment.user?.name || comment.userName || "U").charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-gray-100 dark:border-zinc-800 transition-colors">
                                            <h4 className="font-black text-black dark:text-white uppercase tracking-widest text-xs">{comment.user?.name || comment.userName || "Anonymous"}</h4>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-800 dark:text-gray-300 leading-relaxed font-serif text-lg">{comment.text}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center border-2 border-dashed border-gray-300 dark:border-zinc-800 text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] font-black text-xs bg-gray-50 dark:bg-zinc-900/50">
                                    Join the conversation
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-8">
                    {/* Details Box */}
                    <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white p-8 shadow-2xl lg:sticky lg:top-36">
                        {type !== "Blog" && (
                            <>
                                <h3 className="text-lg font-black font-serif uppercase text-black dark:text-white mb-8 border-b-2 border-black dark:border-white pb-4 tracking-tight">
                                    Project Credits
                                </h3>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-[10px] text-gray-400 uppercase tracking-widest font-black flex items-center gap-2 mb-2">
                                            <Clapperboard className="w-4 h-4 text-black dark:text-white" /> Director / Creator
                                        </h4>
                                        <p className="font-black text-black dark:text-white uppercase text-sm">{director || "No record available"}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] text-gray-400 uppercase tracking-widest font-black flex items-center gap-2 mb-2">
                                            <Users className="w-4 h-4 text-black dark:text-white" /> Cast Ensemble
                                        </h4>
                                        <p className="font-black text-black dark:text-white uppercase leading-relaxed text-sm whitespace-pre-line">{cast || "No record available"}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] text-gray-400 uppercase tracking-widest font-black flex items-center gap-2 mb-2">
                                            <MonitorPlay className="w-4 h-4 text-black dark:text-white" /> Access Point
                                        </h4>
                                        <p className="font-black text-black dark:text-white uppercase text-sm">{availableOn || "No record available"}</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Social Share */}
                        <div className={`${type !== "Blog" ? "mt-10 pt-8 border-t-2 border-black dark:border-white" : ""}`}>
                            <h4 className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-4">Viral Dissemination</h4>
                            <div className="flex items-center gap-3">
                                <button className="w-12 h-12 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-black dark:text-white flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-md group">
                                    <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                                <button className="w-12 h-12 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-black dark:text-white flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-md group">
                                    <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                                <button onClick={copyToClipboard} className="w-12 h-12 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-black dark:text-white flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-md group">
                                    <LinkIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}
