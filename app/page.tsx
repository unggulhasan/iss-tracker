import ISSTracker from './components/ISSTracker';

export const metadata = {
  title: 'ISS Live Tracker',
  description: 'Real-time International Space Station position tracker',
};

export default function Home() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero */}
      <header style={{
        textAlign: 'center',
        padding: '5rem 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow orb */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -60%)',
          width: 600, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(99,179,237,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="fade-up" style={{ marginBottom: '1rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px',
            border: '1px solid rgba(99,179,237,0.3)',
            borderRadius: 999,
            fontSize: '0.7rem',
            fontFamily: 'Space Mono, monospace',
            color: 'var(--accent)',
            letterSpacing: '0.15em',
            background: 'rgba(99,179,237,0.06)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--accent3)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            LIVE · ISS TELEMETRY FEED
          </span>
        </div>

        <h1 className="fade-up-2" style={{
          fontSize: 'clamp(2.4rem, 8vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          marginBottom: '1rem',
        }}>
          Where is the{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Space Station
          </span>
          {' '}right now?
        </h1>

        <p className="fade-up-3" style={{
          color: 'var(--muted)',
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          maxWidth: 520,
          margin: '0 auto 3rem',
          lineHeight: 1.6,
        }}>
          The ISS orbits Earth at ~408 km altitude, completing a full orbit every 92 minutes.
          Track its exact position in real time below.
        </p>
      </header>

      <ISSTracker />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1.5rem 3rem',
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--border)',
        color: 'var(--muted)',
      }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
          POSITION DATA · open-notify.org · Refreshes every 10s
        </p>
      </footer>
    </main>
  );
}
