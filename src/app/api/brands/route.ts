import { NextResponse } from 'next/server';
import { brandsData } from '@/db/brandsData';

export async function GET() {
  try {
    return NextResponse.json(brandsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch brands', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
