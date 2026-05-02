"use client";

import { use, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Star, StarHalf, Calendar, Save,
    User, Clapperboard, Users, MonitorPlay, Eye, UploadCloud, CheckCircle2, Search
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function EditReviewPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const [genre, setGenre] = useState("");
    const [type, setType] = useState("");
    const [director, setDirector] = useState("");
    const [cast, setCast] = useState("");
    const [availableOn, setAvailableOn] = useState("");
    const [posterImage, setPosterImage] = useState("");
    const [gallery, setGallery] = useState("");

    const [authorName, setAuthorName] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [publishDate, setPublishDate] = useState("");
    
    // Searchable Author States
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (slug) {
            fetch(`/api/reviews/${slug}`)
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && !data.error) {
                        setTitle(data.title || "");
                        setContent(data.content || "");
                        setRating(data.rating || 0);
                        setGenre(data.genre || "");
                        setType(data.type || "");
                        setDirector(data.director || "");
                        setCast(data.cast || "");
                        setAvailableOn(data.availableOn || "");
                        setPosterImage(data.posterImage || "");
                        setGallery(data.gallery || "[]");

                        setAuthorName(data.author?.name || "Unknown");
                        setAuthorId(data.authorId || "");
                        setPublishDate(data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "No date");
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false));

            fetch('/api/users')
                .then(res => res.json())
                .then(users => {
                    if (Array.isArray(users)) {
                        const sorted = [...users].sort((a, b) => a.name.localeCompare(b.name));
                        setAllUsers(sorted);
                    }
                })
                .catch(() => {});
        }
    }, [slug]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredUsers = allUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/reviews/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title, content, rating: Number(rating), genre, type, director, cast, availableOn, posterImage, gallery, authorId
                })
            });
            if (res.ok) {
                alert("Review updated successfully!");
                router.push("/admin");
            } else {
                alert("Failed to update review.");
            }
        } catch (err) {
            console.error("Save error:", err);
            alert("Error saving review.");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => setPosterImage(reader.result as string);
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const fileArray = Array.from(files);
        const base64Promises = fileArray.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        });
        try {
            const base64Images = await Promise.all(base64Promises);
            const currentGallery = JSON.parse(gallery || "[]");
            const newGallery = [...currentGallery, ...base64Images];
            setGallery(JSON.stringify(newGallery, null, 2));
        } catch (err) { console.error(err); }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const fillWidth = Math.max(0, Math.min(100, (rating - (i - 1)) * 100));
            stars.push(
                <div key={i} className="relative w-6 h-6 cursor-pointer" onClick={() => setRating(i)}>
                    <Star className="w-6 h-6 text-gray-200" />
                    <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillWidth}%` }}>
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    </div>
                </div>
            );
        }
        return stars;
    };

    if (loading) return <div className="min-h-[70vh] pt-[100px] flex items-center justify-center text-black font-bold tracking-widest text-xl uppercase">Loading...</div>;

    return (
        <div className="min-h-screen bg-white text-black pb-20 pt-[80px]">
            {/* Top Toolbar */}
            <div className="sticky top-[80px] z-[40] bg-white border-b-2 border-black p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-gray-500 hover:text-black hover:underline transition-colors font-bold uppercase tracking-widest text-sm border-r-2 border-gray-200 pr-4"> ← Back </Link>
                    <h2 className="text-lg font-black uppercase tracking-widest text-black flex items-center gap-2"> <Eye className="w-5 h-5" /> Live Editing Review </h2>
                </div>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] disabled:bg-[var(--color-brand)]/50 text-white px-5 py-2 rounded-xl font-bold transition-colors shadow-lg">
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Hero Section */}
            <div className="relative w-full h-[60vh] min-h-[500px] flex items-end pb-12 border-b-2 border-black bg-gray-50 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {posterImage && <Image src={posterImage} alt="Cover" fill className="object-cover opacity-20" priority />}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                </div>

                <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-8 items-end">
                    {/* Poster Edit */}
                    <div className="hidden md:flex flex-col w-64 aspect-[2/3] shrink-0 overflow-hidden shadow-xl border-2 border-black bg-white relative">
                        <div className="relative z-20 p-3 bg-gray-100 border-b-2 border-black flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-black">Cover Artwork</span>
                            <label className="cursor-pointer bg-black text-white p-1.5 hover:bg-[var(--color-brand)] transition-colors">
                                <UploadCloud className="w-4 h-4" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <div className="flex-1 relative bg-white">
                            {posterImage && <Image src={posterImage} alt="Preview" fill className="object-cover" />}
                        </div>
                    </div>

                    <div className="flex-1 pb-4 flex flex-col gap-4 w-full">
                        <div className="flex items-center gap-3">
                            <input type="text" value={type} onChange={e => setType(e.target.value)} className="px-3 py-1.5 text-xs font-bold tracking-widest uppercase bg-white border-2 border-black text-black outline-none w-32" />
                            <input type="text" value={genre} onChange={e => setGenre(e.target.value)} className="px-3 py-1.5 text-xs font-bold tracking-widest uppercase bg-white border-2 border-black text-black outline-none w-32" />
                        </div>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="text-4xl md:text-5xl font-black font-serif tracking-tight leading-tight w-full bg-transparent border-b-2 border-dashed border-black focus:border-solid outline-none text-black py-2 uppercase" />
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mt-2 font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center font-black text-xs text-black bg-gray-50">{authorName.charAt(0)}</span>
                                <span>Attribute To: <strong className="text-black">{authorName}</strong></span>
                            </div>
                            <div className="flex items-center gap-3 bg-white px-4 py-1.5 border-2 border-black">
                                <span className="font-bold text-[10px] uppercase tracking-widest text-black">Rating (0-5)</span>
                                <input type="number" min="0" max="5" step="0.1" value={rating} onChange={e => setRating(Number(e.target.value))} className="w-16 bg-transparent text-black font-black font-serif text-lg text-center outline-none" />
                                <div className="flex items-center gap-1">{renderStars()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                <div className="lg:col-span-2 space-y-12">
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-black uppercase tracking-widest text-black">Editorial Content</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full min-h-[500px] bg-white border-2 border-black p-6 text-black leading-relaxed outline-none focus:border-[var(--color-brand)] font-serif text-lg" />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white border-2 border-black p-6 lg:sticky lg:top-24">
                        <h3 className="text-xl font-black uppercase tracking-widest text-black mb-6 border-b-2 border-gray-100 pb-4"> Overview </h3>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-gray-500 uppercase tracking-widest font-black">Director</label>
                                <input type="text" value={director} onChange={e => setDirector(e.target.value)} className="bg-gray-50 border-2 border-gray-200 px-4 py-2 text-sm text-black outline-none font-bold uppercase tracking-widest" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-gray-500 uppercase tracking-widest font-black">Main Cast</label>
                                <textarea value={cast} onChange={e => setCast(e.target.value)} className="bg-gray-50 border-2 border-gray-200 px-4 py-2 text-sm text-black outline-none font-bold uppercase tracking-widest min-h-[80px]" />
                            </div>

                            {/* Searchable Author Select */}
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 relative" ref={dropdownRef}>
                                <label className="text-xs text-[var(--color-brand)] uppercase tracking-widest font-black flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" /> Re-Attribute Author
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Search className="w-3.5 h-3.5" />
                                    </div>
                                    <input 
                                        type="text"
                                        placeholder="Search by name..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        className="w-full bg-amber-50 border-2 border-amber-200 pl-9 pr-4 py-2 text-sm text-black outline-none font-bold uppercase tracking-widest"
                                    />
                                    
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                                className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border-2 border-black shadow-2xl max-h-48 overflow-y-auto"
                                            >
                                                {filteredUsers.map(u => (
                                                    <button 
                                                        key={u.id}
                                                        onClick={() => {
                                                            setAuthorId(u.id);
                                                            setAuthorName(u.name);
                                                            setSearchTerm("");
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-50 flex flex-col"
                                                    >
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{u.name}</span>
                                                        <span className="text-[8px] text-gray-400 font-bold lowercase">{u.email}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <p className="text-[9px] text-gray-400 font-bold uppercase">Current: {authorName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
