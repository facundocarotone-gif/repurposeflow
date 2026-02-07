'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center p-8 max-w-md">
        <span className="text-5xl block mb-4">🔄</span>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted mb-6">
          We hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
