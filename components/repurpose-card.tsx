'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Repurpose } from '@/types';

interface RepurposeCardProps {
  repurpose: Repurpose;
  onDelete?: () => void;
}

export function RepurposeCard({ repurpose, onDelete }: RepurposeCardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this?')) return;

    try {
      const response = await fetch(`/api/repurpose/${repurpose.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete?.();
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const outputCount = Object.keys(repurpose.outputs).length;

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">📄</span>
            <h3 className="font-medium text-foreground truncate">
              {repurpose.source_title || 'Untitled'}
            </h3>
          </div>
          <p className="text-sm text-muted truncate mb-2">{repurpose.source_url}</p>
          <p className="text-xs text-muted">
            {formatDate(repurpose.created_at)} • {outputCount} outputs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/result/${repurpose.id}`}>
            <Button variant="secondary" size="sm">View</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-error hover:text-error">
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
