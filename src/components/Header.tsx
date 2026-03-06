'use client';

export default function Header() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'abc';
  return (
    <header
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '-1px',
              boxShadow: '0 2px 8px rgba(79,70,229,0.25)',
            }}
          >
            {appName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', letterSpacing: '-0.5px' }}>
              {appName.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-2px' }}>
              E-Commerce Price Calculator
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 999,
              padding: '0.25rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
            }}
          >
            🛒 Order Calculator
          </span>
        </div>
      </div>
    </header>
  );
}
