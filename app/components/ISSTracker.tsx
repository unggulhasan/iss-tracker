'use client';

import { useEffect, useState, useCallback } from 'react';

interface ISSPosition {
  latitude: string;
  longitude: string;
  timestamp: number;
}

interface ISSApiResponse {
  iss_position: { latitude: string; longitude: string };
  timestamp: number;
  message: string;
}

interface AstronautsApiResponse {
  people: { name: string; craft: string }[];
  number: number;
  message: string;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 8, height: 8,
      borderRadius: '50%',
      background: active ? 'var(--accent3)' : 'var(--muted)',
      animation: active ? 'pulse-dot 2s ease-in-out infinite' : 'none',
      marginRight: 8,
      flexShrink: 0,
    }} />
  );
}

export default function ISSTracker() {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [astronauts, setAstronauts] = useState<{ name: string; craft: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosition = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('http://api.open-notify.org/iss-now.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ISSApiResponse = await res.json();
      setPosition({
        latitude: parseFloat(data.iss_position.latitude).toFixed(4),
        longitude: parseFloat(data.iss_position.longitude).toFixed(4),
        timestamp: data.timestamp,
      });
      setLastUpdate(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch ISS position');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const fetchAstronauts = useCallback(async () => {
    try {
      const res = await fetch('https://api.open-notify.org/astros.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: AstronautsApiResponse = await res.json();
      setAstronauts(data.people);
    } catch {
      // non-critical, silently fail
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchPosition(), fetchAstronauts()]);
      setLoading(false);
    };
    init();
    const interval = setInterval(() => fetchPosition(), 10000);
    return () => clearInterval(interval);
  }, [fetchPosition, fetchAstronauts]);

  const issAstronauts = astronauts.filter(a => a.craft === 'ISS');

  return (
    <section style={{
      position: 'relative',
      zIndex: 1,
      padding: '0 1.5rem 4rem',
      maxWidth: 960,
      margin: '0 auto',
    }}>
      {/* Section Header */}
      <div className="fade-up-2" style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8,
        }}>
          <div style={{
            width: 2, height: 32,
            background: 'linear-gradient(to bottom, var(--accent), transparent)',
          }} />
          <p className="mono" style={{
            fontSize: '0.7rem', letterSpacing: '0.2em',
            color: 'var(--accent)', textTransform: 'uppercase',
          }}>Live Feed · open-notify.org API</p>
        </div>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 800, lineHeight: 1.1,
          marginBottom: 8,
        }}>
          ISS Real-Time Tracker
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: 480 }}>
          Live position data from the International Space Station, refreshed every 10 seconds.
        </p>
      </div>

      {loading ? (
        <div className="fade-up-3" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '3rem', justifyContent: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
        }}>
          <div style={{
            width: 20, height: 20,
            border: '2px solid var(--border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
            Acquiring signal…
          </span>
        </div>
      ) : error ? (
        <div style={{
          padding: '2rem',
          border: '1px solid rgba(252,129,129,0.3)',
          borderRadius: 16, background: 'rgba(252,129,129,0.05)',
          color: 'var(--danger)',
        }}>
          <span className="mono" style={{ fontSize: '0.8rem' }}>⚠ {error}</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {/* Main Position Card */}
          <div className="fade-up-3" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
            position: 'relative',
            animation: 'glow 4s ease-in-out infinite',
          }}>
            {/* Scanline effect */}
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(99,179,237,.4), transparent)',
              animation: 'scanline 4s linear infinite',
              pointerEvents: 'none', zIndex: 2,
            }} />

            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <StatusDot active={true} />
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent3)' }}>
                  LIVE TELEMETRY
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {lastUpdate && (
                  <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                    Updated {lastUpdate.toLocaleTimeString()}
                  </span>
                )}
                <button
                  onClick={() => fetchPosition(true)}
                  disabled={refreshing}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: refreshing ? 'var(--muted)' : 'var(--accent)',
                    padding: '4px 12px',
                    borderRadius: 6,
                    cursor: refreshing ? 'default' : 'pointer',
                    fontSize: '0.7rem',
                    fontFamily: 'Space Mono, monospace',
                    transition: 'all .2s',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  {refreshing ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        width: 10, height: 10,
                        border: '1.5px solid var(--muted)',
                        borderTopColor: 'var(--accent)',
                        borderRadius: '50%',
                        animation: 'spin .8s linear infinite',
                        display: 'inline-block',
                      }} />
                      UPDATING
                    </span>
                  ) : '↻ REFRESH'}
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 0,
            }}>
              {[
                { label: 'LATITUDE', value: position?.latitude ?? '—', unit: '°', color: 'var(--accent)' },
                { label: 'LONGITUDE', value: position?.longitude ?? '—', unit: '°', color: 'var(--accent2)' },
                { label: 'ALTITUDE', value: '408', unit: 'km', color: 'var(--accent3)' },
                { label: 'VELOCITY', value: '27,600', unit: 'km/h', color: '#b794f4' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '1.75rem 1.5rem',
                  borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                  borderBottom: '0',
                }}>
                  <p className="mono" style={{
                    fontSize: '0.6rem', letterSpacing: '0.18em',
                    color: 'var(--muted)', marginBottom: 10,
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    fontWeight: 700, lineHeight: 1,
                    color: item.color,
                    fontFamily: 'Space Mono, monospace',
                  }}>
                    {item.value}
                    <span style={{ fontSize: '0.8rem', marginLeft: 4, color: 'var(--muted)' }}>
                      {item.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}>
            {/* Crew Card */}
            <div className="fade-up-4" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.1rem' }}>👨‍🚀</span>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>ISS Crew</h3>
                <span style={{
                  marginLeft: 'auto',
                  background: 'rgba(99,179,237,0.1)',
                  border: '1px solid rgba(99,179,237,.2)',
                  color: 'var(--accent)',
                  padding: '2px 10px', borderRadius: 999,
                  fontSize: '0.7rem', fontFamily: 'Space Mono, monospace',
                }}>
                  {issAstronauts.length} aboard
                </span>
              </div>
              {issAstronauts.length === 0 ? (
                <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
                  No crew data available
                </p>
              ) : (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {issAstronauts.map((a, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: `hsl(${i * 47 + 200}, 60%, 35%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
                        color: 'white',
                      }}>
                        {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ fontSize: '0.85rem' }}>{a.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Orbit info */}
            <div className="fade-up-4" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🛰️</span>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Orbital Data</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Orbital Period', value: '92.68 min' },
                  { label: 'Inclination', value: '51.64°' },
                  { label: 'Orbits per day', value: '~15.5' },
                  { label: 'API Source', value: 'open-notify.org' },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{row.label}</span>
                    <span className="mono" style={{ fontSize: '0.82rem', color: 'var(--text)' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
