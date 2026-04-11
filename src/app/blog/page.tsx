import ReviewGrid from "@/components/ReviewGrid";

export const metadata = {
    title: "Blog | CineBuffs",
    description: "Read the latest news, articles, and insights on movies and series by the CineBuffs community.",
};

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 py-10 transition-colors duration-300">
            {/* Header Section */}
            <div className="max-w-[1500px] mx-auto px-6 mb-12 mt-10 border-b-2 border-black dark:border-white pb-8 transition-colors">
                <h1 className="text-4xl md:text-5xl font-black font-serif text-black dark:text-white tracking-tight mb-4 uppercase">
                    Our <span className="text-[var(--color-brand)]">Blog</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-sm max-w-2xl leading-relaxed">
                    Dive into our articles, editorials, and special features. Stay updated with the latest in the cinematic universe.
                </p>
            </div>

            {/* Reuse the ReviewGrid but parse it as 'Blog' exclusively */}
            <ReviewGrid defaultType="Blog" hideHeader={true} />
        </div>
    );
}
