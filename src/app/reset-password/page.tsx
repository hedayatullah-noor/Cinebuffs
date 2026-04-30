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
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-6 border-2 border-green-500">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-black font-serif uppercase mb-4 text-black">Success!</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-8 leading-relaxed">
                    Your password has been reset successfully. You can now login with your new credentials.
                </p>
                <Link 
                    href="/login" 
                    className="w-full bg-black text-white py-4 px-8 font-black uppercase tracking-[0.2em] text-xs hover:bg-[var(--color-brand)] transition-colors inline-flex items-center justify-center gap-2"
                >
                    Proceed to Login <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="text-center">
                <p className="text-red-500 font-bold uppercase text-xs">Invalid Access: Token Missing</p>
                <Link href="/forgot-password" title="Return" className="mt-4 inline-block underline text-xs font-black uppercase">Get new link</Link>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-black flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-black font-serif uppercase text-center">Set New Password</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mt-2 text-center leading-relaxed">
                    Create a strong password that you'll remember.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-bold uppercase tracking-wider text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border-2 border-gray-200 p-4 outline-none focus:border-black font-bold transition-all"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border-2 border-gray-200 p-4 outline-none focus:border-black font-bold transition-all"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-[var(--color-brand)] transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-32 pb-20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white border-2 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
                <Suspense fallback={<p className="text-center font-bold uppercase text-[10px] animate-pulse">Loading Reset Form...</p>}>
                    <ResetPasswordForm />
                </Suspense>
            </motion.div>
        </div>
    );
}
