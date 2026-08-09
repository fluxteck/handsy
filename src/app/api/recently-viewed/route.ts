import { recentlyViewedData } from '@/db/recentlyViewedData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(recentlyViewedData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recently viewed data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
