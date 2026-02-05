'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  credits: number;
  plan: string;
}

export function Sidebar({ credits, plan }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ];

  const maxCredits = plan === 'free' ? 3 : plan === 'creator' ? 30 : 999;

  return (
    <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === link.href
                ? 'bg-primary text-white'
                : 'text-muted hover:text-foreground hover:bg-background'
            )}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 p-4 bg-background rounded-lg border border-border">
        <p className="text-xs text-muted uppercase tracking-wide mb-2">Credits</p>
        <p className="text-2xl font-bold text-foreground">
          {credits}<span className="text-muted text-lg">/{maxCredits}</span>
        </p>
        <p className="text-xs text-muted mt-1 capitalize">{plan} plan</p>
      </div>
    </aside>
  );
}
