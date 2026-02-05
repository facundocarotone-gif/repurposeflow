'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isValidUrl } from '@/lib/utils';

interface URLInputProps {
  disabled?: boolean;
  onSuccess?: () => void;
}

export function URLInput({ disabled, onSuccess }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to repurpose content');
      }

      setUrl('');
      onSuccess?.();
      router.push(`/dashboard/result/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <Input
          type="url"
          placeholder="https://your-blog.com/article-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={disabled || isLoading}
          className="flex-1"
          error={error}
        />
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={disabled || isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Content'}
        </Button>
      </div>
      {isLoading && (
        <p className="text-sm text-muted animate-pulse">
          ⏳ Extracting content and generating posts... This may take 15-30 seconds.
        </p>
      )}
    </form>
  );
}
