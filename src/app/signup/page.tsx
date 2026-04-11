"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, User, Shield, EyeOff, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (status === "error") setStatus("idle");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus("success");
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center -mt-16 pt-24 pb-12 px-6 relative overflow-hidden bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white border-2 border-gray-200 rounded-none p-8 sm:p-12 shadow-xl relative z-10"
            >
                <div className="mb-10 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-6">
                        <div className="w-12 h-12 border-2 border-black flex items-center justify-center text-black font-black uppercase tracking-widest bg-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                            CB
                        </div>
                    </Link>
                    <h1 className="text-4xl font-black font-serif text-black tracking-tight uppercase">Create Account</h1>
                    <p className="text-gray-500 mt-2 text-sm font-bold uppercase tracking-widest">Join the largest community of cinephiles</p>
                </div>

                {status === "success" ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border-2 border-green-200 rounded-none p-6 flex flex-col items-center text-center text-green-700"
                    >
                        <User className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] text-green-600" />
                        <p className="font-black font-serif text-xl mb-1 uppercase">Registration Successful!</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-green-600">Redirecting to your dashboard...</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border-2 border-gray-200 focus:border-black pl-12 pr-4 py-4 rounded-none outline-none text-black transition-all placeholder:text-gray-400 font-bold uppercase tracking-widest"
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border-2 border-gray-200 focus:border-black pl-12 pr-4 py-4 rounded-none outline-none text-black transition-all placeholder:text-gray-400 font-bold uppercase tracking-widest"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border-2 border-gray-200 focus:border-black pl-12 pr-12 py-4 rounded-none outline-none text-black transition-all placeholder:text-gray-400 font-bold uppercase tracking-widest"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>



                        {status === "error" && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-700 text-xs font-bold uppercase tracking-widest text-center bg-red-50 py-3 border border-red-200 -mt-2 mb-2"
                            >
                                Please provide a valid email address or check if the user already exists.
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-black border-2 border-black hover:bg-[var(--color-brand)] hover:border-[var(--color-brand)] text-white font-black text-lg py-4 rounded-none flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group uppercase tracking-widest mt-2"
                        >
                            {status === "loading" ? (
                                <div className="w-6 h-6 border-4 border-gray-400 border-t-white animate-spin"></div>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                )}

                <p className="text-center text-gray-500 mt-8 text-xs font-bold uppercase tracking-widest">
                    Already have an account?{' '}
                    <Link href="/login" className="text-black hover:text-[var(--color-brand)] font-black transition-colors border-b-2 border-black hover:border-[var(--color-brand)] pb-0.5 ml-1">
                        Log in here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
