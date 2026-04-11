"use client";

import { useState, useEffect } from "react";
import {
    Users, FileText, CheckCircle, Clock, Mail,
    Settings, LogOut, Check, X, Edit, Trash2, ShieldAlert, User
} from "lucide-react";
import Link from "next/link";

import AddReviewModal from "@/components/AddReviewModal";

// Removed mockPendingReviews to fetch from real API

interface UserType {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [modalInitialMode, setModalInitialMode] = useState<"Movie" | "Series" | "Blog">("Movie");
    const [users, setUsers] = useState<UserType[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [pendingReviews, setPendingReviews] = useState<any[]>([]);
    const [allReviews, setAllReviews] = useState<any[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loadingSubscribers, setLoadingSubscribers] = useState(false);
    const [statsData, setStatsData] = useState<any>(null);

    useEffect(() => {
        // Fetch users
        if (activeTab === "users") {
            setLoadingUsers(true);
            fetch('/api/admin/users')
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setUsers(data);
                    setLoadingUsers(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingUsers(false);
                });
        }

        // Fetch pending reviews for overview
        if (activeTab === "overview") {
            fetch("/api/admin/stats")
                .then(res => res.json())
                .then(data => {
                    if (data) setStatsData(data);
                })
                .catch(console.error);

            fetch("/api/reviews?status=PENDING")
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setPendingReviews(data);
                })
                .catch(console.error);
        }

