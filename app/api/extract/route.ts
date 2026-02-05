import { NextRequest, NextResponse } from 'next/server';
import { extractContent } from '@/lib/extractor';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const extracted = await extractContent(url);

    return NextResponse.json(extracted);
  } catch (error) {
    console.error('Extract error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract content' },
      { status: 500 }
    );
  }
}
