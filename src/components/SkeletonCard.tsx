export default function SkeletonCard() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-card)',
        }}>
            {/* Poster placeholder — 3:4 ratio matching ReviewCard */}
            <div style={{
                width: '100%',
                paddingTop: '133%',
                position: 'relative',
                flexShrink: 0,
            }}>
                <div
                    className="skeleton-shimmer"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'var(--color-border)',
                    }}
                />
            </div>

            {/* Content placeholder */}
            <div style={{
                padding: '10px 12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
            }}>
                {/* Rating line */}
                <div className="skeleton-shimmer" style={{ height: 11, width: '40%', borderRadius: 2 }} />

                {/* Title lines */}
                <div className="skeleton-shimmer" style={{ height: 13, width: '90%', borderRadius: 2 }} />
                <div className="skeleton-shimmer" style={{ height: 13, width: '70%', borderRadius: 2 }} />
                <div className="skeleton-shimmer" style={{ height: 13, width: '55%', borderRadius: 2 }} />

                {/* Author + date */}
                <div style={{
                    marginTop: 6,
                    paddingTop: 8,
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <div className="skeleton-shimmer" style={{ height: 10, width: '45%', borderRadius: 2 }} />
                    <div className="skeleton-shimmer" style={{ height: 10, width: '25%', borderRadius: 2 }} />
                </div>
            </div>
        </div>
    );
}
