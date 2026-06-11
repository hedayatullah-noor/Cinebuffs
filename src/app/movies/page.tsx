import ReviewGrid from "@/components/ReviewGrid";

export const metadata = {
    title: "Movie Reviews | CineBuffs",
    description: "In-depth movie reviews spanning blockbusters to indie cinema.",
};

export default function MoviesPage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>

            {/* ── Editorial page header ── */}
            <div className="w-full px-5 pt-10 pb-8" style={{ borderBottom: '2px solid var(--color-text-main)' }}>
                <div className="max-w-[1600px] mx-auto">

                    {/* Label */}
                    <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--color-brand)',
                        marginBottom: 12,
                    }}>
                        CineBuffs / Movie Reviews
                    </p>

                    {/* Title */}
                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: 700,
                        color: 'var(--color-text-main)',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        marginBottom: 16,
                    }}>
                        Movie Reviews
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 13,
                        color: 'var(--color-text-muted)',
                        maxWidth: 560,
                        lineHeight: 1.6,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 600,
                    }}>
                        Blockbusters to indie cinema — honest criticism, no compromise.
                    </p>
                </div>
            </div>

            {/* ── Grid ── */}
            <ReviewGrid defaultType="Movie" hideHeader={false} hideFilters={true} />
        </div>
    );
}
