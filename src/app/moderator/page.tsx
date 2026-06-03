"use client";

import { useState, useEffect } from "react";
import { FileText, CheckCircle, Clock, XCircle, Plus, Edit, Eye, Trash2, User } from "lucide-react";
import { motion } from "framer-motion";
import AddReviewModal from "@/components/AddReviewModal";

export default function ModeratorDashboard() {
    const [isModalOpen, setIsModalOpen]         = useState(false);
    const [modalInitialMode, setModalInitialMode] = useState<"Movie" | "Series" | "Blog">("Movie");
    const [editingReview, setEditingReview]     = useState<any>(null);
    const [reviews, setReviews]                 = useState<any[]>([]);
    const [currentUser, setCurrentUser]         = useState<any>(null);
    const [isLoading, setIsLoading]             = useState(true);
    const [activeFilter, setActiveFilter]       = useState<"ALL" | "APPROVED" | "PENDING" | "REJECTED">("ALL");

    useEffect(() => {
        fetch("/api/auth/me")
            .then(r => r.json())
            .then(user => {
                if (user && user.id) {
                    setCurrentUser(user);
                    return fetch(`/api/reviews?status=ALL&authorId=${user.id}`);
                }
                throw new Error("User not found");
            })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setReviews(data); })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const approvedCount = reviews.filter(r => r.status === "APPROVED").length;
    const pendingCount  = reviews.filter(r => r.status === "PENDING").length;
    const rejectedCount = reviews.filter(r => r.status === "REJECTED").length;

    const filteredReviews = activeFilter === "ALL"
        ? reviews
        : reviews.filter(r => r.status === activeFilter);

    const statusColor = (s: string) => s === "APPROVED" ? "#10B981" : s === "REJECTED" ? "#EF4444" : "#F59E0B";

    const stats = [
        { label: "Total",    value: reviews.length,  Icon: FileText,    color: "#3B82F6" },
        { label: "Approved", value: approvedCount,   Icon: CheckCircle, color: "#10B981" },
        { label: "Pending",  value: pendingCount,    Icon: Clock,       color: "#F59E0B" },
        { label: "Rejected", value: rejectedCount,   Icon: XCircle,     color: "#EF4444" },
    ];

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg-primary)", padding: "2.5rem 1.5rem" }}>
            <AddReviewModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingReview(null); }}
                initialMediaType={modalInitialMode}
                editData={editingReview}
            />

            <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

                {/* ── Header ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingBottom: "1.5rem", borderBottom: "2px solid var(--color-text-main)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {/* Avatar */}
                            <div style={{ width: 56, height: 56, backgroundColor: "var(--color-brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                                {currentUser?.image ? (
                                    <img src={currentUser.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <User style={{ width: 24, height: 24, color: "#fff" }} />
                                )}
                            </div>
                            <div>
                                <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-brand)", margin: "0 0 4px" }}>
                                    Contributor Portal
                                </p>
                                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 700, color: "var(--color-text-main)", margin: 0, lineHeight: 1.2 }}>
                                    {currentUser?.name || "Moderator"}
                                </h1>
                                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-text-muted)", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    Senior Contributor
                                </p>
                            </div>
                        </div>

                        {/* Write buttons */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {(["Movie", "Series", "Blog"] as const).map((type, i) => (
                                <button key={type}
                                    onClick={() => { setModalInitialMode(type); setEditingReview(null); setIsModalOpen(true); }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 6,
                                        padding: "9px 16px",
                                        backgroundColor: i === 0 ? "var(--color-brand)" : "transparent",
                                        color: i === 0 ? "#fff" : "var(--color-text-main)",
                                        border: i === 0 ? "none" : "1px solid var(--color-border)",
                                        fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                                        textTransform: "uppercase", letterSpacing: "0.1em",
                                        cursor: "pointer", transition: "all 0.15s ease",
                                    }}
                                >
                                    <Plus style={{ width: 12, height: 12 }} /> {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Stats ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                    {stats.map(({ label, value, Icon, color }) => (
                        <div key={label} style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)" }}>{label}</span>
                                <Icon style={{ width: 15, height: 15, color }} />
                            </div>
                            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text-main)", margin: 0, lineHeight: 1 }}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* ── Reviews table ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text-main)", margin: 0 }}>
                            My Contributions
                        </h2>

                        {/* Filter tabs */}
                        <div style={{ display: "flex", gap: 0, border: "1px solid var(--color-border)" }}>
                            {(["ALL", "APPROVED", "PENDING", "REJECTED"] as const).map(f => (
                                <button key={f} onClick={() => setActiveFilter(f)}
                                    style={{
                                        padding: "6px 14px", border: "none", cursor: "pointer",
                                        fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                                        textTransform: "uppercase", letterSpacing: "0.08em",
                                        backgroundColor: activeFilter === f ? "var(--color-brand)" : "transparent",
                                        color: activeFilter === f ? "#fff" : "var(--color-text-muted)",
                                        borderRight: f !== "REJECTED" ? "1px solid var(--color-border)" : "none",
                                        transition: "all 0.15s ease",
                                    }}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                            <div className="load-more-spinner" style={{ width: 24, height: 24 }} />
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div style={{ padding: "3rem", textAlign: "center", border: "1px dashed var(--color-border)", backgroundColor: "var(--color-bg-card)" }}>
                            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-text-muted)", margin: "0 0 8px" }}>No contributions yet.</p>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                Use the buttons above to write your first review.
                            </p>
                        </div>
                    ) : (
                        <div style={{ border: "1px solid var(--color-border)" }}>
                            {/* Header */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 100px 90px", padding: "10px 16px", backgroundColor: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)" }}>
                                {["Title", "Type", "Rating", "Status", "Actions"].map(h => (
                                    <span key={h} style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)" }}>{h}</span>
                                ))}
                            </div>

                            {filteredReviews.map((r, idx) => (
                                <div key={r.id}
                                    style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 100px 90px", padding: "11px 16px", borderBottom: idx < filteredReviews.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: "var(--color-bg-card)", alignItems: "center" }}>
                                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "var(--color-text-main)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {r.title}
                                    </p>
                                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>{r.type}</span>
                                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, color: "var(--color-text-main)" }}>
                                        {r.type !== "Blog" ? `${Number(r.rating).toFixed(1)}/10` : "—"}
                                    </span>
                                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: statusColor(r.status) }}>
                                        {r.status}
                                    </span>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <a href={`/reviews/${r.slug}`} target="_blank"
                                            style={{ width: 28, height: 28, border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", textDecoration: "none", transition: "all 0.15s ease" }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; }}>
                                            <Eye style={{ width: 12, height: 12 }} />
                                        </a>
                                        <button
                                            onClick={() => { setEditingReview(r); setModalInitialMode(r.type === "Blog" ? "Blog" : r.type === "Series" ? "Series" : "Movie"); setIsModalOpen(true); }}
                                            style={{ width: 28, height: 28, border: "1px solid var(--color-border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", transition: "all 0.15s ease" }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-brand)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; }}>
                                            <Edit style={{ width: 12, height: 12 }} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
