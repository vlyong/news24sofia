import { NextResponse } from 'next/server';
import { notifyGoogleOfUpdate } from '@/lib/google-indexing';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });

    const result = await notifyGoogleOfUpdate(url);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Indexing failed' }, { status: 500 });
  }
}
