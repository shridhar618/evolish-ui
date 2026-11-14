export function LogoMark({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="lm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b47d6" />
          <stop offset="1" stopColor="#2c1f86" />
        </linearGradient>
      </defs>
      <circle cx="28" cy="32" r="24" fill="url(#lm-g)" />
      <path d="M15 35c0-8.5 6.4-14 14-14 6.8 0 12 4.2 12 9.5H19.5" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path d="M19 41c3 4 7 6 11.5 6 4 0 7.5-1.4 10-4" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".55" />
      <circle cx="33.5" cy="27.5" r="3.6" fill="#22b8e6" />
      <g className="logo-waves" fill="none" stroke="#5b47d6" strokeWidth="3" strokeLinecap="round">
        <path d="M53 25c2.6 3.8 2.6 10.2 0 14" />
        <path d="M58.5 20.5c4.6 6.4 4.6 16.6 0 23" />
      </g>
    </svg>
  )
}

export default function Logo({ light = false }) {
  return (
    <a href="#top" className="logo" aria-label="Evolish home">
      <LogoMark size={46} />
      <span className="logo-text">
        <strong style={{ color: light ? '#fff' : 'var(--ink)' }}>evolish</strong>
        <small style={{ color: light ? 'rgba(255,255,255,.75)' : 'var(--ink)' }}>ENGLISH LEARNING</small>
      </span>
    </a>
  )
}
