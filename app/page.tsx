import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { PricingCards } from '@/components/pricing-cards';

export const dynamic = 'force-dynamic';

const platforms = [
  { icon: '🐦', name: 'Twitter Thread', desc: '5-7 viral tweets' },
  { icon: '💼', name: 'LinkedIn Post', desc: 'Professional tone' },
  { icon: '📸', name: 'Instagram Caption', desc: 'With hashtags' },
  { icon: '🎬', name: 'TikTok Script', desc: 'Hook + talking points' },
  { icon: '📧', name: 'Newsletter Blurb', desc: 'Email-ready' },
];

const steps = [
  { num: '1', title: 'Paste URL', desc: 'Drop your blog post link' },
  { num: '2', title: 'Extract', desc: 'AI reads your content' },
  { num: '3', title: 'Generate', desc: '5 platform versions created' },
  { num: '4', title: 'Copy & Post', desc: 'Ready to publish' },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user ? { email: user.email || '' } : null} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              <span className="text-primary">🔄 One Blog Post.</span>
              <br />
              Five Platforms.
              <br />
              <span className="text-muted">60 Seconds.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10">
              Paste a blog URL and get ready-to-post content for Twitter, LinkedIn, Instagram, TikTok, and newsletters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  Start Free — 3 Repurposes/Month
                </Button>
              </Link>
              {user && (
                <Link href="/dashboard">
                  <Button variant="secondary" size="lg" className="text-lg px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              How It Works
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={step.num} className="relative text-center p-6">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted">{step.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              What You Get From One Post
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
                >
                  <span className="text-4xl block mb-3">{platform.icon}</span>
                  <h3 className="font-semibold text-foreground mb-1">{platform.name}</h3>
                  <p className="text-sm text-muted">{platform.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Simple Pricing
            </h2>
            <p className="text-center text-muted mb-12">
              Start free. Upgrade when you need more.
            </p>
            <PricingCards />
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Stop wasting time rewriting content.
            </h2>
            <p className="text-lg text-muted mb-8">
              Let AI handle the repurposing while you focus on creating.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started Free →
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
