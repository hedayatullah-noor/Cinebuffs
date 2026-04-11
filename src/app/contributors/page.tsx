"use client";

import { useEffect, useState } from "react";
import { User, ShieldCheck, Mail, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function ContributorsPage() {
    const [contributors, setContributors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/contributors")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setContributors(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center pt-24 text-black font-black uppercase tracking-widest">Loading Contributors...</div>;
    }

    return (
        <div className="min-h-screen bg-white text-black pt-32 pb-24 px-6">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col items-center text-center mb-20 gap-4">
                    <h1 className="text-5xl md:text-7xl font-black font-serif italic tracking-tighter uppercase border-b-8 border-black pb-2">
                        Featured Contributors
                    </h1>
                    <p className="text-gray-500 max-w-2xl font-bold uppercase tracking-widest text-xs mt-4">
                        Meet the brilliant minds behind the lens. Our team of expert critics, industry insiders, and cinephiles dedicated to the art of storytelling.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
                    {contributors.map((person, idx) => (
                        <motion.div 
                            key={person.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-8 group"
                        >
                            <div className="w-40 h-40 md:w-48 md:h-48 shrink-0 relative overflow-hidden bg-gray-100 border-2 border-black hover:rotate-1 transition-transform cursor-pointer">
                                {person.image ? (
                                    <img src={person.image} alt={person.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><User className="w-12 h-12 text-gray-300" /></div>
                                )}
                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                    {person.role === 'ADMIN' && (
                                        <div className="bg-black text-white p-1" title="Lead Admin"><ShieldCheck className="w-3.5 h-3.5" /></div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <div className="flex flex-col">
                                    <h2 className="text-3xl font-black font-serif uppercase tracking-tight leading-none group-hover:text-[var(--color-brand)] transition-colors">{person.name}</h2>
                                    <span className="text-[10px] font-black uppercase tracking-widest mt-1.5 text-black border-l-2 border-[var(--color-brand)] pl-3">
                                        {person.role === 'ADMIN' ? 'Chief Editor' : 'Story Contributor'}
                                    </span>
                                </div>
                                <p className="text-gray-600 font-serif text-lg leading-relaxed italic md:max-w-md">
                                    {person.bio || "No bio available for this contributor yet."}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <button className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline">
                                        <Mail className="w-3.5 h-3.5" /> Contact
                                    </button>
                                    <button className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline text-[var(--color-brand)]">
                                        <Info className="w-3.5 h-3.5" /> Full Profile
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {contributors.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-24 bg-gray-50 border-2 border-dashed border-gray-200">
                        <Info className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="font-bold uppercase tracking-widest text-gray-400">Our contributors are currently updating their dossiers.</p>
                    </div>
                )}
            </div>
            
            <div className="mt-32 border-t-2 border-black pt-12 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Cinebuffs Editorial Board • Established 2024</p>
            </div>
        </div>
    );
}
