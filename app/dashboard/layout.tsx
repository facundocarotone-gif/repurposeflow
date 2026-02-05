import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits, plan')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={{ email: user.email || '' }} />
      <div className="flex flex-1">
        <Sidebar 
          credits={profile?.credits ?? 3} 
          plan={profile?.plan ?? 'free'} 
        />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
