'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

interface Settings {
  brand_voice: string | null;
  example_posts: string[];
  email: string | null;
  plan: string;
  credits: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [brandVoice, setBrandVoice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const response = await fetch('/api/user/settings');
    if (response.ok) {
      const data = await response.json();
      setSettings(data);
      setBrandVoice(data.brand_voice || '');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_voice: brandVoice }),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings');
      }
    } catch {
      setMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const maxCredits = settings.plan === 'free' ? 3 : settings.plan === 'creator' ? 30 : 999;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            ← Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Brand Voice */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🎯 Brand Voice</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted mb-4">
            Describe your writing style and tone. This helps the AI match your voice when generating content.
          </p>
          <Textarea
            value={brandVoice}
            onChange={(e) => setBrandVoice(e.target.value)}
            placeholder="Professional but approachable. I use casual language with occasional humor. I avoid jargon and prefer simple explanations. My audience is tech-savvy but not necessarily developers."
            rows={4}
          />
          <div className="flex items-center gap-4 mt-4">
            <Button onClick={handleSave} isLoading={isSaving}>
              Save Changes
            </Button>
            {message && (
              <span className={`text-sm ${message.includes('success') ? 'text-success' : 'text-error'}`}>
                {message}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>👤 Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted">Email</span>
            <span className="text-foreground">{settings.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted">Plan</span>
            <Badge>{settings.plan}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted">Credits Remaining</span>
            <span className="text-foreground font-semibold">
              {settings.credits}/{maxCredits}
            </span>
          </div>
          
          {settings.plan === 'free' && (
            <div className="pt-4 border-t border-border">
              <a
                href="mailto:hello@repurposeflow.com?subject=Upgrade%20to%20Creator"
                className="block"
              >
                <Button variant="secondary" className="w-full">
                  Upgrade to Creator — $19/mo
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
