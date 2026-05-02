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
    const [isSubmitted, setIsSubmitted] = useState(false);

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
                setIsSubmitted(true);
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Failed to connect to server. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex items-center justify-center p-6 pt-32 pb-20">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-white p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] relative overflow-hidden"
            >
                {/* Brand Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-brand)]"></div>

                {!isSubmitted ? (
                    <>
                        <div className="flex flex-col items-center mb-10">
                            <div className="w-20 h-20 bg-black dark:bg-white flex items-center justify-center mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                                <Mail className="w-10 h-10 text-white dark:text-black" />
                            </div>
                            <h1 className="text-4xl font-black font-serif uppercase text-center leading-tight tracking-tighter dark:text-white">
                                Forgot <br/> <span className="text-[var(--color-brand)]">Password?</span>
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 mt-4 text-center leading-relaxed">
                                Enter your email below to receive <br/> a secure reset link.
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

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black dark:text-gray-400">Email Address</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border-2 border-black dark:border-gray-700 p-4 outline-none focus:border-[var(--color-brand)] dark:focus:border-white font-bold transition-all text-black dark:text-white"
                                        required
                                    />
                                    <div className="absolute inset-0 border-2 border-transparent group-focus-within:translate-x-1 group-focus-within:translate-y-1 -z-10 transition-transform"></div>
                                </div>
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
                                        <Send className="w-4 h-4" /> Send Reset Link
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-4"
                    >
                        <div className="w-20 h-20 bg-green-500 flex items-center justify-center mx-auto mb-8 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <Send className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-black font-serif uppercase mb-4 dark:text-white">Check Your Inbox</h2>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-10 leading-loose">
                            Humein aapke email <span className="text-black dark:text-white border-b-2 border-[var(--color-brand)]">{email}</span> par reset link bhej diya hai.
                        </p>
                        <Link 
                            href="/login" 
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-black dark:text-white hover:text-[var(--color-brand)] transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Login
                        </Link>
                    </motion.div>
                )}

                {!isSubmitted && (
                    <div className="mt-12 pt-8 border-t-2 border-gray-100 dark:border-zinc-800 text-center">
                        <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-2 group">
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Login
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
