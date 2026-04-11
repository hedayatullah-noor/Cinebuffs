"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Image as ImageIcon, CheckCircle, ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        image: "",
        bio: "",
        password: "",
        confirmPassword: ""
    });
    const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => {
                if (!res.ok) throw new Error("Not logged in");
                return res.json();
            })
            .then(data => {
                setUser(data);
                setFormData(prev => ({ 
                    ...prev, 
                    name: data.name, 
                    image: data.image || "", 
                    bio: data.bio || "" 
                }));
                setLoading(false);
            })
            .catch(() => {
                router.push('/login');
            });
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (status !== "idle") setStatus("idle");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            setStatus("error");
            setMessage("Passwords do not match");
            return;
        }

        setStatus("saving");

        try {
            const bodyData: any = {
                name: formData.name,
                image: formData.image,
                bio: formData.bio
            };
            if (formData.password) {
                bodyData.password = formData.password;
            }

            const res = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            if (res.ok) {
                setStatus("success");
                setMessage("Profile updated successfully!");
                const updatedUser = await res.json();
                setUser(updatedUser);
                setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
            } else {
                throw new Error("Failed to update");
            }
        } catch (error) {
            setStatus("error");
            setMessage("An error occurred while saving.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[var(--color-brand)] animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center py-12 px-6 pt-32 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl bg-white border border-gray-200 rounded-none overflow-hidden shadow-2xl"
            >
                <div className="p-8 border-b border-gray-200 flex flex-col items-center text-center bg-zinc-50">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
                        {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <h1 className="text-2xl font-black font-serif text-black uppercase tracking-tight">{user.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{user.email}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase tracking-widest">{user.role}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2 relative group">
                            <label className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Display Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border-2 border-gray-200 focus:border-black pl-11 pr-4 py-3 rounded-none outline-none text-black transition-all font-bold text-sm uppercase tracking-wider"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Profile Image (URL)</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="url"
                                    name="image"
                                    placeholder="https://..."
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full bg-white border-2 border-gray-200 focus:border-black pl-11 pr-4 py-3 rounded-none outline-none text-black transition-all font-bold text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-3 h-3" /> Contributor Bio 
                            {user.role !== 'USER' && <span className="text-[8px] text-green-600 bg-green-50 px-1 border border-green-200">Publically Displayed</span>}
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Give short brief about you and your role on Cinebuffs"
                            className="w-full bg-white border-2 border-gray-200 focus:border-black p-4 rounded-none outline-none text-black transition-all font-serif text-base resize-none leading-relaxed placeholder:text-gray-300"
                        />
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter italic">This bio will be shown on the Contributors page if you are a Moderator or Admin.</p>
                    </div>

                    <div className="pt-8 border-t border-gray-200">
                        <h3 className="text-black font-black uppercase tracking-widest mb-4 text-[10px] flex items-center gap-2">
                            <Lock className="w-3 h-3" /> Reset Credentials
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="password"
                                name="password"
                                placeholder="New Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black px-4 py-3 rounded-none outline-none text-black transition-all font-medium text-sm"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black px-4 py-3 rounded-none outline-none text-black transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    {status !== "idle" && (
                        <div className={`p-4 border-2 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] ${status === 'success' ? 'bg-green-50 border-green-500 text-green-600' : status === 'error' ? 'bg-red-50 border-red-500 text-red-600' : 'bg-gray-50 border-gray-200'}`}>
                            {status === "saving" ? "Updating profile..." : (
                                <>
                                    {status === "success" && <CheckCircle className="w-4 h-4" />}
                                    {message || "Success!"}
                                </>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === "saving"}
                        className="w-full bg-black hover:bg-[var(--color-brand)] text-white font-black py-4 rounded-none uppercase tracking-widest flex items-center justify-center gap-2 transition-all group border-2 border-black hover:border-[var(--color-brand)] shadow-lg"
                    >
                        {status === "saving" ? "Saving..." : (
                            <>
                                Update Profile Account
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
