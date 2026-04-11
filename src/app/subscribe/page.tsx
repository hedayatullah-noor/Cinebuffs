"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SubscribePage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            setStatus("error");
            return;
        }

        setStatus("loading");
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setStatus("success");
                setEmail("");
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Subscription failed:", error);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center -mt-16 pt-24 px-6 relative overflow-hidden bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-xl bg-white border-2 border-gray-200 rounded-none p-10 md:p-14 shadow-xl relative z-10"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 border-2 border-black flex items-center justify-center mb-6">
                        <Mail className="w-8 h-8 text-black" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black font-serif text-black mb-4 tracking-tight uppercase">Stay Updated</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest mb-10 text-sm">
                        Join 50,000+ cinephiles. Get weekly top reviews, exclusive early access, and curated movie lists straight to your inbox.
                    </p>

                    {status === "success" ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center gap-4 bg-green-50 border-2 border-green-200 w-full py-8 rounded-none"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                            <div className="text-center">
                                <p className="text-green-700 font-black font-serif text-xl mb-1 uppercase">You&apos;re on the list!</p>
                                <p className="text-green-600 font-bold uppercase tracking-widest text-xs">Check your inbox for a confirmation email.</p>
                            </div>
                            <button
                                onClick={() => setStatus("idle")}
                                className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors underline underline-offset-4"
                            >
                                Subscribe another email
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                            <div className="relative group w-full">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (status === "error") setStatus("idle");
                                    }}
                                    className={`w-full bg-white border-2 pl-14 pr-6 py-4 rounded-none outline-none text-black font-bold uppercase tracking-widest transition-all placeholder:text-gray-400
                    ${status === "error" ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-gray-200 focus:border-black"}`}
                                    disabled={status === "loading"}
                                />
                            </div>
                            {status === "error" && (
                                <p className="text-red-700 font-bold uppercase tracking-widest text-xs text-left px-2 -mt-2">Please enter a valid email address.</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full bg-black border-2 border-black hover:bg-[var(--color-brand)] hover:border-[var(--color-brand)] text-white font-black text-lg py-4 rounded-none flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group h-14 uppercase tracking-widest"
                            >
                                {status === "loading" ? (
                                    <div className="w-6 h-6 border-4 border-gray-400 border-t-white animate-spin"></div>
                                ) : (
                                    <>
                                        Subscribe Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-4 text-center">
                                By subscribing, you agree to our Terms of Service and Privacy Policy. No spam, ever.
                            </p>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
