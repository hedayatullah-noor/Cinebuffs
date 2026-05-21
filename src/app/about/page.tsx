import { Film, Tv, MonitorPlay, Users, Globe, PlayCircle } from "lucide-react";

export default function AboutPage() {
    const sections = [
        {
            icon: MonitorPlay,
            title: "The Best in Film & Television",
            body: "Whether you're watching a thrilling movie or binge-watching a popular TV series, these experiences create lasting memories. At CineBuffs, we bring you honest reviews, detailed analysis, and expert insights. No more wasting time on mediocre content — our criticism helps you choose wisely.",
        },
        {
            icon: Tv,
            title: "Why Criticism Matters",
            body: "With so many streaming platforms releasing content every day, choosing what to watch can be overwhelming. CineBuffs makes it simple. Our in-depth reviews ensure you always make the right choice — whether you love action-packed blockbusters or quiet, contemplative dramas.",
        },
        {
            icon: PlayCircle,
            title: "OTT & Streaming Coverage",
            body: "Streaming services release new content almost every day. CineBuffs analyzes every detail — from plot and performances to cinematography and sound design — helping you find what suits your taste across Netflix, Prime Video, Disney+, and beyond.",
        },
        {
            icon: Users,
            title: "A Community of Cinephiles",
            body: "Movies and TV shows spark discussions, debates, and even friendships. We encourage our readers to share their thoughts in the comments. Your voice adds to the conversation — whether you agree or disagree with our ratings.",
        },
        {
            icon: Globe,
            title: "Beyond Reviews",
            body: "We do more than just reviews. Our blog covers everything from classic films to the latest trends, exploring the evolution of storytelling in cinema and television. Deep dives, retrospectives, and cultural commentary — all in one place.",
        },
        {
            icon: Film,
            title: "Join CineBuffs",
            body: "Are you a movie lover with a knack for writing? CineBuffs is always looking for fresh voices. If you have unique insights, reviews, or opinions, join our community. Your perspective could reach thousands of fellow film enthusiasts.",
        },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>

            {/* ── Hero header ── */}
            <div className="w-full px-5 pt-12 pb-10" style={{ borderBottom: '2px solid var(--color-text-main)' }}>
                <div style={{ maxWidth: 860, margin: '0 auto' }}>
                    <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: 'var(--color-brand)', marginBottom: 14,
                    }}>
                        CineBuffs / About Us
                    </p>
                    <h1 style={{
                        fontFamily: 'var(--font-serif)', fontWeight: 700,
                        fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                        color: 'var(--color-text-main)', lineHeight: 1.1,
                        letterSpacing: '-0.02em', marginBottom: 20,
                    }}>
                        About CineBuffs
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: 14,
                        color: 'var(--color-text-muted)', lineHeight: 1.7,
                        maxWidth: 620,
                    }}>
                        Step into a world where stories come alive, emotions run deep, and every frame is a doorway to endless cinematic adventures. CineBuffs is your trusted guide through the world of film and television.
                    </p>
                </div>
            </div>

            {/* ── Content sections ── */}
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '4rem 1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                    {sections.map(({ icon: Icon, title, body }, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Section heading with icon */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                <Icon style={{ width: 20, height: 20, color: 'var(--color-brand)', flexShrink: 0, marginTop: 4 }} />
                                <h2 style={{
                                    fontFamily: 'var(--font-serif)', fontWeight: 700,
                                    fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                                    color: 'var(--color-text-main)', lineHeight: 1.2, margin: 0,
                                }}>
                                    {title}
                                </h2>
                            </div>

                            {/* Red rule */}
                            <span style={{ display: 'block', width: 32, height: 2, backgroundColor: 'var(--color-brand)', marginLeft: 32 }} />

                            {/* Body */}
                            <p style={{
                                fontFamily: 'var(--font-sans)', fontSize: 15,
                                color: 'var(--color-text-main)', lineHeight: 1.75,
                                marginLeft: 32,
                                padding: '1.25rem 1.5rem',
                                borderLeft: '3px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-card)',
                            }}>
                                {body}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── Footer CTA ── */}
                <div style={{
                    marginTop: '4rem', paddingTop: '2.5rem',
                    borderTop: '1px solid var(--color-border)',
                    textAlign: 'center',
                }}>
                    <h3 style={{
                        fontFamily: 'var(--font-serif)', fontWeight: 700,
                        fontSize: '1.5rem', color: 'var(--color-text-main)', marginBottom: 12,
                    }}>
                        Let CineBuffs Be Your Guide
                    </h3>
                    <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: 13,
                        color: 'var(--color-text-muted)', marginBottom: 8,
                    }}>
                        From Hollywood blockbusters to hidden gems — sit back, relax, and let us navigate cinema for you.
                    </p>
                    <p style={{
                        fontFamily: 'var(--font-serif)', fontSize: '1.1rem',
                        fontWeight: 700, color: 'var(--color-brand)',
                        letterSpacing: '0.05em',
                    }}>
                        Happy Watching.
                    </p>
                </div>
            </div>
        </div>
    );
}
