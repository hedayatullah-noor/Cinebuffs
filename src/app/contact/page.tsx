"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        // Simulate form submission delay
        setTimeout(() => setStatus("success"), 1500);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 text-black pt-10 pb-20">
            {/* Header Section */}
            <section className="relative w-full max-w-5xl mx-auto px-6 lg:px-8 py-16 text-center border-b-2 border-black mb-12">
                <h1 className="text-4xl md:text-5xl font-black font-serif mb-6 tracking-tight uppercase">
                    Get in Touch with <span>CineBuffs</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 font-bold uppercase tracking-widest leading-relaxed max-w-3xl mx-auto">
                    We&apos;d love to hear from you! Whether you have questions, feedback, or collaboration ideas, the CineBuffs team is here to help. Reach out to us for inquiries about movie reviews, TV show insights, guest contributions, or advertising opportunities.
                </p>
            </section>

            <section className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Image Column */}
                    <div className="w-full relative shadow-xl border-2 border-black group bg-white">
                        <div className="aspect-[4/3] sm:aspect-square lg:aspect-[4/5] relative">
                            <Image
                                src="https://cinebuffs.org/wp-content/uploads/2025/02/Cinebuffs-contact.png"
                                alt="Contact CineBuffs Team"
                                fill
                                className="object-cover object-center filter grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Form & Content Column */}
                    <div className="flex flex-col flex-1 pl-0 lg:pl-4">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black font-serif mb-4 flex items-center gap-2 uppercase">
                                <MessageSquare className="w-8 h-8 text-black" />
                                Drop Us a Line
                            </h2>
                            <p className="text-gray-600 font-bold uppercase tracking-widest leading-relaxed text-xs">
                                Simply fill out the contact form, and we&apos;ll get back to you as soon as possible. You can also email us or connect with us on social media for the latest updates. At CineBuffs, we value your thoughts and opinions. Your feedback helps us improve and deliver better content. Let&apos;s connect and make the world of entertainment even more exciting.
                                <br /><br />
                                <strong className="text-black">Stay tuned for the latest in cinema!</strong>
                            </p>
                        </div>

                        <div className="bg-white border-2 border-black p-6 sm:p-8 relative">
                            {status === "success" ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-white/95 backdrop-blur-sm border-2 border-green-500 z-10">
                                    <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                                    <h3 className="text-2xl font-black font-serif text-black mb-2 uppercase">Message Sent!</h3>
                                    <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Thank you for reaching out. We will get back to you shortly.</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="mt-6 text-black hover:text-[var(--color-brand)] underline font-black uppercase tracking-widest text-xs"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-black text-black uppercase tracking-widest">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="John Doe"
                                                className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black px-4 py-3.5 text-black placeholder:text-gray-400 font-bold uppercase tracking-widest rounded-none outline-none transition-colors text-xs"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-black text-black uppercase tracking-widest">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="hello@example.com"
                                                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black pl-10 pr-4 py-3.5 text-black placeholder:text-gray-400 font-bold uppercase tracking-widest rounded-none outline-none transition-colors text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-black uppercase tracking-widest">Subject</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Write a clear subject"
                                            className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black px-4 py-3.5 text-black placeholder:text-gray-400 font-bold uppercase tracking-widest rounded-none outline-none transition-colors text-xs"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-black uppercase tracking-widest">Your Message</label>
                                        <textarea
                                            required
                                            placeholder="How can we help you?"
                                            className="w-full min-h-[160px] bg-gray-50 border-2 border-gray-200 focus:border-black px-4 py-3.5 text-black placeholder:text-gray-400 font-serif leading-relaxed rounded-none outline-none transition-colors resize-y text-base"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="w-full sm:w-auto self-start bg-black border-2 border-black hover:bg-[var(--color-brand)] hover:border-[var(--color-brand)] text-white font-black py-4 px-8 rounded-none flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-2 uppercase tracking-widest"
                                    >
                                        {status === "submitting" ? (
                                            <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
