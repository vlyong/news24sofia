import { NextResponse } from 'next/server';
import { getSettings, saveSettings, SiteSettings } from '@/lib/settings';

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  try {
    const settings: SiteSettings = await request.json();
    const success = await saveSettings(settings);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to save to database' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid settings' }, { status: 400 });
  }
}
