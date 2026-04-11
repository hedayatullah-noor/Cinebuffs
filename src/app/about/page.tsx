import { Film, Tv, MonitorPlay, Users, Globe, PlayCircle } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-black pt-10 pb-20">
            {/* Hero Section */}
            <section className="relative w-full max-w-5xl mx-auto px-6 lg:px-8 py-20 overflow-hidden text-center border-b-2 border-black">
                <h1 className="text-4xl md:text-6xl font-black font-serif mb-8 tracking-tight uppercase">
                    About <span>CineBuffs</span>
                </h1>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed font-black uppercase tracking-widest max-w-4xl mx-auto">
                    Step into a world where stories come alive, emotions run deep, and every frame is a doorway to endless cinematic adventures with CineBuffs. Entertainment offers a perfect escape from the chaos of life.
                </p>
            </section>

            {/* Content Sections */}
            <section className="max-w-4xl mx-auto px-6 lg:px-8 py-12 space-y-20">

                {/* Block 1 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-black font-serif flex items-center gap-3 uppercase">
                        <MonitorPlay className="w-8 h-8 text-black" />
                        Check Out the Best Movies and TV Shows with CineBuffs
                    </h2>
                    <p className="text-gray-800 text-lg leading-relaxed font-serif bg-white border-2 border-black p-6">
                        Whether you’re watching a thrilling movie or binge-watching a popular TV series, these experiences create lasting memories. At CineBuffs, we bring you honest movie reviews, detailed TV show reviews, and expert insights into the latest trends. No more wasting time on mediocre content—our reviews will help you pick the best.
                    </p>
                </div>

                {/* Block 2 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-black font-serif flex items-center gap-3 uppercase">
                        <Tv className="w-8 h-8 text-black" />
                        Why Movie Reviews and TV Show Reviews Matter
                    </h2>
                    <p className="text-gray-800 text-lg leading-relaxed font-serif bg-white border-2 border-black p-6">
                        With so many streaming platforms like Netflix, Amazon Prime, and Disney+, choosing the right content can be overwhelming. CineBuffs makes it easy. Our in-depth movie reviews and detailed series reviews ensure that you always make the right choice. Whether you love action-packed blockbusters or gripping dramas, we’ve got you covered.
                    </p>
                </div>

                {/* Block 3 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-black font-serif flex items-center gap-3 uppercase">
                        <PlayCircle className="w-8 h-8 text-black" />
                        Get the Latest Reviews on Popular OTT Platforms
                    </h2>
                    <p className="text-gray-800 text-lg leading-relaxed font-serif bg-white border-2 border-black p-6">
                        Streaming services release new content almost every day. Staying updated is crucial, and that’s where CineBuffs’ latest movie reviews and TV show critiques come in handy. We analyze every detail, from plot and performances to cinematography and sound design, helping you find what suits your taste.
                    </p>
                </div>

                {/* Block 4 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-black font-serif flex items-center gap-3 uppercase">
                        <Users className="w-8 h-8 text-black" />
                        Engage with a Community of Movie Enthusiasts
                    </h2>
                    <p className="text-gray-800 text-lg leading-relaxed font-serif bg-white border-2 border-black p-6">
                        Movies and TV shows spark discussions, debates, and even friendships. We encourage our readers to share their thoughts in the comments. Your opinions matter! Whether you agree or disagree with our movie ratings, your voice adds to the conversation.
                    </p>
                </div>

                {/* Block 5 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-black font-serif flex items-center gap-3 uppercase">
                        <Globe className="w-8 h-8 text-black" />
                        Beyond Reviews: Exploring Cinema
                    </h2>
                    <p className="text-gray-800 text-lg leading-relaxed font-serif bg-white border-2 border-black p-6">
                        We do more than just movie and TV reviews. Our engaging blogs cover everything from classic films to the latest trends. Want to know about the evolution of sci-fi movies or the impact of storytelling in cinema? Our articles dive deep into the world of entertainment.
                    </p>
                </div>

                {/* Block 6 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-black font-serif flex items-center gap-3 uppercase">
                        <Film className="w-8 h-8 text-black" />
                        Join CineBuffs – Share Your Passion for Movies and TV Shows
                    </h2>
                    <p className="text-gray-800 text-lg leading-relaxed font-serif bg-white border-2 border-black p-6">
                        Are you a movie lover with a knack for writing? CineBuffs is always looking for fresh voices. If you have unique insights, reviews, or opinions, join our community. Your perspective could be the next big hit among movie fans.<br /><br />
                        <strong className="text-black font-black uppercase tracking-widest text-xs">MAVERICK QUILL DIGITAL</strong> is a dynamic digital media company that manages multiple websites, including CineBuffs. As a dedicated platform for film and television enthusiasts, CineBuffs offers in-depth reviews, blogs, and articles on movies and series. It embodies MAVERICK QUILL DIGITAL’s commitment to delivering engaging and insightful entertainment content.
                    </p>
                </div>

                {/* Outro */}
                <div className="text-center pt-10 pb-4 border-t-2 border-black mt-20">
                    <h2 className="text-3xl font-black font-serif mb-4 uppercase">Let CineBuffs Be Your Guide in the World of Entertainment</h2>
                    <p className="text-gray-800 text-lg font-serif max-w-2xl mx-auto">
                        From Hollywood blockbusters to hidden gems, CineBuffs’ movie reviews and series recommendations make your viewing experience effortless. Sit back, relax, and let us help you navigate the ever-growing world of cinema.
                    </p>
                    <p className="text-black font-black uppercase tracking-widest text-2xl mt-8">Happy Watching!</p>
                </div>

            </section>
        </div>
    );
}
