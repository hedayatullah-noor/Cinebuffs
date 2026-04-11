import ReviewGrid from "@/components/ReviewGrid";

export const metadata = {
    title: "Series Reviews | CineBuffs",
    description: "Read the latest TV show and streaming series reviews by the CineBuffs community.",
};

export default function SeriesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 py-10 transition-colors duration-300">
            {/* Header Section */}
            <div className="max-w-[1500px] mx-auto px-6 mb-12 mt-10 border-b-2 border-black dark:border-white pb-8 transition-colors">
                <h1 className="text-4xl md:text-5xl font-black font-serif text-black dark:text-white tracking-tight mb-4 uppercase">
                    Series <span className="text-[var(--color-brand)]">Reviews</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-sm max-w-2xl leading-relaxed">
                    Dive into our detailed episodic and seasonal reviews for the hottest TV shows, streaming series, and hidden gems. Find what to binge next.
                </p>
            </div>

            <ReviewGrid defaultType="Series" hideHeader={true} />
        </div>
    );
}
