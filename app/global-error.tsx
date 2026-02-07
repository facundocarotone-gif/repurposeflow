'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body style={{ backgroundColor: '#0a0a0a', color: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '28rem' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔄</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#737373', marginBottom: '1.5rem' }}>
              We hit an unexpected error. Please try again.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