        // Fetch all reviews
        if (activeTab === "reviews") {
            setLoadingReviews(true);
            fetch("/api/admin/reviews")
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setAllReviews(data);
                    setLoadingReviews(false);
                })
                .catch(err => {
                    console.error("Failed to fetch all reviews", err);
                    setLoadingReviews(false);
                });
        }

        // Fetch subscribers
        if (activeTab === "newsletter") {
            setLoadingSubscribers(true);
            fetch("/api/admin/subscribers")
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setSubscribers(data);
                    setLoadingSubscribers(false);
                })
                .catch(err => {
                    console.error("Failed to fetch subscribers", err);
                    setLoadingSubscribers(false);
                });
        }
    }, [activeTab]);

    const handleDeleteReview = async (slug: string) => {
        if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
        try {
            const res = await fetch(`/api/admin/reviews/${slug}`, { method: "DELETE" });
            if (res.ok) {
                setAllReviews(prev => prev.filter(r => r.slug !== slug));
                // Optionals: also remote from pending if it happens to be there
                setPendingReviews(prev => prev.filter(r => r.slug !== slug));
            } else {
                alert("Failed to delete review");
            }
        } catch (error) {
            console.error("Failed to delete review", error);
        }
    };

    const handleReviewAction = async (reviewId: string, status: string) => {
        try {
            const res = await fetch("/api/admin/reviews", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId, status }),
            });
            if (res.ok) {
                // Remove it from the pending list directly on the UI
                setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
            }
        } catch (error) {
            console.error("Failed to map review status:", error);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const res = await fetch('/api/admin/users/role', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole })
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            }
        } catch (error) {
            console.error("Failed to update role", error);
        }
    };

    const statsArray = [
        { title: "Total Users", value: statsData?.users || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Total Reviews", value: statsData?.reviews || 0, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Approved", value: statsData?.approved || 0, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
        { title: "Pending", value: statsData?.pending || 0, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { title: "Subscribers", value: statsData?.subscribers || 0, icon: Mail, color: "text-pink-500", bg: "bg-pink-500/10" }
    ];

    return (
        <div className="flex min-h-[calc(100vh-120px)] bg-gray-50 dark:bg-zinc-950 w-full max-w-[1500px] mx-auto mt-[100px] mb-10 border-2 border-black dark:border-white shadow-xl transition-colors">

            <AddReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} initialMediaType={modalInitialMode} />

            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-zinc-900 border-r-2 border-black dark:border-white p-6 flex flex-col gap-8 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white bg-gray-100 dark:bg-zinc-800">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-black text-lg leading-tight uppercase tracking-wider text-black dark:text-white">Admin</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold tracking-widest uppercase">Portal</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-2 flex-1 mt-8">
                    {[
                        { id: "overview", name: "Overview", icon: Settings },
                        { id: "reviews", name: "Manage Reviews", icon: FileText },
                        { id: "users", name: "Users", icon: Users },
                        { id: "newsletter", name: "Newsletter", icon: Mail },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest border-2 transition-all ${activeTab === tab.id
                                ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                                : "border-transparent text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white hover:border-black/10 dark:hover:border-white/10"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.name}
                        </button>
                    ))}
                </nav>

                <button className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 transition-colors mt-auto border-2 border-transparent hover:border-red-200 dark:hover:border-red-900/50">
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 overflow-y-auto bg-gray-50 dark:bg-zinc-950 transition-colors">
                <header className="mb-10 flex items-center justify-between border-b-2 border-black dark:border-white pb-6">
                    <div>
                        <h1 className="text-4xl font-black font-serif text-black dark:text-white uppercase tracking-tight">Dashboard Overview</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-2 text-xs">Welcome back, Super Admin. Here&apos;s what&apos;s happening today.</p>
                    </div>
                </header>
                {activeTab === "overview" ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                            {statsArray.map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 p-6 flex flex-col gap-4 hover:border-black dark:hover:border-white transition-colors">
                                    <div className={`w-12 h-12 border border-black/5 dark:border-white/5 flex items-center justify-center ${stat.color} bg-white dark:bg-zinc-800 shadow-sm`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black font-serif text-black dark:text-white">{stat.value}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">{stat.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Panels */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Pending Reviews Moderation */}
                            <div className="col-span-2 bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 p-8 flex flex-col transition-colors shadow-sm">
                                <div className="flex items-center justify-between mb-8 border-b-2 border-gray-100 dark:border-zinc-800 pb-4">
                                    <h2 className="text-xl font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        Pending Review Queue
                                    </h2>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white hover:text-white dark:hover:text-black border-2 border-black dark:border-white px-4 py-2 hover:bg-black dark:hover:bg-white transition-all">View All</button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {pendingReviews.length === 0 ? (
                                        <p className="text-gray-400 dark:text-gray-600 text-center font-black tracking-widest uppercase py-12 text-xs italic border-2 border-dashed border-gray-100 dark:border-zinc-800">Queue Cleared. No items pending.</p>
                                    ) : pendingReviews.map(review => (
                                        <div key={review.id} className="group grid grid-cols-[1fr_auto] gap-4 items-center p-4 bg-gray-50 dark:bg-zinc-950 border-2 border-transparent hover:border-black dark:hover:border-white transition-colors">
                                            <div>
                                                <h3 className="text-black dark:text-white font-black text-lg leading-tight group-hover:text-[var(--color-brand)] transition-colors cursor-pointer uppercase font-serif tracking-tight">{review.title || "Untitled"}</h3>
                                                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                                                    <span>By @{review.author?.name || "Unknown"}</span>
                                                    <span className="w-1 h-1 bg-gray-300 dark:bg-zinc-800 rounded-full" />
                                                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button title="Approve" onClick={() => handleReviewAction(review.id, "APPROVED")} className="w-10 h-10 rounded-none bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all border border-emerald-100 dark:border-emerald-900 shadow-sm">
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button title="Reject" onClick={() => handleReviewAction(review.id, "REJECTED")} className="w-10 h-10 rounded-none bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white flex items-center justify-center transition-all border border-red-100 dark:border-red-900 shadow-sm">
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800 mx-1" />
                                                <Link href={`/admin/reviews/${review.slug}/edit`} title="Edit" className="w-10 h-10 rounded-none bg-white dark:bg-zinc-900 text-gray-500 border border-gray-200 dark:border-zinc-800 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white flex items-center justify-center transition-all">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-col gap-8">
                                <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white p-8 relative overflow-hidden flex flex-col transition-colors">
                                    <h2 className="text-xl font-black uppercase tracking-widest text-black dark:text-white mb-6 border-b-2 border-gray-100 dark:border-zinc-800 pb-4">Editorial Ops</h2>
                                    <div className="flex flex-col gap-4">
                                        <button onClick={() => { setModalInitialMode("Movie"); setIsReviewModalOpen(true); }} className="w-full bg-black dark:bg-white hover:bg-[var(--color-brand)] dark:hover:bg-[var(--color-brand)] border-2 border-black dark:border-white hover:border-[var(--color-brand)] dark:hover:border-[var(--color-brand)] text-white dark:text-black dark:hover:text-white font-black uppercase tracking-widest text-xs py-4 transition-all">
                                            Write New Review
                                        </button>
                                        <button onClick={() => { setModalInitialMode("Blog"); setIsReviewModalOpen(true); }} className="w-full bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black border-2 border-black dark:border-white font-black uppercase tracking-widest text-xs py-4 transition-all">
                                            Compose Blog
                                        </button>
                                        <button onClick={() => { window.location.href = '/api/admin/subscribers/export'; }} className="w-full bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-black dark:text-white border-2 border-black/5 dark:border-white/5 font-black uppercase tracking-widest text-[10px] py-4 transition-all">
                                            Export Mailing List
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : activeTab === "reviews" ? (
                    <div className="bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 rounded-none p-8 flex flex-col min-h-[500px]">
                        <h2 className="text-xl font-black uppercase tracking-widest text-black dark:text-white mb-8 flex items-center gap-2 border-b-2 border-black/10 dark:border-white/10 pb-4">
                            <FileText className="w-5 h-5 text-gray-400" />
                            Global Review Library
                        </h2>

                        {loadingReviews ? (
                            <div className="flex items-center justify-center flex-1">
                                <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-black animate-spin"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {allReviews.length === 0 ? (
                                    <p className="text-gray-500 text-center uppercase tracking-widest font-black py-16 text-xs border-2 border-dashed border-gray-100 dark:border-zinc-800">No records found in library.</p>
                                ) : allReviews.map(review => (
                                    <div key={review.id} className="group grid grid-cols-[1fr_auto] gap-4 items-center p-4 border-2 border-black/5 dark:border-white/5 bg-gray-50 dark:bg-zinc-950 hover:border-black dark:hover:border-white transition-all shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2 py-0.5 text-[10px] font-black tracking-widest uppercase border-2 ${review.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900' : review.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900'}`}>{review.status || 'PENDING'}</span>
                                            </div>
                                            <h3 className="text-black dark:text-white font-black text-lg leading-tight group-hover:text-[var(--color-brand)] transition-colors cursor-pointer uppercase font-serif tracking-tight">{review.title || "Untitled"}</h3>
                                            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                                                <span>Author: {review.author?.name || "Unknown"}</span>
                                                <span className="w-1 h-1 bg-gray-300 dark:bg-zinc-800 rounded-full" />
                                                <span>Modified: {new Date(review.updatedAt || review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/reviews/${review.slug}/edit`} title="Edit" className="w-10 h-10 border-2 border-gray-200 dark:border-zinc-800 text-gray-500 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900 flex items-center justify-center transition-all">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDeleteReview(review.slug)} title="Delete" className="w-10 h-10 border-2 border-gray-200 dark:border-zinc-800 text-gray-500 hover:border-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center justify-center transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : activeTab === "users" ? (
                    <div className="bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 rounded-none p-8 flex flex-col min-h-[500px]">
                        <h2 className="text-xl font-black uppercase tracking-widest text-black dark:text-white mb-8 flex items-center gap-2 border-b-2 border-black/10 dark:border-white/10 pb-4">
                            <Users className="w-5 h-5 text-gray-400" />
                            Platform User Management
                        </h2>

                        {loadingUsers ? (
                            <div className="flex items-center justify-center flex-1">
                                <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-black animate-spin"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left order-collapse border-2 border-black/5 dark:border-white/5">
                                    <thead>
                                        <tr className="border-b-2 border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-[0.2em] bg-gray-100 dark:bg-zinc-950">
                                            <th className="pb-4 pt-4 font-black px-6">Identified Name</th>
                                            <th className="pb-4 pt-4 font-black px-6">Official Email</th>
                                            <th className="pb-4 pt-4 font-black px-6">Authority Level</th>
                                            <th className="pb-4 pt-4 font-black px-6 text-right">Administrative Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-black dark:text-white text-sm">
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                                <td className="py-5 px-6 font-black font-serif uppercase tracking-tight">{user.name}</td>
                                                <td className="py-5 px-6 text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">{user.email}</td>
                                                <td className="py-5 px-6">
                                                    <span className={`px-3 py-1 rounded-none text-[10px] font-black tracking-widest uppercase border-2 ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900' :
                                                        user.role === 'MODERATOR' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900' :
                                                            'bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:border-white/10'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    {user.role !== 'ADMIN' && (
                                                        <select
                                                            className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white text-black dark:text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 outline-none appearance-none cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        >
                                                            <option value="USER">Standard User</option>
                                                            <option value="MODERATOR">Editorial Moderator</option>
                                                        </select>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : activeTab === "newsletter" ? (
                    <div className="bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 rounded-none p-8 flex flex-col min-h-[500px]">
                        <h2 className="text-xl font-black uppercase tracking-widest text-black dark:text-white mb-8 flex items-center gap-2 border-b-2 border-black/10 dark:border-white/10 pb-4">
                            <Mail className="w-5 h-5 text-gray-400" />
                            Newsletter Distribution List
                        </h2>

                        {loadingSubscribers ? (
                            <div className="flex items-center justify-center flex-1">
                                <div className="w-8 h-8 rounded-full border-4 border-gray-100 dark:border-zinc-800 border-t-black dark:border-t-white animate-spin"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {subscribers.length === 0 ? (
                                    <p className="text-gray-500 text-center font-black uppercase tracking-widest py-16 text-xs border-2 border-dashed border-gray-100 dark:border-zinc-800">No active subscribers found.</p>
                                ) : subscribers.map(sub => (
                                    <div key={sub.id} className="grid grid-cols-[1fr_auto] gap-4 items-center p-6 border-2 border-black/5 dark:border-white/5 bg-gray-50 dark:bg-zinc-950 hover:border-black dark:hover:border-white transition-all shadow-sm">
                                        <div>
                                            <h3 className="text-black dark:text-white font-black flex items-center gap-2 mb-2 uppercase font-serif tracking-tight text-lg">
                                                <User className="w-4 h-4 text-gray-400" />
                                                {sub.name || "Subscriber Identity Anonymous"}
                                            </h3>
                                            <h4 className="text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{sub.email}</h4>
                                            <div className="flex items-center gap-4 mt-4">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Joined: {new Date(sub.subscribedAt).toLocaleString()}
                                                </p>
                                                <span className="px-2 py-0.5 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-500 text-[8px] font-black uppercase tracking-widest">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 bg-gray-50">
                        <p className="text-gray-400 font-bold uppercase tracking-widest">Coming Soon</p>
                    </div>
                )}
            </div>
        </div>
    );
}
