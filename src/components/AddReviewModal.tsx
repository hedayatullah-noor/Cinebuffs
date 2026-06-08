"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Film, Tv, CheckCircle2, Star, FileText, Search, Image as ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
    ssr: false, 
    loading: () => <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed var(--color-border)' }}>Loading text editor...</div>
});

interface AddReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMediaType?: "Movie" | "Series" | "Blog";
    /* Pass review data for edit mode */
    editData?: any;
}

export default function AddReviewModal({
    isOpen,
    onClose,
    initialMediaType = "Movie",
    editData,
}: AddReviewModalProps) {
    const [mediaType, setMediaType]           = useState<"Movie" | "Series" | "Blog">(initialMediaType);
    const [submissionStatus, setSubmissionStatus] = useState<"idle" | "pending" | "approved">("idle");
    const [isLoading, setIsLoading]           = useState(false);
    const [rating, setRating]                 = useState(editData?.rating || 0);

    /* Image state */
    const [posterFile, setPosterFile]         = useState<File | null>(null);
    const [sliderFile, setSliderFile]         = useState<File | null>(null);
    const [posterPreview, setPosterPreview]   = useState<string>(editData?.posterImage || "");
    const [sliderPreview, setSliderPreview]   = useState<string>(editData?.sliderImage || "");
    const [extraImages, setExtraImages]       = useState<FileList | null>(null);
    const [content, setContent]               = useState<string>(editData?.content || "");

    /* Author override (admin only) */
    const [allUsers, setAllUsers]             = useState<any[]>([]);
    const [searchTerm, setSearchTerm]         = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
    const [currentUser, setCurrentUser]       = useState<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMediaType(initialMediaType);
            setSubmissionStatus("idle");
            setRating(editData?.rating || 0);
            setPosterPreview(editData?.posterImage || "");
            setSliderPreview(editData?.sliderImage || "");
            setPosterFile(null);
            setSliderFile(null);
            setSelectedAuthor(null);
            setSearchTerm("");
            setContent(editData?.content || "");

            fetch('/api/auth/me')
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                        setCurrentUser(data);
                        if (data.role === 'ADMIN') {
                            fetch('/api/users')
                                .then(r => r.json())
                                .then(users => {
                                    if (Array.isArray(users)) {
                                        setAllUsers([...users].sort((a, b) => a.name.localeCompare(b.name)));
                                    }
                                });
                        }
                    }
                });
        }
    }, [isOpen, initialMediaType, editData]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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

    const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload  = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    const handleImageChange = (
        file: File,
        setFile: (f: File) => void,
        setPreview: (s: string) => void
    ) => {
        setFile(file);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const form     = e.currentTarget;
        const formData = new FormData(form);
        formData.append("mediaType", mediaType);
        formData.append("rating", mediaType === "Blog" ? "0" : rating.toString());
        formData.append("content", content);

        if (selectedAuthor) formData.append("authorOverride", selectedAuthor.id);

        if (mediaType === "Blog") {
            if (!formData.get("genre"))       formData.append("genre", "Blog Post");
            if (!formData.get("director"))    formData.append("director", "N/A");
            if (!formData.get("cast"))        formData.append("cast", "N/A");
            if (!formData.get("availableOn")) formData.append("availableOn", "N/A");
        }

        /* Poster image (required) */
        if (posterFile) {
            formData.append("posterImage", await toBase64(posterFile));
        } else if (editData?.posterImage) {
            formData.append("posterImage", editData.posterImage);
        }

        /* Slider image (optional) */
        if (sliderFile) {
            formData.append("sliderImage", await toBase64(sliderFile));
        } else if (editData?.sliderImage) {
            formData.append("sliderImage", editData.sliderImage);
        }

        /* Gallery images */
        if (extraImages && extraImages.length > 0) {
            const arr: string[] = [];
            for (let i = 0; i < extraImages.length; i++) {
                arr.push(await toBase64(extraImages[i]));
            }
            formData.append("gallery", JSON.stringify(arr));
        }

        try {
            const endpoint = editData
                ? `/api/admin/reviews/${editData.slug}`
                : "/api/reviews";
            const method = editData ? "PUT" : "POST";

            /* Convert FormData → JSON for PUT */
            let body: any;
            if (method === "PUT") {
                const obj: any = {};
                formData.forEach((val, key) => { obj[key] = val; });
                body = JSON.stringify(obj);
            } else {
                body = formData;
            }

            const res = await fetch(endpoint, {
                method,
                body,
                ...(method === "PUT" ? { headers: { "Content-Type": "application/json" } } : {}),
            });

            if (res.ok) {
                setSubmissionStatus(
                    currentUser?.role === "ADMIN" || currentUser?.role === "MODERATOR"
                        ? "approved"
                        : "pending"
                );
                setTimeout(() => { onClose(); setSubmissionStatus("idle"); }, 2000);
            }
        } catch (err) {
            console.error("Submit error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    /* ── Image upload box component ── */
    const ImageUploadBox = ({
        label,
        hint,
        accept,
        preview,
        onChange,
        required = false,
        aspectLabel,
    }: {
        label: string;
        hint: string;
        accept: string;
        preview: string;
        onChange: (f: File) => void;
        required?: boolean;
        aspectLabel: string;
    }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                    {label} {required && <span style={{ color: 'var(--color-brand)' }}>*</span>}
                </label>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--color-text-muted)' }}>
                    {hint}
                </span>
            </div>
            <label style={{ cursor: 'pointer', display: 'block' }}>
                <input
                    type="file"
                    accept={accept}
                    style={{ display: 'none' }}
                    required={required && !preview}
                    onChange={e => e.target.files?.[0] && onChange(e.target.files[0])}
                />
                <div style={{
                    border: `2px dashed ${preview ? 'var(--color-brand)' : 'var(--color-border)'}`,
                    backgroundColor: 'var(--color-bg-primary)',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 100,
                    transition: 'border-color 0.2s ease',
                }}>
                    {preview ? (
                        <>
                            <img src={preview} alt="" style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain', display: 'block' }} />
                            <div style={{ position: 'absolute', bottom: 6, right: 6, backgroundColor: 'var(--color-brand)', color: '#fff', fontSize: 9, fontFamily: 'var(--font-sans)', fontWeight: 700, padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {aspectLabel}
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '1.5rem', color: 'var(--color-text-muted)' }}>
                            <UploadCloud style={{ width: 28, height: 28 }} />
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Click to upload · {aspectLabel}
                            </span>
                        </div>
                    )}
                </div>
            </label>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.65)', overflowY: 'auto', padding: '2rem 1rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        style={{ backgroundColor: 'var(--color-bg-card)', width: '100%', maxWidth: 680, position: 'relative', border: '1px solid var(--color-border)' }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
                                    {editData ? 'Edit Review' : 'Write New Review'}
                                </h2>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    {editData ? `Editing: ${editData.title}` : 'Fill in all required fields'}
                                </p>
                            </div>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}>
                                <X style={{ width: 20, height: 20 }} />
                            </button>
                        </div>

                        {/* Success state */}
                        {submissionStatus !== "idle" ? (
                            <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                <CheckCircle2 style={{ width: 40, height: 40, color: 'var(--color-brand)' }} />
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
                                    {submissionStatus === "approved" ? "Published!" : "Submitted for Review"}
                                </h3>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-text-muted)' }}>
                                    {submissionStatus === "approved"
                                        ? "Review is live on the site."
                                        : "Your review has been submitted and is awaiting approval."}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                                {/* Media type tabs */}
                                {!editData && (
                                    <div style={{ display: 'flex', gap: 0, border: '1px solid var(--color-border)' }}>
                                        {(["Movie", "Series", "Blog"] as const).map(t => (
                                            <button
                                                key={t} type="button"
                                                onClick={() => setMediaType(t)}
                                                style={{
                                                    flex: 1, padding: '8px', border: 'none', cursor: 'pointer',
                                                    fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700,
                                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                                    backgroundColor: mediaType === t ? 'var(--color-brand)' : 'transparent',
                                                    color: mediaType === t ? '#fff' : 'var(--color-text-muted)',
                                                    borderRight: t !== 'Blog' ? '1px solid var(--color-border)' : 'none',
                                                    transition: 'all 0.15s ease',
                                                }}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* ── TWO IMAGE UPLOAD SECTION ── */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <ImageUploadBox
                                        label="Poster Image"
                                        hint="400 × 600 px · Vertical"
                                        accept="image/*"
                                        preview={posterPreview}
                                        required={!editData}
                                        aspectLabel="2:3 Poster"
                                        onChange={f => handleImageChange(f, setPosterFile, setPosterPreview)}
                                    />
                                    <ImageUploadBox
                                        label="Slider / Banner Image"
                                        hint="1280 × 720 px · Horizontal"
                                        accept="image/*"
                                        preview={sliderPreview}
                                        required={false}
                                        aspectLabel="16:9 Banner"
                                        onChange={f => handleImageChange(f, setSliderFile, setSliderPreview)}
                                    />
                                </div>

                                {/* Image size guide */}
                                <div style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', padding: '0.75rem 1rem', display: 'flex', gap: '2rem' }}>
                                    <div>
                                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-brand)', margin: '0 0 2px' }}>
                                            Poster Image
                                        </p>
                                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>
                                            Used on review cards · Recommended: <strong>400 × 600 px</strong>
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-brand)', margin: '0 0 2px' }}>
                                            Slider Image
                                        </p>
                                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>
                                            Used on hero slider & featured section · Recommended: <strong>1280 × 720 px</strong>
                                        </p>
                                    </div>
                                </div>

                                {/* Title */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                                        Title <span style={{ color: 'var(--color-brand)' }}>*</span>
                                    </label>
                                    <input
                                        name="title"
                                        defaultValue={editData?.title}
                                        required
                                        placeholder="Enter review title"
                                        style={{ padding: '10px 12px', fontFamily: 'var(--font-sans)', fontSize: 14, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-main)', outline: 'none' }}
                                        onFocus={e => (e.target.style.borderColor = 'var(--color-brand)')}
                                        onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                                    />
                                </div>

                                {/* Genre + Rating row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                                            Genre <span style={{ color: 'var(--color-brand)' }}>*</span>
                                        </label>
                                        <input
                                            name="genre"
                                            defaultValue={editData?.genre}
                                            required={mediaType !== "Blog"}
                                            placeholder={mediaType === "Blog" ? "Blog Post" : "e.g. Action, Drama"}
                                            style={{ padding: '10px 12px', fontFamily: 'var(--font-sans)', fontSize: 14, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-main)', outline: 'none' }}
                                            onFocus={e => (e.target.style.borderColor = 'var(--color-brand)')}
                                            onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                                        />
                                    </div>

                                    {mediaType !== "Blog" && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                                                Rating (0–10)
                                            </label>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                                    <button
                                                        key={n} type="button"
                                                        onClick={() => setRating(n)}
                                                        style={{
                                                            width: 32, height: 32, border: '1px solid var(--color-border)',
                                                            fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-sans)',
                                                            cursor: 'pointer',
                                                            backgroundColor: rating >= n ? 'var(--color-brand)' : 'transparent',
                                                            color: rating >= n ? '#fff' : 'var(--color-text-muted)',
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                    >
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Director + Cast */}
                                {mediaType !== "Blog" && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {[
                                            { label: 'Director', name: 'director', placeholder: 'Director name', val: editData?.director },
                                            { label: 'Cast', name: 'cast', placeholder: 'Main cast members', val: editData?.cast },
                                        ].map(({ label, name, placeholder, val }) => (
                                            <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                                                    {label}
                                                </label>
                                                <input
                                                    name={name}
                                                    defaultValue={val}
                                                    placeholder={placeholder}
                                                    style={{ padding: '10px 12px', fontFamily: 'var(--font-sans)', fontSize: 14, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-main)', outline: 'none' }}
                                                    onFocus={e => (e.target.style.borderColor = 'var(--color-brand)')}
                                                    onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Available On */}
                                {mediaType !== "Blog" && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                                            Available On
                                        </label>
                                        <input
                                            name="availableOn"
                                            defaultValue={editData?.availableOn}
                                            placeholder="Netflix, Prime Video, Theatres..."
                                            style={{ padding: '10px 12px', fontFamily: 'var(--font-sans)', fontSize: 14, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-main)', outline: 'none' }}
                                            onFocus={e => (e.target.style.borderColor = 'var(--color-brand)')}
                                            onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                                        />
                                    </div>
                                )}

                                {/* Gallery */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                                        Gallery / Stills <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(optional, multiple)</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={e => setExtraImages(e.target.files)}
                                        style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--color-text-muted)' }}
                                    />
                                </div>

                                {/* Content */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                                        Content <span style={{ color: 'var(--color-brand)' }}>*</span>
                                    </label>
                                    <div style={{ backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-main)', borderRadius: '4px' }}>
                                        <ReactQuill
                                            theme="snow"
                                            value={content}
                                            onChange={setContent}
                                            placeholder="Write your review here..."
                                            modules={{
                                                toolbar: [
                                                    [{ 'header': [1, 2, 3, false] }],
                                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                                                    ['link', 'image'],
                                                    ['clean']
                                                ],
                                            }}
                                        />
                                    </div>
                                    <style dangerouslySetInnerHTML={{__html: `
                                        .quill {
                                            display: flex;
                                            flex-direction: column;
                                        }
                                        .ql-container {
                                            flex: 1;
                                            overflow-y: auto;
                                            font-family: var(--font-sans);
                                            font-size: 14px;
                                            border: 1px solid var(--color-border) !important;
                                            border-top: none !important;
                                            min-height: 250px;
                                        }
                                        .ql-toolbar {
                                            border: 1px solid var(--color-border) !important;
                                            background-color: var(--color-bg-primary);
                                        }
                                        .ql-editor {
                                            min-height: 250px;
                                        }
                                    `}} />
                                </div>

                                {/* Admin: author override */}
                                {currentUser?.role === 'ADMIN' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} ref={dropdownRef}>
                                        <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-main)' }}>
                                            Post On Behalf Of
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', cursor: 'pointer' }}
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                                <Search style={{ width: 14, height: 14, color: 'var(--color-text-muted)', flexShrink: 0 }} />
                                                <input
                                                    value={selectedAuthor ? selectedAuthor.name : searchTerm}
                                                    onChange={e => { setSearchTerm(e.target.value); setSelectedAuthor(null); setIsDropdownOpen(true); }}
                                                    placeholder="Search users..."
                                                    style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-text-main)', width: '100%' }}
                                                />
                                            </div>
                                            {isDropdownOpen && filteredUsers.length > 0 && (
                                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', maxHeight: 200, overflowY: 'auto' }}>
                                                    {filteredUsers.map(u => (
                                                        <div key={u.id}
                                                            onClick={() => { setSelectedAuthor(u); setIsDropdownOpen(false); setSearchTerm(''); }}
                                                            style={{ padding: '10px 14px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, borderBottom: '1px solid var(--color-border)' }}
                                                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg-primary)')}
                                                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                                                        >
                                                            <strong>{u.name}</strong> <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>({u.email})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Submit */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                                    <button type="button" onClick={onClose}
                                        style={{ padding: '10px 20px', border: '1px solid var(--color-border)', background: 'none', fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isLoading}
                                        style={{ padding: '10px 24px', backgroundColor: isLoading ? 'var(--color-text-muted)' : 'var(--color-brand)', color: '#fff', border: 'none', fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s ease' }}>
                                        {isLoading ? 'Saving...' : editData ? 'Save Changes' : 'Submit Review'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
