import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { extractContent } from '@/lib/extractor';
import { generateRepurposedContent } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check credits
    if (profile.credits <= 0) {
      return NextResponse.json(
        { error: 'No credits remaining. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Extract content
    const extracted = await extractContent(url);

    if (!extracted.content || extracted.word_count < 50) {
      return NextResponse.json(
        { error: 'Could not extract enough content from this URL' },
        { status: 400 }
      );
    }

    // Generate repurposed content
    const outputs = await generateRepurposedContent(
      extracted.content,
      extracted.title,
      profile.brand_voice
    );

    // Save to database
    const { data: repurpose, error: insertError } = await supabase
      .from('repurposes')
      .insert({
        user_id: user.id,
        source_url: url,
        source_title: extracted.title,
        source_content: extracted.content.slice(0, 5000),
        outputs,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save repurpose' }, { status: 500 });
    }

    // Decrement credits
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    return NextResponse.json({
      id: repurpose.id,
      source_url: repurpose.source_url,
      source_title: repurpose.source_title,
      outputs: repurpose.outputs,
      credits_remaining: profile.credits - 1,
    });
  } catch (error) {
    console.error('Repurpose error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to repurpose content' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: repurposes, error } = await supabase
      .from('repurposes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }

    return NextResponse.json(repurposes);
  } catch (error) {
    console.error('Get repurposes error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
