"use client";

import { useState, useEffect } from "react";
import {
    Plus, FileText, CheckCircle, Clock, XCircle,
    MoreVertical, Edit, Eye, Trash2, User
} from "lucide-react";
import { motion } from "framer-motion";
import AddReviewModal from "../../components/AddReviewModal";

export default function ModeratorDashboard() {
    const [isHoveringAdd, setIsHoveringAdd] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialMode, setModalInitialMode] = useState<"Movie" | "Blog">("Movie");
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch current user and then their specific reviews
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(user => {
                if (user && user.id) {
                    return fetch(`/api/reviews?status=ALL&authorId=${user.id}`);
                }
                throw new Error("User not found");
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setReviews(data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const approvedCount = reviews.filter(r => r.status === "APPROVED").length;
    const pendingCount = reviews.filter(r => r.status === "PENDING").length;
    const rejectedCount = reviews.filter(r => r.status === "REJECTED").length;

    const stats = [
        { title: "Contributions", value: reviews.length.toString(), icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Approved", value: approvedCount.toString(), icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
        { title: "Pending", value: pendingCount.toString(), icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { title: "Rejected", value: rejectedCount.toString(), icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 px-6 py-12 pt-32 flex justify-center transition-colors">
            <AddReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialMediaType={modalInitialMode} />

            <div className="w-full max-w-[1200px] flex flex-col gap-10">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-black dark:border-white pb-6 mt-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white flex items-center justify-center p-1">
                            <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                                <User className="w-8 h-8 text-black dark:text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-4xl font-black font-serif text-black dark:text-white uppercase tracking-tight">Moderator Studio</h1>
                                <span className="bg-black dark:bg-white text-[var(--color-brand)] text-[8px] font-black px-2 py-0.5 uppercase tracking-[0.2em]">Certified Author</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-[10px] uppercase font-black tracking-[0.2em]">Secure Editorial Portal • Track your narrative contributions</p>
                        </div>
                    </div>

                    {/* Floating Add Buttons */}
                    <div className="flex gap-4">
                        <div className="relative"
                            onMouseEnter={() => setIsHoveringAdd(true)}
                            onMouseLeave={() => setIsHoveringAdd(false)}
                        >
                            <motion.button
                                onClick={() => { setModalInitialMode("Movie"); setIsModalOpen(true); }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-[var(--color-brand)] border-2 border-[var(--color-brand)] hover:bg-black hover:border-black text-white h-14 px-6 rounded-none flex items-center justify-center gap-3 transition-colors relative z-20 group"
                            >
                                <Plus className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" />
                                <span className="font-bold text-sm uppercase tracking-widest hidden sm:inline-block">Write Review</span>
                            </motion.button>

                            <div className={`absolute inset-0 bg-transparent blur-xl transition-opacity duration-300 z-10 ${isHoveringAdd ? 'opacity-60' : 'opacity-30'}`} />
                        </div>

                        <motion.button
                            onClick={() => { setModalInitialMode("Blog"); setIsModalOpen(true); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-black hover:bg-[var(--color-brand)] text-white h-14 px-6 rounded-none flex items-center justify-center gap-3 transition-colors relative z-20"
                        >
                            <FileText className="w-6 h-6" />
                            <span className="font-bold text-sm uppercase tracking-widest hidden sm:inline-block">Write Blog</span>
                        </motion.button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 rounded-none p-5 sm:p-6 flex items-center justify-between hover:border-black dark:hover:border-white transition-all group">
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-500 dark:text-gray-400 text-[8px] font-black uppercase tracking-[0.2em]">{stat.title}</p>
                                <p className="text-3xl sm:text-4xl font-black font-serif text-black dark:text-white tracking-tighter">{stat.value}</p>
                            </div>
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 border border-black/5 dark:border-white/5 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submissions List */}
                <div className="bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 rounded-none overflow-hidden flex flex-col shadow-sm">
                    <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gray-50 dark:bg-zinc-950">
                        <h2 className="text-xl font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            Draft Submissions
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-[0.2em] bg-gray-100 dark:bg-zinc-900">
                                    <th className="p-5 pl-8 font-black">Headline Context</th>
                                    <th className="p-5 font-black hidden sm:table-cell">Medium</th>
                                    <th className="p-5 font-black hidden md:table-cell">Submission Date</th>
                                    <th className="p-5 font-black">Audit Status</th>
                                    <th className="p-5 pr-8 text-right font-black">Archive Options</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">Loading reviews...</td>
                                    </tr>
                                ) : reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <tr key={review.id} className="border-b border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group">
                                            <td className="p-5 pl-8">
                                                <p className="font-black text-black dark:text-white text-base group-hover:text-[var(--color-brand)] transition-colors line-clamp-1 uppercase font-serif tracking-tight">{review.title || "No title available"}</p>
                                                <p className="text-gray-500 dark:text-gray-500 text-[8px] mt-1.5 sm:hidden font-black tracking-[0.2em] uppercase">{review.type || "Untitled"} • {new Date(review.createdAt).toLocaleDateString()}</p>
                                            </td>

                                            <td className="p-5 hidden sm:table-cell">
                                                <span className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-black/5 dark:border-white/5">
                                                    {review.type || "Other"}
                                                </span>
                                            </td>

                                            <td className="p-5 text-gray-600 dark:text-gray-400 hidden md:table-cell whitespace-nowrap font-black uppercase text-[10px] tracking-widest">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    {review.status === "APPROVED" && (
                                                        <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-none text-[8px] font-black tracking-[0.2em] uppercase border-2 border-emerald-100 dark:border-emerald-900 shadow-sm">
                                                            <CheckCircle className="w-3.5 h-3.5" /> Approved
                                                        </span>
                                                    )}
                                                    {review.status === "PENDING" && (
                                                        <span className="flex items-center gap-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-none text-[8px] font-black tracking-[0.2em] uppercase border-2 border-amber-100 dark:border-amber-900 shadow-sm">
                                                            <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending
                                                        </span>
                                                    )}
                                                    {review.status === "REJECTED" && (
                                                        <span className="flex items-center gap-2 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-none text-[8px] font-black tracking-[0.2em] uppercase border-2 border-red-100 dark:border-red-900 shadow-sm">
                                                            <XCircle className="w-3.5 h-3.5" /> Flagged
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2 text-gray-400">
                                                    <button title="View Details" className="p-2 hover:bg-gray-200 hover:text-black transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {review.status === "PENDING" && (
                                                        <>
                                                            <button title="Edit Review" className="p-2 hover:bg-gray-200 hover:text-black transition-colors">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button title="Delete Submission" className="p-2 hover:bg-red-100 hover:text-red-600 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-24 text-center border-2 border-dashed border-black/5 dark:border-white/5 bg-gray-50 dark:bg-zinc-950 m-6">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 flex items-center justify-center mb-6">
                                                    <FileText className="w-8 h-8 text-[var(--color-brand)] opacity-40" />
                                                </div>
                                                <p className="text-black dark:text-white font-black text-xl uppercase tracking-widest font-serif italic">Archive Vacant</p>
                                                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">No narratives discovered in your personal archives. Initiate your first submission to populate this log.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
