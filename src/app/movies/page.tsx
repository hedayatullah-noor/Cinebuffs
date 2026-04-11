import ReviewGrid from "@/components/ReviewGrid";

export const metadata = {
    title: "Movie Reviews | CineBuffs",
    description: "Read the latest movie reviews, analysis, and ratings by the CineBuffs community.",
};

export default function MoviesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 py-10 transition-colors duration-300">
            {/* Header Section */}
            <div className="max-w-[1500px] mx-auto px-6 mb-12 mt-10 border-b-2 border-black dark:border-white pb-8 transition-colors">
                <h1 className="text-4xl md:text-5xl font-black font-serif text-black dark:text-white tracking-tight mb-4 uppercase">
                    Movie <span className="text-[var(--color-brand)]">Reviews</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-sm max-w-2xl leading-relaxed">
                    Discover our extensive collection of in-depth movie reviews spanning from blockbusters to indie cinema. Filter by genre and find your next favorite film.
                </p>
            </div>

            <ReviewGrid defaultType="Movie" hideHeader={true} />
        </div>
    );
}
