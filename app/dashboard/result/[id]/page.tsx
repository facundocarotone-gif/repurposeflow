import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PlatformOutput } from '@/components/platform-output';
import { Button } from '@/components/ui/button';
import { Repurpose } from '@/types';

export const dynamic = 'force-dynamic';

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: repurpose } = await supabase
    .from('repurposes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single();

  if (!repurpose) {
    notFound();
  }

  const result = repurpose as Repurpose;

  const platforms = [
    { key: 'twitter_thread', name: 'Twitter Thread', icon: '🐦' },
    { key: 'linkedin_post', name: 'LinkedIn Post', icon: '💼' },
    { key: 'instagram_caption', name: 'Instagram Caption', icon: '📸' },
    { key: 'tiktok_script', name: 'TikTok Script', icon: '🎬' },
    { key: 'newsletter_blurb', name: 'Newsletter Blurb', icon: '📧' },
  ] as const;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            ← Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {result.source_title || 'Untitled'}
        </h1>
        <p className="text-sm text-muted truncate">{result.source_url}</p>
      </div>

      <div className="space-y-6">
        {platforms.map(({ key, name, icon }) => {
          const content = result.outputs[key];
          if (!content) return null;

          return (
            <PlatformOutput
              key={key}
              platform={name}
              icon={icon}
              content={content}
            />
          );
        })}
      </div>
    </div>
  );
}
