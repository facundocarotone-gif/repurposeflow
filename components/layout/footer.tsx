import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔄</span>
            <span className="font-semibold text-foreground">RepurposeFlow</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <a href="mailto:hello@repurposeflow.com" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          <p className="text-sm text-muted">
            © {new Date().getFullYear()} RepurposeFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
