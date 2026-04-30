"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-32 pb-20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white border-2 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-black flex items-center justify-center mb-6">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black font-serif uppercase text-center">Forgot Password?</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mt-2 text-center leading-relaxed">
                        No worries, enter your email and we'll send you a reset link.
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 text-green-700 text-xs font-bold uppercase tracking-wider text-center">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-bold uppercase tracking-wider text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-black">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@email.com"
                                className="w-full bg-gray-50 border-2 border-gray-200 p-4 outline-none focus:border-black font-bold transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-[var(--color-brand)] transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? "Sending..." : (
                            <>
                                <Send className="w-4 h-4" /> Send Reset Link
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t-2 border-gray-100 text-center">
                    <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft className="w-3 h-3" /> Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
