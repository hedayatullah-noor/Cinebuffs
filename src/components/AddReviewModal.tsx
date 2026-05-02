"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Film, Tv, CheckCircle2, Star, FileText, User, Search } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

interface AddReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMediaType?: "Movie" | "Series" | "Blog";
}

export default function AddReviewModal({ isOpen, onClose, initialMediaType = "Movie" }: AddReviewModalProps) {
    const [mediaType, setMediaType] = useState<"Movie" | "Series" | "Blog">(initialMediaType);
    const [submissionStatus, setSubmissionStatus] = useState<"idle" | "pending" | "approved">("idle");
    const [isLoading, setIsLoading] = useState(false);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [extraImages, setExtraImages] = useState<FileList | null>(null);
    const [rating, setRating] = useState(0);
    const [editorContent, setEditorContent] = useState("");
    const [isFullScreenEditor, setIsFullScreenEditor] = useState(false);
    
    // Admin "On Behalf Of" Searchable Feature
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMediaType(initialMediaType);
            setSubmissionStatus("idle");
            setRating(0);
            setSelectedAuthor(null);
            setSearchTerm("");
            setEditorContent("");
            setIsFullScreenEditor(false);
            
            fetch('/api/auth/me')
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                        setCurrentUser(data);
                        if (data.role === 'ADMIN') {
                            fetch('/api/users')
                                .then(res => res.json())
                                .then(users => {
                                    if (Array.isArray(users)) {
                                        // Sort alphabetically
                                        const sorted = [...users].sort((a, b) => a.name.localeCompare(b.name));
                                        setAllUsers(sorted);
                                    }
                                });
                        }
                    }
                });
        }
    }, [isOpen, initialMediaType]);

    // Close dropdown when clicking outside
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

    const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.append("mediaType", mediaType);
        formData.append("rating", mediaType === "Blog" ? "0" : rating.toString());

        if (selectedAuthor) {
            formData.append("authorOverride", selectedAuthor.id);
        }

        if (mediaType === "Blog") {
            if (!formData.get("genre")) formData.append("genre", "Blog Post");
            if (!formData.get("director")) formData.append("director", "N/A");
            if (!formData.get("cast")) formData.append("cast", "N/A");
            if (!formData.get("availableOn")) formData.append("availableOn", "N/A");
        }

        if (posterFile) {
            try {
                const imgBase64 = await toBase64(posterFile);
                formData.append("posterImage", imgBase64);
            } catch (err) {
                console.error("Failed to read poster image", err);
            }
        }

        if (extraImages && extraImages.length > 0) {
            try {
                const extraArr = [];
                for (let i = 0; i < extraImages.length; i++) {
                    extraArr.push(await toBase64(extraImages[i]));
                }
                formData.append("gallery", JSON.stringify(extraArr));
            } catch (err) {
                console.error("Failed to read extra images", err);
            }
        }

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                body: formData,
            });
            const resData = await res.json();

            if (res.ok) {
                setSubmissionStatus(resData.status === "APPROVED" ? "approved" : "pending");
                setTimeout(() => {
                    setSubmissionStatus("idle");
                    onClose();
                }, 2500);
            } else {
                alert(`Failed: ${resData.error || res.statusText}`);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const fillWidth = Math.max(0, Math.min(100, (rating - (i - 1)) * 100));
            stars.push(
                <div key={i} className="relative w-8 h-8 group cursor-pointer" onClick={() => setRating(i)}>
                    <Star className="w-8 h-8 text-gray-200 dark:text-gray-800" />
                    <div 
                        className="absolute inset-0 overflow-hidden" 
                        style={{ width: `${fillWidth}%` }}
                    >
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    </div>
                </div>
            );
        }
        return stars;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 border-2 border-black dark:border-white rounded-none shadow-2xl flex flex-col max-h-[95vh] overflow-hidden transition-colors"
                    >
                        {submissionStatus !== "idle" ? (
                            <div className="flex flex-col items-center justify-center p-12 py-24 bg-white dark:bg-zinc-950 h-full">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`w-24 h-24 flex items-center justify-center mb-6 border-2 ${submissionStatus === 'approved' ? 'bg-green-500 border-green-600' : 'bg-[var(--color-brand)] border-[var(--color-brand)]'}`}
                                >
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                </motion.div>
                                <h3 className="text-3xl font-black font-serif text-black dark:text-white mb-2 text-center uppercase tracking-tight">
                                    {submissionStatus === "approved" ? "Successfully Published!" : "Sent for Moderation!"}
                                </h3>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between p-6 border-b-2 border-black dark:border-white bg-gray-50 dark:bg-zinc-900 transition-colors">
                                    <h2 className="text-2xl font-black font-serif text-black dark:text-white uppercase tracking-tight">Draft New Content</h2>
                                    <button onClick={onClose} className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="overflow-y-auto p-6 transition-colors custom-scrollbar">
                                    <form id="review-form" onSubmit={handleSubmit} className="flex flex-col gap-10">
                                        
                                        {/* Admin: On Behalf Of - Searchable */}
                                        {currentUser?.role === 'ADMIN' && allUsers.length > 0 && (
                                            <div className="flex flex-col gap-4 p-6 bg-amber-500/5 border-2 border-amber-500/20 rounded-none relative" ref={dropdownRef}>
                                                <label className="text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                    <User className="w-3 h-3" /> Post On Behalf Of (Admin Controls)
                                                </label>
                                                
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                                                        <Search className="w-4 h-4" />
                                                    </div>
                                                    <input 
                                                        type="text"
                                                        placeholder={selectedAuthor ? `Selected: ${selectedAuthor.name}` : "Search user by name or email..."}
                                                        value={searchTerm}
                                                        onChange={(e) => {
                                                            setSearchTerm(e.target.value);
                                                            setIsDropdownOpen(true);
                                                        }}
                                                        onFocus={() => setIsDropdownOpen(true)}
                                                        className="w-full bg-white dark:bg-zinc-950 border-2 border-amber-500 pl-11 pr-4 py-3 text-black dark:text-white outline-none font-black uppercase tracking-widest text-[10px] placeholder:text-amber-500/50"
                                                    />
                                                    
                                                    {selectedAuthor && (
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedAuthor(null);
                                                                setSearchTerm("");
                                                            }}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 px-2 py-1 text-[8px] font-black uppercase"
                                                        > Clear </button>
                                                    )}

                                                    <AnimatePresence>
                                                        {isDropdownOpen && (
                                                            <motion.div 
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-950 border-2 border-black dark:border-white shadow-2xl max-h-60 overflow-y-auto"
                                                            >
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedAuthor(null);
                                                                        setSearchTerm("");
                                                                        setIsDropdownOpen(false);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between"
                                                                >
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">Post as Myself ({currentUser.name})</span>
                                                                    <CheckCircle2 className={`w-4 h-4 ${!selectedAuthor ? 'text-green-500' : 'text-gray-200'}`} />
                                                                </button>
                                                                {filteredUsers.map(user => (
                                                                    <button 
                                                                        key={user.id}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedAuthor(user);
                                                                            setSearchTerm("");
                                                                            setIsDropdownOpen(false);
                                                                        }}
                                                                        className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex flex-col gap-0.5"
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">{user.name}</span>
                                                                            <span className="text-[8px] font-bold text-amber-500 border border-amber-500 px-1 rounded-sm">{user.role}</span>
                                                                        </div>
                                                                        <span className="text-[8px] text-gray-400 font-bold lowercase">{user.email}</span>
                                                                    </button>
                                                                ))}
                                                                {filteredUsers.length === 0 && (
                                                                    <div className="p-4 text-center text-[10px] font-bold text-gray-400 uppercase italic">No users found</div>
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-4">
                                            <label className="text-black dark:text-white text-[10px] font-black uppercase tracking-widest border-b-2 border-black dark:border-white w-fit pb-1">Media Category</label>
                                            <div className="flex items-center gap-4">
                                                {["Movie", "Series", "Blog"].map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setMediaType(type as any)}
                                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-none border-2 transition-all font-black uppercase tracking-widest text-[10px] ${mediaType === type ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-gray-200 dark:border-zinc-800 text-gray-400 hover:border-black dark:hover:border-white'}`}
                                                    >
                                                        {type === "Movie" && <Film className="w-4 h-4" />}
                                                        {type === "Series" && <Tv className="w-4 h-4" />}
                                                        {type === "Blog" && <FileText className="w-4 h-4" />}
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {!isFullScreenEditor ? (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div className="flex flex-col gap-8">
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-black dark:text-white text-[10px] font-black uppercase tracking-widest">Title</label>
                                                            <input name="title" required type="text" placeholder={`Enter ${mediaType} Title`} className="w-full bg-white dark:bg-zinc-950 border-2 border-black dark:border-white px-4 py-3 text-black dark:text-white outline-none font-serif text-lg placeholder:text-gray-300 dark:placeholder:text-gray-700" />
                                                        </div>

                                                        {mediaType !== "Blog" && (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-black dark:text-white text-[10px] font-black uppercase tracking-widest">Cast Ensemble</label>
                                                                    <input name="cast" required type="text" placeholder="e.g. Cillian Murphy" className="w-full bg-white dark:bg-zinc-950 border-2 border-black dark:border-white px-4 py-3 text-black dark:text-white outline-none font-serif text-sm" />
                                                                </div>

                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-black dark:text-white text-[10px] font-black uppercase tracking-widest">
                                                                        {mediaType === "Movie" ? "Director" : "Creator"}
                                                                    </label>
                                                                    <input name="director" required type="text" placeholder={`Enter ${mediaType === "Movie" ? "Director" : "Creator"}`} className="w-full bg-white dark:bg-zinc-950 border-2 border-black dark:border-white px-4 py-3 text-black dark:text-white outline-none font-serif text-sm" />
                                                                </div>

                                                                <div className="flex flex-col gap-2 relative">
                                                                    <label className="text-black dark:text-white text-[10px] font-black uppercase tracking-widest">Editorial Genre</label>
                                                                    <select name="genre" required defaultValue="" className="w-full bg-white dark:bg-zinc-950 border-2 border-black dark:border-white px-4 py-3 text-black dark:text-white outline-none appearance-none cursor-pointer font-black uppercase tracking-widest text-[10px]">
                                                                        {["Action", "Adventure", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Romance", "Documentary", "Animation"].map(g => (
                                                                            <option key={g} value={g} className="bg-white dark:bg-zinc-950 text-black dark:text-white">{g}</option>
                                                                        ))}
                                                                    </select>
                                                                    <div className="absolute right-4 top-[42px] pointer-events-none text-black dark:text-white"> ▼ </div>
                                                                </div>

                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-black dark:text-white text-[10px] font-black uppercase tracking-widest">Available At</label>
                                                                    <input name="availableOn" required type="text" placeholder="e.g. Netflix" className="w-full bg-white dark:bg-zinc-950 border-2 border-black dark:border-white px-4 py-3 text-black dark:text-white outline-none font-serif text-sm" />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {mediaType !== "Blog" && (
                                                            <div className="flex flex-col gap-2">
                                                                <label className="text-black dark:text-white text-[10px] font-black uppercase tracking-widest">Critical Rating (Decimal Allowed)</label>
                                                                <div className="flex flex-col gap-4 bg-gray-50 dark:bg-zinc-900 border-2 border-black dark:border-white p-6">
                                                                    <div className="flex items-center gap-4">
                                                                        <input 
                                                                            type="number" 
                                                                            min="0" max="5" step="0.1"
                                                                            value={rating}
                                                                            onChange={(e) => setRating(Number(e.target.value))}
                                                                            className="w-24 bg-white dark:bg-black border-2 border-black dark:border-white px-3 py-2 text-xl font-black font-serif italic text-black dark:text-white outline-none"
                                                                        />
                                                                        <span className="text-xl font-black font-serif italic text-gray-400">/ 5.0 STARS</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {renderStars()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-4 justify-center items-center bg-gray-50 dark:bg-zinc-900 border-2 border-dashed border-black/20 dark:border-white/20 p-12 text-center group hover:border-black dark:hover:border-white transition-all cursor-pointer" onClick={() => setIsFullScreenEditor(true)}>
                                                        <FileText className="w-12 h-12 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                                        <div>
                                                            <p className="text-black dark:text-white font-black uppercase tracking-widest text-sm mb-1">
                                                                {editorContent ? "Review Written" : "Empty Canvas"}
                                                            </p>
                                                            <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                                {editorContent ? "Click to edit your content" : "Click to start writing your review"}
                                                            </p>
                                                        </div>
                                                        <button type="button" className="mt-6 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[10px] border-2 border-black dark:border-white group-hover:bg-[var(--color-brand)] dark:group-hover:bg-[var(--color-brand)] dark:group-hover:text-white transition-all">
                                                            {editorContent ? "Open Editor" : "Write Review"}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t-2 border-black dark:border-white">
                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-black dark:text-white text-[10px] font-black uppercase tracking-widest flex justify-between">
                                                            Cover Artwork <span className="text-[var(--color-brand)]">*Required</span>
                                                        </label>
                                                        <label className="border-2 border-dashed border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black bg-white dark:bg-zinc-950 h-32 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group relative overflow-hidden">
                                                            <input type="file" accept="image/*" required className="hidden" onChange={(e) => e.target.files && setPosterFile(e.target.files[0])} />
                                                            {posterFile ? (
                                                                <div className="flex flex-col items-center justify-center text-center p-4">
                                                                    <CheckCircle2 className="w-6 h-6 mb-2 text-green-500" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[200px]">{posterFile.name}</span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <UploadCloud className="w-6 h-6" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload Portrait Poster</span>
                                                                </>
                                                            )}
                                                        </label>
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-black dark:text-white text-[10px] font-black uppercase tracking-widest flex justify-between">
                                                            Media Gallery <span className="text-gray-400 font-bold lowercase">Optional</span>
                                                        </label>
                                                        <label className="border-2 border-dashed border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black bg-white dark:bg-zinc-950 h-32 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group relative overflow-hidden">
                                                            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && setExtraImages(e.target.files)} />
                                                            {extraImages && extraImages.length > 0 ? (
                                                                <div className="flex flex-col items-center justify-center text-center p-4">
                                                                    <CheckCircle2 className="w-6 h-6 mb-2 text-green-500" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">{extraImages.length} files selected</span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <UploadCloud className="w-6 h-6" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload Landscape Stills</span>
                                                                </>
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col gap-6 min-h-[500px]">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <h3 className="text-xl font-black uppercase tracking-widest text-black dark:text-white">Full Screen Editor</h3>
                                                        <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">Drafting your masterpiece...</p>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setIsFullScreenEditor(false)}
                                                        className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[10px] border-2 border-black dark:border-white hover:bg-[var(--color-brand)] dark:hover:bg-[var(--color-brand)] dark:hover:text-white transition-all"
                                                    > Done Writing </button>
                                                </div>
                                                <div className="flex-1 min-h-[60vh]">
                                                    <textarea 
                                                        name="content"
                                                        value={editorContent}
                                                        onChange={(e) => setEditorContent(e.target.value)}
                                                        required
                                                        className="w-full h-full min-h-[400px] bg-white dark:bg-zinc-950 border-2 border-black dark:border-white p-6 outline-none font-serif text-lg"
                                                        placeholder={`Start writing your ${mediaType.toLowerCase()} analysis...`}
                                                    />
                                                </div>
                                                <input type="hidden" name="content" value={editorContent} />
                                            </div>
                                        )}
                                    </form>
                                </div>

                                <div className="p-6 border-t-2 border-black dark:border-white bg-gray-50 dark:bg-zinc-900 flex items-center justify-end gap-3 mt-auto transition-colors">
                                    <button type="button" onClick={onClose} className="px-8 py-3 rounded-none border-2 border-black dark:border-white text-black dark:text-white font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"> Discard </button>
                                    <button form="review-form" type="submit" disabled={isLoading} className="px-10 py-3 rounded-none bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[10px] border-2 border-black dark:border-white hover:bg-[var(--color-brand)] dark:hover:bg-[var(--color-brand)] dark:hover:text-white transition-all shadow-xl">
                                        {isLoading ? "Transmitting..." : "Submit Review"}
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
