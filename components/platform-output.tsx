'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';

interface PlatformOutputProps {
  platform: string;
  icon: string;
  content: string | string[];
}

export function PlatformOutput({ platform, icon, content }: PlatformOutputProps) {
  const isThread = Array.isArray(content);
  const copyText = isThread ? content.join('\n\n') : content;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span>{icon}</span>
          {platform}
        </CardTitle>
        <CopyButton text={copyText} />
      </CardHeader>
      <CardContent>
        {isThread ? (
          <div className="space-y-4">
            {content.map((tweet, index) => (
              <div
                key={index}
                className="relative pl-4 border-l-2 border-primary/30"
              >
                <span className="absolute -left-2.5 top-0 bg-card px-1 text-xs text-muted">
                  {index + 1}/{content.length}
                </span>
                <p className="text-foreground whitespace-pre-wrap pt-1">{tweet}</p>
                <CopyButton text={tweet} className="mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-foreground whitespace-pre-wrap">{content}</p>
        )}
      </CardContent>
    </Card>
  );
}
