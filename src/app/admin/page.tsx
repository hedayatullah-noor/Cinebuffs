"use client";

import { useState, useEffect } from "react";
import {
    Users, FileText, CheckCircle, Clock, Mail,
    LogOut, Check, X, Edit, Trash2, User,
    LayoutDashboard, Settings, Download,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import AddReviewModal from "@/components/AddReviewModal";

interface UserType {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

/* ── Stat card ── */
function StatCard({ title, value, Icon, accent }: { title: string; value: number; Icon: any; accent: string }) {
    return (
        <div style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-text-muted)" }}>
                    {title}
                </span>
                <Icon style={{ width: 16, height: 16, color: accent }} />
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700, color: "var(--color-text-main)", margin: 0, lineHeight: 1 }}>
                {value}
            </p>
        </div>
    );
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab]           = useState("overview");
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [modalInitialMode, setModalInitialMode]   = useState<"Movie" | "Series" | "Blog">("Movie");
    const [editingReview, setEditingReview]   = useState<any>(null);
    const [users, setUsers]                   = useState<UserType[]>([]);
    const [loadingUsers, setLoadingUsers]     = useState(false);
    const [pendingReviews, setPendingReviews] = useState<any[]>([]);
    const [allReviews, setAllReviews]         = useState<any[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
    const [reviewSearch, setReviewSearch]     = useState("");
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [subscribers, setSubscribers]       = useState<any[]>([]);
    const [statsData, setStatsData]           = useState<any>(null);

    useEffect(() => {
        if (activeTab === "users") {
            setLoadingUsers(true);
            fetch("/api/admin/users")
                .then(r => r.json())
                .then(data => { if (Array.isArray(data)) setUsers(data); })
                .finally(() => setLoadingUsers(false));
        }
        if (activeTab === "overview") {
            fetch("/api/admin/stats").then(r => r.json()).then(d => { if (d) setStatsData(d); });
            fetch("/api/reviews?status=PENDING").then(r => r.json()).then(d => { if (Array.isArray(d)) setPendingReviews(d); });
        }
        if (activeTab === "reviews") {
            setLoadingReviews(true);
            fetch("/api/admin/reviews")
                .then(r => r.json())
                .then(data => {
                    if (Array.isArray(data)) { setAllReviews(data); setFilteredReviews(data); }
                })
                .finally(() => setLoadingReviews(false));
        }
        if (activeTab === "newsletter") {
            fetch("/api/admin/subscribers").then(r => r.json()).then(d => { if (Array.isArray(d)) setSubscribers(d); });
        }
    }, [activeTab]);

    // Review search filter
    useEffect(() => {
        if (!reviewSearch.trim()) {
            setFilteredReviews(allReviews);
        } else {
            const q = reviewSearch.toLowerCase();
            setFilteredReviews(allReviews.filter(r =>
                r.title?.toLowerCase().includes(q) ||
                r.author?.name?.toLowerCase().includes(q) ||
                r.genre?.toLowerCase().includes(q) ||
                r.type?.toLowerCase().includes(q) ||
                r.status?.toLowerCase().includes(q)
            ));
        }
    }, [reviewSearch, allReviews]);

    const handleDeleteReview = async (slug: string) => {
        if (!window.confirm("Permanently delete this review?")) return;
        const res = await fetch(`/api/admin/reviews/${slug}`, { method: "DELETE" });
        if (res.ok) {
            setAllReviews(prev => prev.filter(r => r.slug !== slug));
            setPendingReviews(prev => prev.filter(r => r.slug !== slug));
        }
    };

    const handleReviewAction = async (reviewId: string, status: string) => {
        const res = await fetch("/api/admin/reviews", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reviewId, status }),
        });
        if (res.ok) setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const res = await fetch("/api/admin/users/role", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, role: newRole }),
        });
        if (res.ok) setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
    };

    const exportCSV = () => {
        const rows = subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleDateString()}`);
        const blob = new Blob([["Email,Date\n", ...rows.map(r => r + "\n")].join("")], { type: "text/csv" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "subscribers.csv"; a.click();
    };

    const statsArray = [
        { title: "Total Users",    value: statsData?.users || 0,       Icon: Users,       accent: "#3B82F6" },
        { title: "Total Reviews",  value: statsData?.reviews || 0,     Icon: FileText,    accent: "#8B5CF6" },
        { title: "Approved",       value: statsData?.approved || 0,    Icon: CheckCircle, accent: "#10B981" },
        { title: "Pending",        value: statsData?.pending || 0,     Icon: Clock,       accent: "#F59E0B" },
        { title: "Subscribers",    value: statsData?.subscribers || 0, Icon: Mail,        accent: "#EC4899" },
    ];

    const sidebarLinks = [
        { id: "overview",    label: "Overview",        Icon: LayoutDashboard },
        { id: "reviews",     label: "Manage Reviews",  Icon: FileText },
        { id: "users",       label: "Users",           Icon: Users },
        { id: "newsletter",  label: "Newsletter",      Icon: Mail },
    ];

    const statusColor = (s: string) => s === "APPROVED" ? "#10B981" : s === "REJECTED" ? "#EF4444" : "#F59E0B";

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg-primary)", display: "flex" }}>
            <AddReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => { setIsReviewModalOpen(false); setEditingReview(null); }}
                initialMediaType={modalInitialMode}
                editData={editingReview}
            />

            {/* ── Sidebar ── */}
            <aside style={{ width: 220, flexShrink: 0, backgroundColor: "var(--color-bg-card)", borderRight: "1px solid var(--color-border)", display: "flex", flexDirection: "column", position: "sticky", top: 124, height: "calc(100vh - 124px)", overflow: "hidden" }}>
                {/* Brand */}
                <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--color-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, backgroundColor: "var(--color-brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Settings style={{ width: 16, height: 16, color: "#fff" }} />
                        </div>
                        <div>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-main)", margin: 0 }}>Admin</p>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)", margin: 0 }}>Portal</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "0.75rem 0" }}>
                    {sidebarLinks.map(({ id, label, Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                            style={{
                                width: "100%", display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 1.5rem", border: "none", cursor: "pointer",
                                backgroundColor: activeTab === id ? "var(--color-brand)" : "transparent",
                                color: activeTab === id ? "#fff" : "var(--color-text-muted)",
                                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
                                textTransform: "uppercase", letterSpacing: "0.08em",
                                transition: "all 0.15s ease", textAlign: "left",
                            }}
                        >
                            <Icon style={{ width: 14, height: 14, flexShrink: 0 }} /> {label}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)" }}>
                    <button onClick={handleLogout}
                        style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-brand)", padding: 0 }}>
                        <LogOut style={{ width: 14, height: 14 }} /> Logout
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <main style={{ flex: 1, padding: "2.5rem", overflow: "auto", minWidth: 0 }}>

                {/* ── Overview ── */}
                {activeTab === "overview" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        <div>
                            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text-main)", margin: "0 0 4px" }}>
                                Dashboard Overview
                            </h1>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)", margin: 0 }}>
                                Welcome back, Super Admin. Here's what's happening today.
                            </p>
                        </div>

                        <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

                        {/* Stats grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
                            {statsArray.map(s => <StatCard key={s.title} {...s} />)}
                        </div>

                        {/* Bottom row */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem" }}>
                            {/* Pending queue */}
                            <div style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", padding: "1.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                                    <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-text-muted)", margin: 0 }}>
                                        ⏱ Pending Review Queue
                                    </h3>
                                    <button onClick={() => setActiveTab("reviews")}
                                        style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-brand)", background: "none", border: "1px solid var(--color-brand)", padding: "4px 10px", cursor: "pointer" }}>
                                        View All
                                    </button>
                                </div>
                                {pendingReviews.length === 0 ? (
                                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--color-text-muted)", fontStyle: "italic", textAlign: "center", padding: "1.5rem 0" }}>
                                        Queue cleared. No items pending.
                                    </p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                        {pendingReviews.slice(0, 5).map(r => (
                                            <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", backgroundColor: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
                                                <div>
                                                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-text-main)", margin: "0 0 2px" }}>{r.title}</p>
                                                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "var(--color-text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                                        {r.type} · {r.author?.name}
                                                    </p>
                                                </div>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <button onClick={() => handleReviewAction(r.id, "APPROVED")}
                                                        style={{ width: 30, height: 30, border: "none", backgroundColor: "#10B981", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <Check style={{ width: 14, height: 14 }} />
                                                    </button>
                                                    <button onClick={() => handleReviewAction(r.id, "REJECTED")}
                                                        style={{ width: 30, height: 30, border: "none", backgroundColor: "#EF4444", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <X style={{ width: 14, height: 14 }} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Editorial ops */}
                            <div style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", padding: "1.5rem", minWidth: 220, display: "flex", flexDirection: "column", gap: 10 }}>
                                <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-text-muted)", margin: "0 0 4px" }}>
                                    Editorial Ops
                                </h3>
                                {(["Movie", "Series", "Blog"] as const).map(type => (
                                    <button key={type}
                                        onClick={() => { setModalInitialMode(type); setEditingReview(null); setIsReviewModalOpen(true); }}
                                        style={{
                                            padding: "10px 16px", border: type === "Movie" ? "none" : "1px solid var(--color-border)",
                                            backgroundColor: type === "Movie" ? "var(--color-brand)" : "transparent",
                                            color: type === "Movie" ? "#fff" : "var(--color-text-main)",
                                            fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                                            textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer",
                                            transition: "all 0.15s ease",
                                        }}
                                    >
                                        Write {type} Review
                                    </button>
                                ))}
                                <button onClick={exportCSV}
                                    style={{ padding: "10px 16px", border: "1px solid var(--color-border)", backgroundColor: "transparent", color: "var(--color-text-main)", fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}>
                                    Export Mailing List
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Manage Reviews ── */}
                {activeTab === "reviews" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text-main)", margin: 0 }}>
                                Manage Reviews
                            </h1>
                            {/* Search bar */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--color-border)", padding: "8px 14px", backgroundColor: "var(--color-bg-card)", minWidth: 260 }}>
                                <FileText style={{ width: 14, height: 14, color: "var(--color-text-muted)", flexShrink: 0 }} />
                                <input
                                    type="text"
                                    placeholder="Search by title, author, genre..."
                                    value={reviewSearch}
                                    onChange={e => setReviewSearch(e.target.value)}
                                    style={{ border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--color-text-main)", width: "100%" }}
                                />
                            </div>
                        </div>

                        <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

                        {loadingReviews ? (
                            <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                                <div className="load-more-spinner" style={{ width: 24, height: 24 }} />
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--color-border)" }}>
                                {/* Table header */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px 100px 100px", gap: 0, backgroundColor: "var(--color-bg-primary)", padding: "10px 16px", borderBottom: "1px solid var(--color-border)" }}>
                                    {["Title", "Type", "Rating", "Status", "Actions"].map(h => (
                                        <span key={h} style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)" }}>
                                            {h}
                                        </span>
                                    ))}
                                </div>

                                {filteredReviews.length === 0 ? (
                                    <div style={{ padding: "2rem", textAlign: "center" }}>
                                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                            {reviewSearch ? "No reviews match your search." : "No reviews found."}
                                        </p>
                                    </div>
                                ) : filteredReviews.map((r, idx) => (
                                    <div key={r.id}
                                        style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px 100px 100px", gap: 0, padding: "12px 16px", borderBottom: idx < filteredReviews.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: "var(--color-bg-card)", alignItems: "center" }}>
                                        <div>
                                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "var(--color-text-main)", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {r.title}
                                            </p>
                                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "var(--color-text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                                {r.author?.name}
                                            </p>
                                        </div>
                                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>{r.type}</span>
                                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-text-main)", fontWeight: 700 }}>{r.type !== "Blog" ? `${Number(r.rating).toFixed(1)}/10` : "—"}</span>
                                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: statusColor(r.status) }}>
                                            {r.status}
                                        </span>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button
                                                onClick={() => { setEditingReview(r); setModalInitialMode(r.type === "Blog" ? "Blog" : r.type === "Series" ? "Series" : "Movie"); setIsReviewModalOpen(true); }}
                                                style={{ width: 28, height: 28, border: "1px solid var(--color-border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", transition: "all 0.15s ease" }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand)"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand)"; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"; }}
                                            >
                                                <Edit style={{ width: 12, height: 12 }} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReview(r.slug)}
                                                style={{ width: 28, height: 28, border: "1px solid var(--color-border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", transition: "all 0.15s ease" }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#EF4444"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "#EF4444"; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"; }}
                                            >
                                                <Trash2 style={{ width: 12, height: 12 }} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Users ── */}
                {activeTab === "users" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text-main)", margin: 0 }}>
                            Users
                        </h1>
                        <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

                        {loadingUsers ? (
                            <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                                <div className="load-more-spinner" style={{ width: 24, height: 24 }} />
                            </div>
                        ) : (
                            <div style={{ border: "1px solid var(--color-border)" }}>
                                {/* Header */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 140px 120px", padding: "10px 16px", backgroundColor: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)" }}>
                                    {["User", "Email", "Role", "Joined"].map(h => (
                                        <span key={h} style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)" }}>
                                            {h}
                                        </span>
                                    ))}
                                </div>
                                {users.map((u, idx) => (
                                    <div key={u.id}
                                        style={{ display: "grid", gridTemplateColumns: "1fr 180px 140px 120px", padding: "12px 16px", borderBottom: idx < users.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: "var(--color-bg-card)", alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "var(--color-brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                                                {u.name ? (
                                                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{u.name.charAt(0).toUpperCase()}</span>
                                                ) : <User style={{ width: 14, height: 14, color: "#fff" }} />}
                                            </div>
                                            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "var(--color-text-main)" }}>{u.name}</span>
                                        </div>
                                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</span>
                                        <select
                                            value={u.role}
                                            onChange={e => handleRoleChange(u.id, e.target.value)}
                                            style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-main)", padding: "4px 8px", cursor: "pointer", outline: "none" }}
                                        >
                                            {["USER", "MODERATOR", "ADMIN"].map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-text-muted)" }}>
                                            {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Newsletter ── */}
                {activeTab === "newsletter" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text-main)", margin: 0 }}>
                                Newsletter ({subscribers.length} subscribers)
                            </h1>
                            <button onClick={exportCSV}
                                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", backgroundColor: "var(--color-brand)", color: "#fff", border: "none", fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}>
                                <Download style={{ width: 13, height: 13 }} /> Export CSV
                            </button>
                        </div>
                        <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

                        <div style={{ border: "1px solid var(--color-border)" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", padding: "10px 16px", backgroundColor: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)" }}>
                                {["Email", "Subscribed"].map(h => (
                                    <span key={h} style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)" }}>{h}</span>
                                ))}
                            </div>
                            {subscribers.map((s, idx) => (
                                <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1fr 160px", padding: "11px 16px", borderBottom: idx < subscribers.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: "var(--color-bg-card)", alignItems: "center" }}>
                                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--color-text-main)" }}>{s.email}</span>
                                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-text-muted)" }}>
                                        {new Date(s.subscribedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
