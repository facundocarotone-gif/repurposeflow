import { createClient } from '@/lib/supabase/server';
import { URLInput } from '@/components/url-input';
import { RepurposeCard } from '@/components/repurpose-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Repurpose } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user!.id)
    .single();

  const { data: repurposes } = await supabase
    .from('repurposes')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const hasCredits = (profile?.credits ?? 0) > 0;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      {/* New Repurpose Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>✨ New Repurpose</CardTitle>
        </CardHeader>
        <CardContent>
          {hasCredits ? (
            <URLInput />
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-4">
                You&apos;ve used all your credits this month.
              </p>
              <a
                href="mailto:hello@repurposeflow.com?subject=Upgrade%20to%20Creator"
                className="text-primary hover:underline"
              >
                Upgrade to Creator for 30 repurposes/month →
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Recent Repurposes
        </h2>
        {repurposes && repurposes.length > 0 ? (
          <div className="space-y-4">
            {(repurposes as Repurpose[]).map((repurpose) => (
              <RepurposeCard key={repurpose.id} repurpose={repurpose} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-muted">
                No repurposes yet. Paste a blog URL above to get started!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
