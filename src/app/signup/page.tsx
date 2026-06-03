"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData]         = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus]             = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg]         = useState("Something went wrong. Please try again.");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (status === "error") setStatus("idle");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setStatus("success");
                setTimeout(() => router.push("/"), 2000);
            } else {
                const data = await res.json().catch(() => ({}));
                setErrorMsg(data.error || "Something went wrong. Please try again.");
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    const inputStyle = (hasError?: boolean) => ({
        width: "100%",
        padding: "11px 14px 11px 40px",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        border: `1px solid ${hasError ? "var(--color-brand)" : "var(--color-border)"}`,
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-main)",
        outline: "none",
        transition: "border-color 0.2s ease",
    });

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "var(--color-bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1rem",
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ width: "100%", maxWidth: 420 }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <Link href="/">
                        <Image
                            src="/images/logo.png"
                            alt="CineBuffs"
                            width={160}
                            height={48}
                            style={{ height: 48, width: "auto", objectFit: "contain" }}
                        />
                    </Link>
                </div>

                {/* Card */}
                <div style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", padding: "2.5rem" }}>

                    {/* Success state */}
                    <AnimatePresence>
                        {status === "success" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ textAlign: "center", padding: "2rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
                            >
                                <CheckCircle2 style={{ width: 44, height: 44, color: "var(--color-brand)" }} />
                                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-main)", margin: 0 }}>
                                    Account Created!
                                </h2>
                                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--color-text-muted)" }}>
                                    Redirecting you to the homepage...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {status !== "success" && (
                        <>
                            {/* Header */}
                            <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--color-border)" }}>
                                <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-brand)", marginBottom: 8 }}>
                                    New Member
                                </p>
                                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text-main)", margin: 0, lineHeight: 1.2 }}>
                                    Create Account
                                </h1>
                                <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--color-text-muted)", marginTop: 6 }}>
                                    Join the CineBuffs community of cinephiles.
                                </p>
                            </div>

                            {/* Error */}
                            {status === "error" && (
                                <div style={{ backgroundColor: "#FFF5F5", border: "1px solid #FCA5A5", padding: "10px 14px", marginBottom: "1.25rem" }}>
                                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#DC2626", margin: 0, fontWeight: 600 }}>
                                        {errorMsg}
                                    </p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {/* Name */}
                                <div style={{ position: "relative" }}>
                                    <User style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--color-text-muted)" }} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle()}
                                        onFocus={e => (e.target.style.borderColor = "var(--color-brand)")}
                                        onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
                                    />
                                </div>

                                {/* Email */}
                                <div style={{ position: "relative" }}>
                                    <Mail style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--color-text-muted)" }} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle(status === "error")}
                                        onFocus={e => (e.target.style.borderColor = "var(--color-brand)")}
                                        onBlur={e => (e.target.style.borderColor = status === "error" ? "var(--color-brand)" : "var(--color-border)")}
                                    />
                                </div>

                                {/* Password */}
                                <div style={{ position: "relative" }}>
                                    <Lock style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--color-text-muted)" }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        style={{ ...inputStyle(), paddingRight: 44 }}
                                        onFocus={e => (e.target.style.borderColor = "var(--color-brand)")}
                                        onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: 2 }}
                                    >
                                        {showPassword ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                                    </button>
                                </div>

                                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-text-muted)", margin: "-4px 0 0" }}>
                                    Minimum 6 characters.
                                </p>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    style={{
                                        marginTop: "0.5rem",
                                        padding: "12px",
                                        backgroundColor: status === "loading" ? "var(--color-text-muted)" : "var(--color-brand)",
                                        color: "#fff",
                                        border: "none",
                                        fontFamily: "var(--font-sans)",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.14em",
                                        cursor: status === "loading" ? "not-allowed" : "pointer",
                                        transition: "background-color 0.2s ease",
                                        width: "100%",
                                    }}
                                >
                                    {status === "loading" ? "Creating Account..." : "Create Account"}
                                </button>
                            </form>

                            {/* Footer */}
                            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-border)", textAlign: "center" }}>
                                <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--color-text-muted)" }}>
                                    Already have an account?{" "}
                                    <Link href="/login" style={{ color: "var(--color-brand)", fontWeight: 700, textDecoration: "none" }}>
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Back to site */}
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-text-muted)", textDecoration: "none" }}>
                        ← Back to CineBuffs
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
