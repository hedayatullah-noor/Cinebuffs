"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.message || "Failed to reset password");
            }
        } catch (err) {
            setError("Failed to connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="w-20 h-20 bg-green-500 flex items-center justify-center mx-auto mb-8 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-black font-serif uppercase mb-4 dark:text-white text-black">Password Updated!</h1>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-10 leading-loose">
                    Aapka password successfully reset ho gaya hai. <br/> Ab aap login kar sakte hain.
                </p>
                <Link 
                    href="/login" 
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-5 px-8 font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--color-brand)] hover:text-white transition-all inline-flex items-center justify-center gap-3"
                >
                    Proceed to Login <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
        );
    }

    if (!token) {
        return (
            <div className="text-center py-10">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6 border-2 border-red-500">
                    <Lock className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-500 font-black uppercase text-xs tracking-widest mb-4">Invalid or Expired Token</p>
                <Link href="/forgot-password" title="Return" className="text-[10px] font-black uppercase tracking-widest underline hover:text-[var(--color-brand)] transition-colors">Request a new link</Link>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center mb-10">
                <div className="w-20 h-20 bg-black dark:bg-white flex items-center justify-center mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Lock className="w-10 h-10 text-white dark:text-black" />
                </div>
                <h1 className="text-4xl font-black font-serif uppercase text-center leading-tight tracking-tighter dark:text-white">
                    Set New <br/> <span className="text-[var(--color-brand)]">Password</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 mt-4 text-center leading-relaxed">
                    Choose a strong password <br/> for your security.
                </p>
            </div>

            {error && (
                <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="mb-8 p-4 bg-red-50 border-2 border-red-500 text-red-700 text-[10px] font-black uppercase tracking-widest text-center"
                >
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black dark:text-gray-400">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 dark:bg-zinc-800 border-2 border-black dark:border-gray-700 p-4 outline-none focus:border-[var(--color-brand)] dark:focus:border-white font-bold transition-all text-black dark:text-white"
                        required
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black dark:text-gray-400">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 dark:bg-zinc-800 border-2 border-black dark:border-gray-700 p-4 outline-none focus:border-[var(--color-brand)] dark:focus:border-white font-bold transition-all text-black dark:text-white"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-5 font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--color-brand)] hover:text-white dark:hover:bg-[var(--color-brand)] dark:hover:text-white transition-all flex items-center justify-center gap-3 active:translate-y-1"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent animate-spin"></div>
                    ) : (
                        <>
                            Reset Password <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex items-center justify-center p-6 pt-32 pb-20">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-white p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] relative overflow-hidden"
            >
                {/* Brand Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-brand)]"></div>
                
                <Suspense fallback={
                    <div className="flex flex-col items-center py-20">
                        <div className="w-10 h-10 border-4 border-[var(--color-brand)] border-t-transparent animate-spin mb-4"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 animate-pulse">Initializing Security...</p>
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </motion.div>
        </div>
    );
}
